<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageAdditionalChargesHistory extends Model
{
    use HasFactory;

    protected $table = 'package_additional_charges_history';

    protected $fillable = [
        'package_tracking_code',
        'added_at'
    ];

    protected $casts = [
        'added_at' => 'date'
    ];

    // Relationships
    public function package()
    {
        return $this->belongsTo(Packages::class, 'package_tracking_code', 'package_tracking_code');
    }
}
