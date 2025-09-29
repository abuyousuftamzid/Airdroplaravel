<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryLocations extends Model
{
    use HasFactory;

    protected $table = 'delivery_locations';

    protected $primaryKey = 'location_id';

    protected $fillable = [
        'location_name'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
