<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeletePackages extends Model
{
    use HasFactory;

    protected $table = 'delete_packages';

    protected $primaryKey = 'deleted_id';

    protected $fillable = [
        'package_tracking_code',
        'employee_name',
        'delete_date',
        'delete_reason',
        'package_id',
        'package_courier_number'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function package()
    {
        return $this->belongsTo(Packages::class, 'package_id', 'package_id');
    }
}
