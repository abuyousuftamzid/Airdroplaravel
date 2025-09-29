<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequireMasterPassword
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated first
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Allow access to admin dashboard without master password
        if ($request->routeIs('admin.dashboard') || $request->is('admin/dashboard')) {
            return $next($request);
        }

        // Check if master password is verified and still valid
        if (session('master_password_verified')) {
            // Check if user is still within employee section
            $currentUrl = $request->url();
            $lastEmployeeUrl = session('last_employee_url');

            // If user is navigating within employee section, allow access
            if ($lastEmployeeUrl && $this->isEmployeeSection($currentUrl)) {
                // Update last employee URL
                session(['last_employee_url' => $currentUrl]);
                return $next($request);
            }

            // If coming from outside employee section, require re-authentication
            if (!$this->isEmployeeSection($lastEmployeeUrl ?? '')) {
                session()->forget(['master_password_verified', 'last_employee_url']);
            } else {
                // Update last employee URL and allow access
                session(['last_employee_url' => $currentUrl]);
                return $next($request);
            }
        }

        // Require master password authentication
        session(['master_password_intended_url' => $request->url()]);
        return redirect()->route('admin.master-login');
    }

    /**
     * Check if URL is within employee section or admin section
     */
    private function isEmployeeSection($url): bool
    {
        if (empty($url)) {
            return false;
        }

        return str_contains($url, '/employees/') || str_contains($url, '/employees') ||
               str_contains($url, '/admin/') || str_contains($url, '/admin');
    }
}
