<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $table = 'country';

    protected $fillable = [
        'country_code',
        'country_name',
        'is_active'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
