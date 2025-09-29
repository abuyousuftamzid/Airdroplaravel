<?php

use Illuminate\Support\Facades\Route;
use App\Modules\POS\Controllers\POSController;

/**
 * POS Module Routes
 * These routes require POS staff authentication and authorization
 */

Route::group([
    'prefix' => 'pos',
    'as' => 'pos.',
    'middleware' => ['auth', 'pos'] // TODO: Create POS middleware
], function () {

    // POS Dashboard
    Route::get('/', [POSController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard', [POSController::class, 'dashboard'])->name('dashboard.alt');

    // Sales Interface
    Route::get('/sales', [POSController::class, 'sales'])->name('sales');

    // Inventory Management
    Route::get('/inventory', [POSController::class, 'inventory'])->name('inventory');

    // Reports
    Route::get('/reports', [POSController::class, 'reports'])->name('reports');

    // Additional POS routes can be added here
    // Route::post('/sales/process', [POSController::class, 'processSale'])->name('sales.process');
    // Route::get('/customers/search', [POSController::class, 'searchCustomers'])->name('customers.search');
    // Route::get('/products/search', [POSController::class, 'searchProducts'])->name('products.search');

});
