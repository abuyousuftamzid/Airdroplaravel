# Modular Architecture

This directory contains the modular structure for the AirDrop Jamaica Laravel application. Each module is isolated with its own controllers, middleware, services, and other components.

## Module Structure

### Available Modules

1. **Public** - Public-facing pages accessible to all users
2. **Admin** - Administrative dashboard and management tools
3. **Customer** - User account and dashboard functionality  
4. **POS** - Point of Sale system for staff

### Directory Structure

Each module follows this structure:

```
app/Modules/{ModuleName}/
├── Controllers/          # Module-specific controllers
├── Middleware/          # Module-specific middleware
├── Services/            # Business logic services
├── Requests/            # Form request validation classes
└── Providers/           # Service providers for the module
```

### Routes

Module routes are defined in:

```
routes/modules/{module}.php
```

All module routes are automatically loaded in `routes/web.php`.

### Route Prefixes

- **Public**: `/` (no prefix)
- **Admin**: `/admin`
- **Customer**: `/user`
- **POS**: `/pos`

### Middleware

Each module has its own middleware for access control:

- **AdminMiddleware**: Ensures only admin users can access admin routes
- **CustomerMiddleware**: Ensures only customer users can access user routes
- **POSMiddleware**: Ensures only POS staff can access POS routes

### Service Providers

Each module has its own service provider that:

- Registers middleware aliases
- Loads module views
- Handles module-specific configurations

Service providers are automatically registered in `bootstrap/providers.php`.

## Usage Examples

### Adding New Routes

To add new routes to a module, edit the respective route file:

```php
// routes/modules/admin.php
Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
```

### Creating New Controllers

Controllers should extend the base Controller and be placed in the module's Controllers directory:

```php
<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;

class ReportsController extends Controller
{
    // Controller methods here
}
```

### Adding Services

Create service classes in the Services directory for business logic:

```php
<?php

namespace App\Modules\Admin\Services;

class ReportsService
{
    public function generateReport()
    {
        // Business logic here
    }
}
```

### Custom Middleware

Add custom middleware to the Middleware directory and register it in the module's service provider:

```php
// In the service provider's boot method
$router->aliasMiddleware('custom-middleware', CustomMiddleware::class);
```

## Best Practices

1. **Separation of Concerns**: Keep each module focused on its specific functionality
2. **Naming Conventions**: Use consistent naming across all modules
3. **Service Layer**: Use service classes for complex business logic
4. **Middleware**: Implement proper access control for each module
5. **Documentation**: Document any custom functionality or deviations from this structure

## Development Notes

- All modules are autoloaded via composer.json
- Service providers are automatically registered
- Views are organized by module in resources/views/{module}/
- Each module can have its own translations, migrations, and assets
- TODO comments indicate areas that need implementation based on your specific requirements
