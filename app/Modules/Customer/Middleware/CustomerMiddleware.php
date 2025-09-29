<?php

namespace App\Modules\Customer\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Customer Module Middleware
 * Ensures only authenticated customers can access customer routes
 */
class CustomerMiddleware
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
            return redirect()->route('login')->with('error', 'Please login to access your account.');
        }

        // Check if user has customer role/permission
        $user = Auth::user();

        // TODO: Implement proper role/permission checking
        // This is a basic implementation - customize based on your user roles system
        if (!$this->isCustomer($user)) {
            abort(403, 'Access denied. User account required.');
        }

        return $next($request);
    }

    /**
     * Check if user has customer privileges
     *
     * @param mixed $user
     * @return bool
     */
    private function isCustomer($user): bool
    {
        // Use the User model's isCustomer method which checks user_type
        return $user->isCustomer();
    }
}
