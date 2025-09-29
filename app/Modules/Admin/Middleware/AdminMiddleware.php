<?php

namespace App\Modules\Admin\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admin Module Middleware
 * Ensures only users with admin privileges can access admin routes
 */
class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            // If accessing admin routes, redirect to admin login instead of regular login
            if ($request->is('admin/*') || $request->is('admin')) {
                return redirect()->route('admin.login')->with('error', 'Please login to access admin area.');
            }
            return redirect()->route('login')->with('error', 'Please login to access admin area.');
        }

        // Check if user has admin role/permission
        $user = Auth::user();

        // Check if user has admin privileges
        if (!$this->isAdmin($user)) {
            // Log out non-admin users who try to access admin area
            Auth::logout();
            return redirect()->route('admin.login')->with('error', 'Access denied. Admin privileges required.');
        }

        return $next($request);
    }

    /**
     * Check if user has admin privileges
     *
     * @param mixed $user
     * @return bool
     */
    private function isAdmin($user): bool
    {
        // Use the User model's isAdmin method which checks user_type
        return $user->isAdmin();
    }
}
