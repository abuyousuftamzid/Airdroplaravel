<?php

namespace App\Modules\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Modules\Admin\Middleware\AdminMiddleware;

/**
 * Admin Module Service Provider
 * Handles registration and bootstrapping of Admin module services
 */
class AdminServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register any admin-specific services here
        // Example:
        // $this->app->singleton('admin.service', function ($app) {
        //     return new AdminService();
        // });
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        // Register middleware
        $router->aliasMiddleware('admin', AdminMiddleware::class);

        // Register views if using blade templates
        $this->loadViewsFrom(__DIR__ . '/../../../resources/views/admin', 'admin');

        // Register translations if needed
        // $this->loadTranslationsFrom(__DIR__ . '/../../../resources/lang/admin', 'admin');

        // Register migrations if module has its own migrations
        // $this->loadMigrationsFrom(__DIR__ . '/../../../database/migrations/admin');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/../../../resources/assets/admin' => public_path('assets/admin'),
        // ], 'admin-assets');
    }
}
