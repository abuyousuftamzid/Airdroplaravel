<?php

return [
    App\Providers\AppServiceProvider::class,

    // Module Service Providers
    App\Modules\Public\Providers\PublicServiceProvider::class,
    App\Modules\Admin\Providers\AdminServiceProvider::class,
    App\Modules\Customer\Providers\CustomerServiceProvider::class,
    App\Modules\POS\Providers\POSServiceProvider::class,
    Rap2hpoutre\LaravelLogViewer\LaravelLogViewerServiceProvider::class,
];
