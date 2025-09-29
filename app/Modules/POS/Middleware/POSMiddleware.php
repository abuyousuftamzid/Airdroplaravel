<?php

namespace App\Modules\POS\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * POS Module Middleware
 * Ensures only users with POS privileges can access POS routes
 */
class POSMiddleware
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
            return redirect()->route('login')->with('error', 'Please login to access POS system.');
        }

        // Check if user has POS role/permission
        $user = Auth::user();

        // TODO: Implement proper role/permission checking
        // This is a basic implementation - customize based on your user roles system
        if (!$this->isPOSStaff($user)) {
            abort(403, 'Access denied. POS privileges required.');
        }

        return $next($request);
    }

    /**
     * Check if user has POS privileges
     *
     * @param mixed $user
     * @return bool
     */
    private function isPOSStaff($user): bool
    {
        // Use the User model's isPosStaff method which checks user_type
        // Also allow admin users to access POS
        return $user->isPosStaff() || $user->isAdmin();
    }
}
