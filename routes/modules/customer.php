<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Customer\Controllers\CustomerController;

/**
 * Customer Module Routes
 * These routes require customer authentication
 */

Route::group([
    'prefix' => 'user',
    'as' => 'user.',
    'middleware' => ['auth', 'customer'] // TODO: Create customer middleware
], function () {

    // User Dashboard
    Route::get('/', [CustomerController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard.alt');

    // Orders Management
    Route::get('/orders', [CustomerController::class, 'orders'])->name('orders');

    // Profile Management
    Route::get('/profile', [CustomerController::class, 'profile'])->name('profile');

    // Address Management
    Route::get('/addresses', [CustomerController::class, 'addresses'])->name('addresses');

    // Additional user routes can be added here
    // Route::get('/wishlist', [CustomerController::class, 'wishlist'])->name('wishlist');
    // Route::get('/wallet', [CustomerController::class, 'wallet'])->name('wallet');
    // Route::get('/referrals', [CustomerController::class, 'referrals'])->name('referrals');

});
