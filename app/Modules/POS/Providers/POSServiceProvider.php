<?php

namespace App\Modules\POS\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Modules\POS\Middleware\POSMiddleware;

/**
 * POS Module Service Provider
 * Handles registration and bootstrapping of POS module services
 */
class POSServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register any POS-specific services here
        // Example:
        // $this->app->singleton('pos.service', function ($app) {
        //     return new POSService();
        // });
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        // Register middleware
        $router->aliasMiddleware('pos', POSMiddleware::class);

        // Register views if using blade templates
        $this->loadViewsFrom(__DIR__ . '/../../../resources/views/pos', 'pos');

        // Register translations if needed
        // $this->loadTranslationsFrom(__DIR__ . '/../../../resources/lang/pos', 'pos');

        // Register migrations if module has its own migrations
        // $this->loadMigrationsFrom(__DIR__ . '/../../../database/migrations/pos');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/../../../resources/assets/pos' => public_path('assets/pos'),
        // ], 'pos-assets');
    }
}
