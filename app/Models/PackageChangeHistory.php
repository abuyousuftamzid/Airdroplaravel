<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageChangeHistory extends Model
{
    use HasFactory;

    protected $table = 'package_change_history';

    protected $fillable = [
        'package_tracking_code',
        'package_status',
        'package_status_datetime',
        'package_comment',
        'package_status_change_user_id'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function package()
    {
        return $this->belongsTo(Packages::class, 'package_tracking_code', 'package_tracking_code');
    }

    public function statusChangeUser()
    {
        return $this->belongsTo(User::class, 'package_status_change_user_id', 'user_id');
    }
}
