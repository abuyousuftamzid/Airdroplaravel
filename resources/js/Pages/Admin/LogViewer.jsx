import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LogViewer({
    title,
    logs,
    files = [],
    folders = [],
    currentFile,
    currentFolder,
    standardFormat = true,
    debug = null
}) {
    const [darkMode, setDarkMode] = useState(false);
    const [expandedStacks, setExpandedStacks] = useState({});

    useEffect(() => {
        // Load dark mode preference from localStorage
        const darkThemeSelected = localStorage.getItem('darkSwitch') === 'dark';
        setDarkMode(darkThemeSelected);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkSwitch', newDarkMode ? 'dark' : 'light');
    };

    const toggleStack = (key) => {
        setExpandedStacks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const confirmAction = (message) => {
        return window.confirm(message);
    };

    const getLevelClass = (level) => {
        const levelClasses = {
            'emergency': 'text-red-800',
            'alert': 'text-red-700',
            'critical': 'text-red-600',
            'error': 'text-red-500',
            'warning': 'text-yellow-500',
            'notice': 'text-blue-500',
            'info': 'text-blue-400',
            'debug': 'text-gray-500'
        };
        return levelClasses[level?.toLowerCase()] || 'text-gray-600';
    };

    const getLevelIcon = (level) => {
        const levelIcons = {
            'emergency': '🚨',
            'alert': '🔔',
            'critical': '❌',
            'error': '❗',
            'warning': '⚠️',
            'notice': 'ℹ️',
            'info': 'ℹ️',
            'debug': '🐛'
        };
        return levelIcons[level?.toLowerCase()] || 'ℹ️';
    };

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                📋 Laravel Log Viewer
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                <em>System Log Management</em>
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Dark Mode Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={toggleDarkMode}
                                    className="sr-only"
                                />
                                <div className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-sm">Dark Mode</span>
                            </label>
                        </div>
                    </div>

                    {/* Debug Info (temporary) */}


                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                                <h3 className="font-semibold mb-4">Log Files</h3>

                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {folders.map((folder, index) => (
                                        <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            📁 {folder}
                                        </div>
                                    ))}

                                    {files.map((file, index) => (
                                        <Link
                                            key={index}
                                            href={`/admin/logs?l=${encodeURIComponent(file)}`}
                                            className={`block p-2 rounded text-sm transition-colors ${
                                                currentFile === file
                                                    ? darkMode
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-blue-100 text-blue-800'
                                                    : darkMode
                                                        ? 'hover:bg-gray-700'
                                                        : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            📄 {file}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {logs === null ? (
                                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 text-center`}>
                                    <p className="text-lg">Log file is too large (>50MB). Please download it to view.</p>
                                </div>
                            ) : (
                                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
                                    {/* Log Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                <tr>
                                                    {standardFormat && (
                                                        <>
                                                            <th className="px-4 py-3 text-left font-medium">Level</th>
                                                            <th className="px-4 py-3 text-left font-medium">Date</th>
                                                        </>
                                                    )}
                                                    {!standardFormat && (
                                                        <th className="px-4 py-3 text-left font-medium">Line</th>
                                                    )}
                                                    <th className="px-4 py-3 text-left font-medium">Content</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {logs && logs.map((log, key) => (
                                                    <tr key={key} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                                        {standardFormat && (
                                                            <>
                                                                <td className={`px-4 py-3 ${getLevelClass(log.level)}`}>
                                                                    <span className="mr-2">{getLevelIcon(log.level)}</span>
                                                                    {log.level}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs whitespace-nowrap">{log.date}</td>
                                                            </>
                                                        )}
                                                        {!standardFormat && (
                                                            <td className="px-4 py-3 text-xs">{log.date}</td>
                                                        )}
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-start gap-2">
                                                                <div className="flex-1">
                                                                    <div className="break-words">{log.text}</div>
                                                                    {log.in_file && (
                                                                        <div className="text-xs text-gray-500 mt-1">{log.in_file}</div>
                                                                    )}
                                                                    {expandedStacks[key] && (
                                                                        <div className="mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800">
                                                                            {log.context && (
                                                                                <div className="mb-2 text-gray-800 dark:text-gray-200">
                                                                                    <strong className="text-gray-900 dark:text-gray-100">Context:</strong>
                                                                                    <span className="ml-1">{log.context}</span>
                                                                                </div>
                                                                            )}
                                                                            {log.stack && (
                                                                                <div className="font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                                                    <strong className="text-gray-900 dark:text-gray-100">Stack Trace:</strong><br/>
                                                                                    <div className="mt-1 text-gray-600 dark:text-gray-400">
                                                                                        {log.stack.trim()}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {(log.stack || log.context) && (
                                                                    <button
                                                                        onClick={() => toggleStack(key)}
                                                                        className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                                                                    >
                                                                        🔍
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* File Actions */}
                                    {currentFile && (
                                        <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t px-4 py-3`}>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <Link
                                                    href={`/admin/logs?dl=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    ⬇️ Download file
                                                </Link>

                                                <Link
                                                    href={`/admin/logs?clean=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                                    onClick={(e) => {
                                                        if (!confirmAction('Are you sure you want to clean this log file?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                                                >
                                                    🔄 Clean file
                                                </Link>

                                                <Link
                                                    href={`/admin/logs?del=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                                    onClick={(e) => {
                                                        if (!confirmAction('Are you sure you want to delete this log file?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    🗑️ Delete file
                                                </Link>

                                                {files.length > 1 && (
                                                    <Link
                                                        href={`/admin/logs?delall=true${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                                        onClick={(e) => {
                                                            if (!confirmAction('Are you sure you want to delete ALL log files?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                    >
                                                        🗑️ Delete all files
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
