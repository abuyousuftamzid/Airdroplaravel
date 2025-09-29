<?php

namespace App\Modules\Customer\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Modules\Customer\Middleware\CustomerMiddleware;

/**
 * Customer Module Service Provider
 * Handles registration and bootstrapping of Customer module services
 */
class CustomerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register any customer-specific services here
        // Example:
        // $this->app->singleton('customer.service', function ($app) {
        //     return new CustomerService();
        // });
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        // Register middleware
        $router->aliasMiddleware('customer', CustomerMiddleware::class);

        // Register views if using blade templates
        $this->loadViewsFrom(__DIR__ . '/../../../resources/views/customer', 'customer');

        // Register translations if needed
        // $this->loadTranslationsFrom(__DIR__ . '/../../../resources/lang/customer', 'customer');

        // Register migrations if module has its own migrations
        // $this->loadMigrationsFrom(__DIR__ . '/../../../database/migrations/customer');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/../../../resources/assets/customer' => public_path('assets/customer'),
        // ], 'customer-assets');
    }
}
