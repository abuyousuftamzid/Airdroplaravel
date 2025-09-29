<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Orders;
use App\Models\Payments;
use Inertia\Inertia;

/**
 * Base controller for Admin module
 * Handles all admin dashboard functionality
 */
class AdminController extends Controller
{
    /**
     * Display the admin dashboard
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Clear master password session when navigating to dashboard
        session()->forget(['master_password_verified', 'last_employee_url']);

        return Inertia::render('Dashboard', [
            'title' => 'Admin Dashboard',
            'stats' => $this->getDashboardStats()
        ]);
    }

    /**
     * Display admin users management
     *
     * @return \Inertia\Response
     */
    public function users()
    {
        return Inertia::render('Admin/Users/Index', [
            'title' => 'User Management'
        ]);
    }

    /**
     * Display admin settings
     *
     * @return \Inertia\Response
     */
    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'title' => 'System Settings'
        ]);
    }

    /**
     * Get dashboard statistics
     *
     * @return array
     */
    private function getDashboardStats()
    {

        return [
            'total_users' => 0,
            'total_orders' => 0,
            'total_revenue' => 0,
            'pending_orders' => 0
        ];
    }
}
