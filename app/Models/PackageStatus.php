<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageStatus extends Model
{
    use HasFactory;

    protected $table = 'package_status';

    protected $primaryKey = 'package_status_id';

    protected $fillable = [
        'package_status_name',
        'sort_by',
        'color_code'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
