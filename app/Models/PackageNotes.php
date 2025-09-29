<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageNotes extends Model
{
    use HasFactory;

    protected $table = 'package_notes';

    protected $fillable = [
        'tracking_code',
        'notes',
        'created_date',
        'created_by',
        'is_deleted',
        'updated_date',
        'updated_by'
    ];

    protected $casts = [
        'created_date' => 'datetime',
        'updated_date' => 'datetime',
        'is_deleted' => 'boolean'
    ];

    // Relationships
    public function package()
    {
        return $this->belongsTo(Packages::class, 'tracking_code', 'package_tracking_code');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
