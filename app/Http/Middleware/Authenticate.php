<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (! $request->expectsJson()) {
            // Check if the request is for admin routes
            if ($request->is('admin/*') || $request->is('admin')) {
                return route('admin.login');
            }

            // Check if the request is for POS routes
            if ($request->is('pos/*') || $request->is('pos')) {
                return route('pos.login');
            }

            // Default to user login for all other routes
            return route('login');
        }

        return null;
    }
}
