<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DeliveryLocations;
use App\Models\EmployeeRoleManage;
use App\Models\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

/**
 * Employee Management Controller for Admin module
 * Handles all employee CRUD operations and management
 */
class EmployeeController extends Controller
{
    /**
     * Display a listing of employees with filters and pagination
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get filter parameters
        $statusFilter = $request->get('status', '');
        $roleFilter = $request->get('role', '');
        $perPage = $request->get('per_page', 10);
        $searchQuery = $request->get('search', '');
        $page = $request->get('page', 1);

        // Build query
        $query = User::where('is_deleted', false)
                    ->where('user_type', '!=', 'customer');

        // Apply status filter
        if ($statusFilter) {
            $query->where('user_account_status', $statusFilter);
        }

        // Apply role filter
        if ($roleFilter) {
            $query->where('user_type', $roleFilter);
        }

        // Apply search filter
        if ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('user_first_last_name', 'like', "%{$searchQuery}%")
                  ->orWhere('user_second_last_name', 'like', "%{$searchQuery}%")
                  ->orWhere('user_email', 'like', "%{$searchQuery}%")
                  ->orWhere('user_account_number', 'like', "%{$searchQuery}%");
            });
        }

        // Handle CSV export
        if ($request->has('export') && $request->export === 'csv') {
            $employees = $query->orderBy('user_signup_date', 'desc')
                             ->orderBy('user_id', 'desc')
                             ->get();

            $selectedColumns = $request->get('columns', [
                'user_address', 'user_fullname', 'user_account_no',
                'user_email', 'user_signup_date', 'user_mobile', 'user_role'
            ]);

            $headers = [];
            foreach ($selectedColumns as $column) {
                switch ($column) {
                    case 'user_address':
                        $headers[] = 'Address';
                        break;
                    case 'user_fullname':
                        $headers[] = 'Full Name';
                        break;
                    case 'user_account_no':
                        $headers[] = 'Account Number';
                        break;
                    case 'user_email':
                        $headers[] = 'Email';
                        break;
                    case 'user_signup_date':
                        $headers[] = 'Signup Date';
                        break;
                    case 'user_mobile':
                        $headers[] = 'Mobile';
                        break;
                    case 'user_role':
                        $headers[] = 'User Role';
                        break;
                }
            }

            $csvData = [];
            $csvData[] = $headers;

            // Add data rows
            foreach ($employees as $employee) {
                $row = [];
                foreach ($selectedColumns as $column) {
                    switch ($column) {
                        case 'user_address':
                            $address = trim($employee->user_address_line_1 . ' ' . $employee->user_address_line_2 . ' ' . $employee->user_address_city . ' ' . $employee->user_address_state);
                            $row[] = $address ?: 'N/A';
                            break;
                        case 'user_fullname':
                            $fullName = trim($employee->user_first_last_name . ' ' . $employee->user_second_last_name);
                            $row[] = $fullName ?: 'N/A';
                            break;
                        case 'user_account_no':
                            $row[] = $employee->user_account_number ?: 'N/A';
                            break;
                        case 'user_email':
                            $row[] = $employee->user_email ?: 'N/A';
                            break;
                        case 'user_signup_date':
                            $date = $employee->user_signup_date ?
                                date('Y-m-d H:i:s', strtotime($employee->user_signup_date)) : 'N/A';
                            $row[] = $date;
                            break;
                        case 'user_mobile':
                            $row[] = $employee->user_mobile ?: 'N/A';
                            break;
                        case 'user_role':
                            $row[] = $employee->user_type ? ucfirst(str_replace('_', ' ', $employee->user_type)) : 'N/A';
                            break;
                        default:
                            $row[] = 'N/A';
                    }
                }
                $csvData[] = $row;
            }

            // Generate CSV file
            $filename = 'employees_export_' . date('Y-m-d_H-i-s') . '.csv';

            $output = fopen('php://output', 'w');

            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Cache-Control: no-cache, must-revalidate');
            header('Expires: 0');

            foreach ($csvData as $row) {
                fputcsv($output, $row);
            }

            fclose($output);
            exit;
        }

        // Get paginated employees for normal view
        $employees = $query->orderBy('user_signup_date', 'desc')
                         ->orderBy('user_id', 'desc')
                         ->paginate($perPage, ['*'], 'page', $page);

        // Don't append query parameters to pagination links
        $employees->withPath(request()->url());

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'filters' => [
                'status' => $statusFilter,
                'role' => $roleFilter,
                'per_page' => $perPage,
                'search' => $searchQuery,
            ]
        ]);
    }

    /**
     * Show the form for creating a new employee
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $deliveryLocations = DeliveryLocations::orderBy('location_name')->get();
        return Inertia::render('Employee/CreateEmployee', [
            'deliveryLocations' => $deliveryLocations
        ]);
    }

    /**
     * Store a newly created employee
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'user_first_last_name' => 'required|string|max:255',
            'user_second_last_name' => 'nullable|string|max:255',
            'user_mobile' => 'required|string|max:20',
            'country_code' => 'required|string|max:10',
            'user_type' => 'required|string',
            'user_package_delivery_location' => 'nullable|exists:delivery_locations,location_id',
            'user_email' => 'required|email|unique:users,user_email',
            'user_password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            'user_master_password' => 'nullable|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
        ], [
            'user_password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'user_master_password.regex' => 'Master password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        // Generate unique account number
        $accountNumber = 'EMP' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
        while (User::where('user_account_number', $accountNumber)->exists()) {
            $accountNumber = 'EMP' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
        }

        // Create the employee - using correct field mappings for the users table
        User::create([
            'user_first_last_name' => $request->user_first_last_name,
            'user_second_last_name' => $request->user_second_last_name,
            'user_mobile' => $request->user_mobile,
            'user_address_country' => $request->country_code,
            'user_type' => $request->user_type,
            'user_package_delivery_location' => $request->user_package_delivery_location,
            'user_email' => $request->user_email,
            'password' => bcrypt($request->user_password),
            'user_master_password' => $request->user_master_password ? bcrypt($request->user_master_password) : null,
            'user_account_number' => $accountNumber,
            'is_deleted' => false,
            'user_account_status' => 'activate',
            'user_signup_date' => now()->format('Y-m-d H:i:s'),
        ]);

        return redirect()->route('admin.employees.index')->with('success', 'Employee created successfully!');
    }

    /**
     * Show the form for editing the specified employee
     *
     * @param int $user_id
     * @return \Inertia\Response
     */
    public function edit($user_id)
    {
        $employee = User::findOrFail($user_id);
        $deliveryLocations = DeliveryLocations::orderBy('location_name')->get();
        return Inertia::render('Employee/EditEmployee', [
            'employee' => $employee,
            'deliveryLocations' => $deliveryLocations
        ]);
    }

    /**
     * Update the specified employee
     *
     * @param Request $request
     * @param int $user_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $user_id)
    {
        $employee = User::findOrFail($user_id);

        // Validate the request
        $request->validate([
            'user_first_last_name' => 'required|string|max:255',
            'user_second_last_name' => 'nullable|string|max:255',
            'user_mobile' => 'required|string|max:20',
            'country_code' => 'required|string|max:10',
            'user_type' => 'required|string',
            'user_package_delivery_location' => 'nullable|exists:delivery_locations,location_id',
            'user_email' => 'required|email|unique:users,user_email,' . $user_id . ',user_id',
        ]);

        // Update the employee - using correct field mappings
        $updateData = [
            'user_first_last_name' => $request->user_first_last_name,
            'user_second_last_name' => $request->user_second_last_name,
            'user_mobile' => $request->user_mobile,
            'user_address_country' => $request->country_code,
            'user_type' => $request->user_type,
            'user_package_delivery_location' => $request->user_package_delivery_location,
            'user_email' => $request->user_email,
        ];

        $employee->update($updateData);

        return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully!');
    }

    /**
     * Remove the specified employee (soft delete)
     *
     * @param int $user_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($user_id)
    {
        $employee = User::findOrFail($user_id);

        // Soft delete by setting is_deleted to true
        $employee->update(['is_deleted' => true]);

        return redirect()->route('admin.employees.index')->with('success', 'Employee deleted successfully!');
    }

    /**
     * Toggle employee status (activate/deactivate)
     *
     * @param Request $request
     * @param int $user_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleStatus(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);
        $status = $request->status;

        $user->user_account_status = $status;
        $user->save();

        $action = $status === 'activate' ? 'activated' : 'deactivated';
        return redirect()->route('admin.employees.index')->with('success', "Employee {$action} successfully.");
    }

    /**
     * Show the form for resetting login password
     *
     * @param int $user_id
     * @return \Inertia\Response
     */
    public function showResetLoginPassword($user_id)
    {
        $employee = User::findOrFail($user_id);
        return Inertia::render('Employee/ResetLoginPassword', [
            'employee' => $employee
        ]);
    }

    /**
     * Show the form for resetting master password
     *
     * @param int $user_id
     * @return \Inertia\Response
     */
    public function showResetMasterPassword($user_id)
    {
        $employee = User::findOrFail($user_id);
        return Inertia::render('Employee/ResetMasterPassword', [
            'employee' => $employee
        ]);
    }

    /**
     * Update employee login password
     *
     * @param Request $request
     * @param int $user_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateLoginPassword(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);

        $request->validate([
            'new_password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            'confirm_password' => 'required|same:new_password'
        ], [
            'new_password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'confirm_password.same' => 'Password confirmation does not match.'
        ]);

        $user->password = bcrypt($request->new_password);
        $user->save();

        return redirect()->route('admin.employees.index')->with('success', 'Login password updated successfully!');
    }

    /**
     * Update employee master password
     *
     * @param Request $request
     * @param int $user_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateMasterPassword(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);

        $request->validate([
            'new_master_password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            'confirm_master_password' => 'required|same:new_master_password'
        ], [
            'new_master_password.regex' => 'Master password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'confirm_master_password.same' => 'Master password confirmation does not match.'
        ]);

        $user->user_master_password = bcrypt($request->new_master_password);
        $user->save();

        return redirect()->route('admin.employees.index')->with('success', 'Master password updated successfully!');
    }

    /**
     * Apply filters to employee list
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function applyFilters(Request $request)
    {
        $params = $request->only(['status', 'role', 'per_page', 'search']);
        return redirect()->route('admin.employees.index', $params);
    }

    /**
     * Clear all filters
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearFilters()
    {
        return redirect()->route('admin.employees.index');
    }

    /**
     * Display role management page
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function roles(Request $request)
    {
        // Get all users with their roles
        $users = User::select('user_id', 'user_first_last_name', 'user_second_last_name', 'user_email', 'user_type', 'user_account_status')
                    ->where('is_deleted', false)
                    ->orderBy('user_first_last_name')
                    ->paginate(20);

        // Define available roles
        $availableRoles = [
            'Airdrop_Admin' => 'Airdrop Admin',
            'Airdrop_Master_Admin' => 'Airdrop Master Admin',
            'Airdrop_Manager' => 'Airdrop Manager',
            'Airdrop_Supervisor' => 'Airdrop Supervisor',
            'Airdrop_Operations_Supervisor' => 'Airdrop Operations Supervisor',
            'Customer' => 'Customer',
            'POS_Staff' => 'POS Staff'
        ];

        return Inertia::render('Employee/RoleManagement', [
            'title' => 'Role Management',
            'users' => $users,
            'availableRoles' => $availableRoles
        ]);
    }

    /**
     * Update user role
     *
     * @param Request $request
     * @param int $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateRole(Request $request, $userId)
    {
        $request->validate([
            'user_type' => 'required|string|in:Airdrop_Admin,Airdrop_Master_Admin,Airdrop_Manager,Airdrop_Supervisor,Airdrop_Operations_Supervisor,Customer,POS_Staff'
        ]);

        $user = User::findOrFail($userId);
        $user->update([
            'user_type' => $request->user_type
        ]);

        return redirect()->back()->with('success', 'User role updated successfully.');
    }

    /**
     * Display the role management page with module permissions
     *
     * @return \Inertia\Response
     */
    public function moduleRoles()
    {
        // Check if master password verification is required
        $masterPasswordRequired = !session('master_password_verified');

        // Get all modules with their role permissions
        $modules = EmployeeRoleManage::all();

        // Get auction emails
        $auctionEmails = $this->getAuctionEmails();

        return Inertia::render('Employee/ModuleRoleManagement', [
            'modules' => $modules,
            'auctionEmails' => $auctionEmails,
            'masterPasswordRequired' => $masterPasswordRequired,
            'roleTypes' => [
                'Airdrop_Shipper' => 'Shipper',
                'Airdrop_Cashier' => 'Customer Service',
                'Airdrop_Supervisor' => 'Supervisor',
                'Airdrop_Manager' => 'Manager',
                'Airdrop_Operations_Supervisor' => 'Operations Supervisor',
                'Airdrop_Admin' => 'Admin'
            ]
        ]);
    }

    /**
     * Verify master password for role management access
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function verifyMasterPassword(Request $request)
    {
        $request->validate([
            'user_master_password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!$user->user_master_password) {
            return back()->withErrors([
                'user_master_password' => 'No master password set for this user.'
            ]);
        }

        // Check master password - handle both MD5 (legacy) and Bcrypt (new) formats
        $isValidPassword = false;

        if (str_starts_with($user->user_master_password, '$2y$')) {
            // This is a Bcrypt hash, use Hash::check
            $isValidPassword = Hash::check($request->user_master_password, $user->user_master_password);
        } else {
            // This is likely an MD5 hash (legacy format), check directly
            $isValidPassword = md5($request->user_master_password) === $user->user_master_password;
        }

        if (!$isValidPassword) {
            return back()->withErrors([
                'user_master_password' => 'Master Password is not correct.'
            ]);
        }

        // Store master password verification
        session(['master_password_verified' => true]);

        return redirect()->route('admin.employees.roles');
    }

    /**
     * Update module role permissions via AJAX
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateModuleRole(Request $request)
    {
        try {
            // Log incoming request for debugging
            \Log::info('updateModuleRole called', [
                'method' => $request->method(),
                'url' => $request->url(),
                'all_data' => $request->all(),
                'user_id' => Auth::id(),
                'session_id' => session()->getId()
            ]);

            $request->validate([
                'module_id' => 'required|integer',
                'user_role' => 'required|string',
                'button_value' => 'required|in:0,1'
            ]);

            $moduleId = $request->module_id;
            $userRole = $request->user_role;
            $value = $request->button_value;

            \Log::info('Validated data', [
                'module_id' => $moduleId,
                'user_role' => $userRole,
                'value' => $value
            ]);

            $module = EmployeeRoleManage::findOrFail($moduleId);

            \Log::info('Found module', [
                'module' => $module->toArray()
            ]);

            // Check if the role column exists
            if (!in_array($userRole, $module->getFillable())) {
                \Log::error('Invalid role column', [
                    'user_role' => $userRole,
                    'fillable_columns' => $module->getFillable()
                ]);

                return back()->withErrors(['error' => 'Invalid role: ' . $userRole]);
            }

            // Update the specific role column
            $updated = $module->update([$userRole => $value]);

            \Log::info('Module role updated', [
                'success' => $updated,
                'updated_module' => $module->fresh()->toArray()
            ]);

            // Return JSON for AJAX requests, redirect for regular requests
            if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json([
                    'success' => true,
                    'message' => 'Role updated successfully',
                    'data' => [
                        'module_id' => $moduleId,
                        'user_role' => $userRole,
                        'new_value' => $value
                    ]
                ]);
            }

            return back()->with('success', 'Role updated successfully');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', [
                'errors' => $e->errors()
            ]);

            if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors()
                ], 422);
            }

            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            \Log::error('Error updating module role', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json([
                    'success' => false,
                    'message' => 'Error updating role: ' . $e->getMessage()
                ], 500);
            }

            return back()->withErrors(['error' => 'Error updating role: ' . $e->getMessage()]);
        }
    }

    /**
     * Get auction emails
     *
     * @return string
     */
    public function getAuctionEmails()
    {
        $emailOption = Options::where('key', 'auction_notification_emails')->first();

        if ($emailOption && $emailOption->value) {
            // Try to decode if it's JSON, otherwise return as is
            $emails = $emailOption->value;
            try {
                $decodedEmails = json_decode($emails, true);
                if (isset($decodedEmails['emails'])) {
                    $emails = $decodedEmails['emails'];
                }
            } catch (\Exception $e) {
                // If JSON decode fails, use the raw value
            }

            return $emails;
        }

        return '';
    }

    /**
     * Get auction emails via AJAX
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuctionEmailsAjax()
    {
        $emails = $this->getAuctionEmails();

        return response()->json([
            'success' => true,
            'emails' => $emails
        ]);
    }

    /**
     * Save auction emails
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveAuctionEmails(Request $request)
    {
        $emails = $request->input('emails', []);

        // Validate emails
        foreach ($emails as $email) {
            if (!filter_var(trim($email), FILTER_VALIDATE_EMAIL)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email address: ' . $email
                ]);
            }
        }

        // Clean and join emails
        $cleanedEmails = array_map('trim', $emails);
        $emailString = implode(',', $cleanedEmails);

        // Store in the same JSON format as the PHP version
        $jsonEmails = ['emails' => $emailString];
        $jsonString = json_encode($jsonEmails);

        // Store in options table
        Options::updateOrCreate(
            ['key' => 'auction_notification_emails'],
            ['value' => $jsonString]
        );

        return response()->json(['success' => true]);
    }
}
