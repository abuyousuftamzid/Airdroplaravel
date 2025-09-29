<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gateways extends Model
{
    use HasFactory;

    protected $table = 'gateways';

    protected $fillable = [
        'gateway_name',
        'key_value_1',
        'key_value_2',
        'key_value_3',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'created_date' => 'datetime',
        'updated_date' => 'datetime'
    ];

    // Relationships
    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
