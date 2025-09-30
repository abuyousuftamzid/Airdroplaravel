<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Modules\Admin\Controllers\AdminController;
use App\Modules\Admin\Controllers\EmployeeController;
use App\Modules\Admin\Controllers\PackageController;
use App\Http\Controllers\EmployeeLookupController;
use Inertia\Inertia;

/**
 * Admin Module Routes
 * These routes require admin authentication and authorization
 */

// Admin Login Route (outside auth middleware)
Route::get('/admin/login', function () {
    // If user is already authenticated, check if they have admin privileges
    if (Auth::check()) {
        $user = Auth::user();

        // Check if user has admin privileges using the same logic as AdminMiddleware
        $adminRoles = [
            'Airdrop_Admin',
            'Airdrop_Master_Admin',
            'Airdrop_Manager',
            'Airdrop_Supervisor',
            'Airdrop_Operations_Supervisor'
        ];

        if (in_array($user->user_type, $adminRoles)) {
            return redirect()->route('admin.dashboard');
        } else {
            // Log out non-admin users
            Auth::logout();
            return Inertia::render('Auth/Login', [
                'message' => 'Access denied. Admin privileges required. Please login with an admin account.'
            ]);
        }
    }

    // Show admin login page with a message
    return Inertia::render('Auth/Login', [
        'message' => 'Please login to access the admin panel'
    ]);
})->name('admin.login');

Route::group([
    'prefix' => 'admin',
    'as' => 'admin.',
    'middleware' => ['auth', 'App\Modules\Admin\Middleware\AdminMiddleware'] // Add AdminMiddleware
], function () {

    // Master Password Authentication Routes (not protected by master password middleware)
    Route::get('/master-login', function () {
        return Inertia::render('Employee/MasterPasswordLogin');
    })->name('master-login');

    Route::post('/master-login', function () {
        $request = request();
        $user = \Illuminate\Support\Facades\Auth::user();

        $request->validate([
            'master_password' => 'required|string',
        ]);

        // Check if master password matches
        if (!$user->user_master_password) {
            return back()->withErrors([
                'master_password' => 'No master password set for this user.'
            ]);
        }

        // Check master password - handle both MD5 (legacy) and Bcrypt (new) formats
        $isValidPassword = false;

        // Check if it's a Bcrypt hash (starts with $2y$)
        if (str_starts_with($user->user_master_password, '$2y$')) {
            // This is a Bcrypt hash, use Hash::check
            $isValidPassword = \Illuminate\Support\Facades\Hash::check($request->master_password, $user->user_master_password);
        } else {
            // This is likely an MD5 hash (legacy format), check directly
            $isValidPassword = md5($request->master_password) === $user->user_master_password;
        }

        if (!$isValidPassword) {
            return back()->withErrors([
                'master_password' => 'Invalid master password. Please try again.'
            ]);
        }

        // Get intended URL and clear it from session
        $intendedUrl = session('master_password_intended_url', route('admin.dashboard'));
        session()->forget('master_password_intended_url');

        // Store master password verification and track employee section access
        session([
            'master_password_verified' => true,
            'last_employee_url' => $intendedUrl
        ]);

        // Redirect to intended page with session persistence within employee section
        return redirect($intendedUrl)->with('success', 'Master password verified successfully.');
    })->name('master-login.verify');

    // Master password logout route
    Route::post('/master-logout', function () {
        session()->forget(['master_password_verified', 'last_employee_url']);
        return redirect()->route('admin.dashboard')->with('success', 'Master password session ended.');
    })->name('master-logout');

    // Route to update master password (for admin use)
    Route::post('/update-master-password', function () {
        $request = request();
        $user = \Illuminate\Support\Facades\Auth::user();

        $request->validate([
            'new_master_password' => 'required|string|min:6',
        ]);

        // Hash the new master password using Bcrypt
        $hashedPassword = \Illuminate\Support\Facades\Hash::make($request->new_master_password);

        // Update user's master password in database
        \Illuminate\Support\Facades\DB::table('users')
            ->where('user_id', $user->user_id)
            ->update(['user_master_password' => $hashedPassword]);

        return back()->with('success', 'Master password updated successfully.');
    })->name('update-master-password');

    // Admin Dashboard (no master password required) - redirect /admin to /admin/dashboard
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // System Logs (admin only, no master password required)
    Route::get('/logs', [\App\Http\Controllers\LogViewerController::class, 'index'])->name('logs');

    // Protected Admin Routes (require master password)
    Route::middleware('master.password')->group(function () {

    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');

    // System Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');

    // Employee Management
    Route::prefix('employees')->name('employees.')->group(function () {
        // Main Employee CRUD Routes
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('create');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::get('/{user_id}/edit', [EmployeeController::class, 'edit'])->name('edit');
        Route::patch('/{user_id}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{user_id}', [EmployeeController::class, 'destroy'])->name('destroy');

        // Role Management Routes
        Route::get('/roles', [EmployeeController::class, 'moduleRoles'])->name('roles');
        Route::patch('/{user_id}/update-role', [EmployeeController::class, 'updateRole'])->name('update-role');
        Route::post('/verify-master-password', [EmployeeController::class, 'verifyMasterPassword'])->name('verify-master-password');
        Route::post('/update-module-role', [EmployeeController::class, 'updateModuleRole'])->name('update-module-role');
        Route::post('/get-auction-emails', [EmployeeController::class, 'getAuctionEmailsAjax'])->name('get-auction-emails');
        Route::post('/save-auction-emails', [EmployeeController::class, 'saveAuctionEmails'])->name('save-auction-emails');

        // Employee Status and Password Management
        Route::patch('/{user_id}/toggle-status', [EmployeeController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/{user_id}/reset-login-password', [EmployeeController::class, 'showResetLoginPassword'])->name('reset-login-password');
        Route::get('/{user_id}/reset-master-password', [EmployeeController::class, 'showResetMasterPassword'])->name('reset-master-password');
        Route::patch('/{user_id}/update-login-password', [EmployeeController::class, 'updateLoginPassword'])->name('update-login-password');
        Route::patch('/{user_id}/update-master-password', [EmployeeController::class, 'updateMasterPassword'])->name('update-master-password');

        // Filter Management
        Route::post('/apply-filters', [EmployeeController::class, 'applyFilters'])->name('apply-filters');
        Route::post('/clear-filters', [EmployeeController::class, 'clearFilters'])->name('clear-filters');

        // Employee Lookup Routes
        Route::prefix('lookup')->name('lookup.')->group(function () {
            Route::get('/', [EmployeeLookupController::class, 'index'])->name('index');
            Route::get('/form', [EmployeeLookupController::class, 'index'])->name('form');
            Route::post('/', [EmployeeLookupController::class, 'search'])->name('search');
            Route::post('/update-step-1', [EmployeeLookupController::class, 'updateStep1'])->name('update-step-1');
            Route::post('/update-step-2', [EmployeeLookupController::class, 'updateStep2'])->name('update-step-2');
            Route::post('/toggle-status', [EmployeeLookupController::class, 'toggleStatus'])->name('toggle-status');
        });
    });

    // Package Management Routes (require master password)
    Route::middleware('master.password')->group(function () {
        Route::prefix('packages')->name('packages.')->group(function () {
            // Package CRUD Routes
            Route::get('/', [PackageController::class, 'index'])->name('index');
            Route::get('/create', [PackageController::class, 'create'])->name('create');
            Route::post('/', [PackageController::class, 'store'])->name('store');
            Route::get('/{trackingCode}', [PackageController::class, 'show'])->name('show');
            Route::get('/{packageId}/edit', [PackageController::class, 'edit'])->name('edit');
            Route::patch('/{packageId}', [PackageController::class, 'update'])->name('update');

            // AJAX Routes for package operations
            Route::post('/find-by-courier', [PackageController::class, 'findByCourierNumber'])->name('find-by-courier');
            Route::post('/find-customer', [PackageController::class, 'findCustomerByAccountNumber'])->name('find-customer');
            Route::post('/calculate-shipping', [PackageController::class, 'calculateShipping'])->name('calculate-shipping');
            Route::get('/shipping-rates/json', [PackageController::class, 'getShippingRates'])->name('shipping-rates');

            // Data and Export Routes
            Route::post('/get-data', [PackageController::class, 'getData'])->name('get-data');
            Route::get('/export-csv', [PackageController::class, 'exportCsv'])->name('exportCsv');
            Route::post('/export-csv', [PackageController::class, 'exportCsv'])->name('exportCsv.post');

            // Package Status Update Routes (accessible without master password)
            Route::get('/status/update', [PackageController::class, 'updateStatus'])->name('update-status');
        });
    });

}); // End of master.password middleware group

    // Routes without master password protection
    // Route::prefix('packages')->name('packages.')->group(function () {
    //     Route::get('/update-status', [PackageController::class, 'updateStatus'])->name('update-status');
    // });

    // Additional admin routes can be added here
    // Route::resource('/products', ProductController::class);
    // Route::resource('/categories', CategoryController::class);
    // Route::get('/reports', [AdminController::class, 'reports'])->name('reports');

});
