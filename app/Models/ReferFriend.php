<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferFriend extends Model
{
    use HasFactory;

    protected $table = 'refer_friend';

    protected $fillable = [
        'refer_to_first_name',
        'refer_to_last_name',
        'refer_to_email',
        'refer_url',
        'refer_description',
        'is_url_active',
        'refer_by',
        'refer_date',
        'is_registered',
        'register_by_id',
        'is_deleted',
        'updated_date',
        'updated_by'
    ];

    protected $casts = [
        'is_url_active' => 'boolean',
        'refer_date' => 'datetime',
        'is_registered' => 'boolean',
        'is_deleted' => 'boolean',
        'updated_date' => 'datetime'
    ];

    // Relationships
    public function referByUser()
    {
        return $this->belongsTo(User::class, 'refer_by', 'user_id');
    }

    public function registeredByUser()
    {
        return $this->belongsTo(User::class, 'register_by_id', 'user_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
