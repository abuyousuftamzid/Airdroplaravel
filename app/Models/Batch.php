<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $table = 'batch';

    protected $fillable = [
        'batch_code',
        'batch_name',
        'batch_status',
        'destination_store',
        'container_type',
        'comments',
        'assign_to_user_id',
        'batch_lock_date',
        'batch_unlock_code',
        'unblock_date',
        'unblock_by',
        'created_date',
        'created_by',
        'is_deleted',
        'updated_date',
        'updated_by'
    ];

    protected $casts = [
        'batch_lock_date' => 'datetime',
        'unblock_date' => 'datetime',
        'created_date' => 'datetime',
        'updated_date' => 'datetime',
        'is_deleted' => 'boolean'
    ];

    // Relationships
    public function packages()
    {
        return $this->hasMany(Packages::class, 'batch_id', 'id');
    }

    public function packagesLive()
    {
        return $this->hasMany(PackagesLive::class, 'batch_id', 'id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assign_to_user_id', 'user_id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }

    public function unblockedByUser()
    {
        return $this->belongsTo(User::class, 'unblock_by', 'user_id');
    }
}
