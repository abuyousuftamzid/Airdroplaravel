<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'user_first_last_name' => 'required|string|max:50',
            'user_email' => 'required|string|email|max:100|unique:users,user_email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'user_first_last_name' => $request->user_first_last_name,
            'user_email' => $request->user_email,
            'password' => Hash::make($request->password),
            'user_account_number' => $this->generateIncrementalAccountNumber(), // Generate incremental account number
            'pickup_location' => 'Kingston',
            'payment_currency' => 'JMD',
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Check user role and redirect appropriately
        if ($user->isAdmin()) {
            return redirect(route('admin.dashboard', absolute: false));
        }

        // For non-admin users, redirect to home
        return redirect('/');
    }

    /**
     * Generate an incremental account number
     */
    private function generateIncrementalAccountNumber(): string
    {
        // Get the highest existing account number
        $lastUser = User::orderBy('user_account_number', 'desc')->first();

        if ($lastUser && $lastUser->user_account_number) {
            // Extract the numeric part and increment it
            $lastNumber = (int) $lastUser->user_account_number;
            $nextNumber = $lastNumber + 1;
        } else {
            // If no users exist, start from 1000
            $nextNumber = 1000;
        }

        return (string) $nextNumber;
    }
}
