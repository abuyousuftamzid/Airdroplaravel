<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Public\Controllers\PublicController;

/**
 * Public Module Routes
 * These routes are accessible to all users without authentication
 */

Route::group([
    'prefix' => '',
    'as' => 'public.',
], function () {

    // Homepage
    Route::get('/', [PublicController::class, 'index'])->name('home');


    // About page
    Route::get('/about', [PublicController::class, 'about'])->name('about');

    // Contact page
    Route::get('/contact', [PublicController::class, 'contact'])->name('contact');

    // Additional public routes can be added here
    // Route::get('/services', [PublicController::class, 'services'])->name('services');
    // Route::get('/pricing', [PublicController::class, 'pricing'])->name('pricing');

});
