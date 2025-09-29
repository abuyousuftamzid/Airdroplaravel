<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class LogViewerController extends Controller
{

    /**
     * Display the log viewer as an Inertia page
     */
    public function index(Request $request)
    {
        $currentFile = null;
        $currentFolder = null;

        // Get the current file from request
        if ($request->get('l')) {
            $currentFile = urldecode($request->get('l'));
        }

        if ($request->get('f')) {
            $currentFolder = urldecode($request->get('f'));
        }

        // Handle file operations
        if ($request->get('dl')) {
            $fileToDownload = $this->decodeParameter($request->get('dl'));
            if ($fileToDownload) {
                return $this->downloadLogFile($fileToDownload);
            }
        }

        if ($request->get('clean')) {
            $fileToClean = $this->decodeParameter($request->get('clean'));
            if ($fileToClean) {
                $this->cleanLogFile($fileToClean);
                return redirect()->back()->with('success', 'Log file cleaned successfully');
            }
        }

        if ($request->get('del')) {
            $fileToDelete = $this->decodeParameter($request->get('del'));
            if ($fileToDelete) {
                $this->deleteLogFile($fileToDelete);
                return redirect()->back()->with('success', 'Log file deleted successfully');
            }
        }

        if ($request->get('delall')) {
            $this->deleteAllLogFiles();
            return redirect()->back()->with('success', 'All log files deleted successfully');
        }

        // Get log data
        try {
            $logData = $this->getLogData($currentFile);

            // Validate that the data can be JSON encoded
            $testJson = json_encode($logData['logs']);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('JSON encoding error: ' . json_last_error_msg());
            }

        } catch (\Exception $e) {
            // If there's an error, provide safe fallback data
            $logData = [
                'logs' => [[
                    'date' => date('Y-m-d H:i:s'),
                    'level' => 'ERROR',
                    'level_class' => 'danger',
                    'level_img' => 'exclamation-triangle',
                    'context' => '',
                    'text' => 'Error loading log file: ' . $this->cleanTextForJson($e->getMessage()),
                    'in_file' => '',
                    'stack' => null
                ]],
                'files' => [],
                'folders' => [],
                'current_file' => $currentFile,
                'standardFormat' => true,
                'structure' => []
            ];
        }

        return Inertia::render('Admin/LogViewer', [
            'title' => 'System Logs',
            'logs' => $logData['logs'],
            'files' => $logData['files'],
            'folders' => $logData['folders'],
            'currentFile' => $logData['current_file'],
            'currentFolder' => $currentFolder,
            'standardFormat' => $logData['standardFormat'],
            'structure' => $logData['structure'],
            'storagePath' => storage_path('logs'),
            'debug' => [
                'requestedFile' => $request->get('l'),
                'decodedFile' => $currentFile,
                'availableFiles' => $logData['files']
            ]
        ]);
    }

    /**
     * Decode parameter (try multiple methods)
     */
    private function decodeParameter($param)
    {
        if (!$param) return null;

        try {
            // Try to decrypt first (for backward compatibility)
            return decrypt($param);
        } catch (\Exception $e) {
            try {
                // Try base64 decode (for backward compatibility)
                $decoded = base64_decode($param);
                // Check if it's valid base64
                if (base64_encode($decoded) === $param) {
                    return $decoded;
                }
            } catch (\Exception $e2) {
                // Continue to URL decode
            }
            // Default to URL decode
            return urldecode($param);
        }
    }

    /**
     * Get log data from files
     */
    private function getLogData($currentFile = null)
    {
        $logPath = storage_path('logs');
        $files = [];
        $folders = [];
        $logs = [];
        $standardFormat = true;

        // Get all log files
        if (File::exists($logPath)) {
            $allFiles = File::files($logPath);
            foreach ($allFiles as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'log') {
                    $files[] = $file->getFilename();
                }
            }
            // Sort files by name (most recent first for date-based names)
            rsort($files);
        }

        // If no current file specified, use the latest one
        if (!$currentFile && !empty($files)) {
            $currentFile = $files[0];
        }

        // Parse logs from current file
        if ($currentFile && File::exists($logPath . '/' . $currentFile)) {
            // Validate file before attempting to read
            if ($this->isValidLogFile($logPath . '/' . $currentFile)) {
                $logs = $this->parseLogFile($logPath . '/' . $currentFile);
            } else {
                $logs = [[
                    'date' => date('Y-m-d H:i:s'),
                    'level' => 'WARNING',
                    'level_class' => 'warning',
                    'level_img' => 'exclamation-triangle',
                    'context' => '',
                    'text' => 'File appears to be corrupted or not a valid log file: ' . $currentFile,
                    'in_file' => '',
                    'stack' => null
                ]];
            }
        }

        return [
            'logs' => $logs,
            'files' => $files,
            'folders' => $folders,
            'current_file' => $currentFile,
            'standardFormat' => $standardFormat,
            'structure' => []
        ];
    }

    /**
     * Parse log file content
     */
    private function parseLogFile($filePath)
    {
        $logs = [];

        if (!File::exists($filePath)) {
            return $logs;
        }

        try {
            // Read file with UTF-8 encoding and handle potential encoding issues
            $content = File::get($filePath);

            // Clean up any malformed UTF-8 characters
            $content = mb_convert_encoding($content, 'UTF-8', 'UTF-8');

            // Remove or replace any remaining problematic characters
            $content = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $content);

            $lines = explode("\n", $content);
        } catch (\Exception $e) {
            // If file reading fails, return empty logs with error message
            return [[
                'date' => date('Y-m-d H:i:s'),
                'level' => 'ERROR',
                'level_class' => 'danger',
                'level_img' => 'exclamation-triangle',
                'context' => '',
                'text' => 'Error reading log file: ' . $e->getMessage(),
                'in_file' => '',
                'stack' => null
            ]];
        }

        $currentLog = null;
        $stackTrace = [];

        foreach ($lines as $index => $line) {
            if (empty(trim($line))) continue;

            // Clean the line to ensure it's safe for JSON encoding
            $cleanLine = $this->cleanTextForJson($line);

            // Try to parse Laravel log format
            if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \w+\.(\w+): (.*)/', $cleanLine, $matches)) {
                // If we have a previous log entry, save it with its stack trace
                if ($currentLog !== null) {
                    $currentLog['stack'] = !empty($stackTrace) ? implode("\n", $stackTrace) : null;
                    $logs[] = $currentLog;
                }

                // Start new log entry
                $currentLog = [
                    'date' => $matches[1],
                    'level' => strtoupper($matches[2]),
                    'level_class' => $this->getLevelClass($matches[2]),
                    'level_img' => $this->getLevelIcon($matches[2]),
                    'context' => '',
                    'text' => $this->cleanTextForJson($matches[3]),
                    'in_file' => '',
                    'stack' => null
                ];
                $stackTrace = [];
            } else {
                // This line is part of a stack trace or continuation
                if ($currentLog !== null) {
                    // Check if this looks like a stack trace line
                    if (preg_match('/^#\d+/', $cleanLine) ||
                        strpos($cleanLine, 'at ') === 0 ||
                        strpos($cleanLine, 'in ') === 0 ||
                        strpos($cleanLine, 'C:\\') === 0 ||
                        strpos($cleanLine, '/') === 0 ||
                        $cleanLine === '}' ||
                        $cleanLine === '{main}') {
                        $stackTrace[] = $cleanLine;
                    } else {
                        // This might be context information
                        if (empty($currentLog['context'])) {
                            $currentLog['context'] = $cleanLine;
                        } else {
                            $stackTrace[] = $cleanLine;
                        }
                    }
                } else {
                    // No current log entry, skip this line (it's probably a malformed log)
                    continue;
                }
            }
        }

        // Don't forget the last log entry
        if ($currentLog !== null) {
            $currentLog['stack'] = !empty($stackTrace) ? implode("\n", $stackTrace) : null;
            $logs[] = $currentLog;
        }

        return array_reverse($logs); // Show newest first
    }

    /**
     * Validate if a file is a valid log file
     */
    private function isValidLogFile($filePath)
    {
        try {
            // Check file size (skip files over 100MB)
            if (filesize($filePath) > 100 * 1024 * 1024) {
                return false;
            }

            // Check if file is readable
            if (!is_readable($filePath)) {
                return false;
            }

            // Read first few bytes to check if it's a text file
            $handle = fopen($filePath, 'r');
            if (!$handle) {
                return false;
            }

            $sample = fread($handle, 1024);
            fclose($handle);

            // Check if the sample contains mainly text characters
            if (strlen($sample) === 0) {
                return true; // Empty file is valid
            }

            // Count non-printable characters
            $nonPrintableCount = 0;
            $totalChars = strlen($sample);

            for ($i = 0; $i < $totalChars; $i++) {
                $char = ord($sample[$i]);
                // Allow printable ASCII, tabs, newlines, and carriage returns
                if ($char < 32 && $char !== 9 && $char !== 10 && $char !== 13) {
                    $nonPrintableCount++;
                }
                if ($char > 126) {
                    $nonPrintableCount++;
                }
            }

            // If more than 10% non-printable characters, consider it binary
            return ($nonPrintableCount / $totalChars) < 0.1;

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Clean text to ensure it's safe for JSON encoding
     */
    private function cleanTextForJson($text)
    {
        if (!is_string($text)) {
            return '';
        }

        // Convert to UTF-8 if needed
        if (!mb_check_encoding($text, 'UTF-8')) {
            $text = mb_convert_encoding($text, 'UTF-8', 'auto');
        }

        // Remove control characters except newlines and tabs
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);

        // Remove any remaining non-UTF8 sequences
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);

        // Ensure valid UTF-8 encoding
        if (!mb_check_encoding($text, 'UTF-8')) {
            $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
        }

        // Truncate very long lines to prevent memory issues
        if (strlen($text) > 10000) {
            $text = substr($text, 0, 10000) . '... [truncated]';
        }

        return $text;
    }

    /**
     * Get CSS class for log level
     */
    private function getLevelClass($level)
    {
        $classes = [
            'emergency' => 'danger',
            'alert' => 'danger',
            'critical' => 'danger',
            'error' => 'danger',
            'warning' => 'warning',
            'notice' => 'info',
            'info' => 'info',
            'debug' => 'secondary'
        ];

        return $classes[strtolower($level)] ?? 'info';
    }

    /**
     * Get icon for log level
     */
    private function getLevelIcon($level)
    {
        $icons = [
            'emergency' => 'fire',
            'alert' => 'bell',
            'critical' => 'times-circle',
            'error' => 'exclamation-triangle',
            'warning' => 'exclamation-triangle',
            'notice' => 'info-circle',
            'info' => 'info-circle',
            'debug' => 'bug'
        ];

        return $icons[strtolower($level)] ?? 'info-circle';
    }

    /**
     * Download log file
     */
    private function downloadLogFile($filename)
    {
        $filePath = storage_path('logs/' . $filename);

        if (!File::exists($filePath)) {
            abort(404, 'Log file not found');
        }

        return Response::download($filePath);
    }

    /**
     * Clean log file content
     */
    private function cleanLogFile($filename)
    {
        $filePath = storage_path('logs/' . $filename);

        if (File::exists($filePath)) {
            File::put($filePath, '');
        }
    }

    /**
     * Delete single log file
     */
    private function deleteLogFile($filename)
    {
        $filePath = storage_path('logs/' . $filename);

        if (File::exists($filePath)) {
            File::delete($filePath);
        }
    }

    /**
     * Delete all log files
     */
    private function deleteAllLogFiles()
    {
        $logPath = storage_path('logs');
        $files = File::files($logPath);

        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'log') {
                File::delete($file);
            }
        }
    }
}
