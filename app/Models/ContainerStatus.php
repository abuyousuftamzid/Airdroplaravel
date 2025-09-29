<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContainerStatus extends Model
{
    use HasFactory;

    protected $table = 'container_status';

    protected $primaryKey = 'status_id';

    protected $fillable = [
        'container_status_name',
        'container_status_type'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
