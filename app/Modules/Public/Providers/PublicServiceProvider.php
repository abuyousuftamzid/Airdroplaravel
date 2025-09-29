<?php

namespace App\Modules\Public\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;

/**
 * Public Module Service Provider
 * Handles registration and bootstrapping of Public module services
 */
class PublicServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register any public-specific services here
        // Example:
        // $this->app->singleton('public.service', function ($app) {
        //     return new PublicService();
        // });
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        // Register views if using blade templates
        $this->loadViewsFrom(__DIR__ . '/../../../resources/views/public', 'public');

        // Register translations if needed
        // $this->loadTranslationsFrom(__DIR__ . '/../../../resources/lang/public', 'public');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/../../../resources/assets/public' => public_path('assets/public'),
        // ], 'public-assets');
    }
}
