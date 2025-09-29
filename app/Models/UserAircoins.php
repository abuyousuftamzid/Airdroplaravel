<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAircoins extends Model
{
    use HasFactory;

    protected $table = 'user_aircoins';

    protected $fillable = [
        'user_id',
        'refer_id',
        'aircoin_point',
        'aircoin_amt',
        'aircoin_status',
        'credited_date',
        'payment_id',
        'payment_date',
        'payment_details',
        'credit_type',
        'bcredited_date'
    ];

    protected $casts = [
        'aircoin_status' => 'boolean',
        'credited_date' => 'datetime',
        'payment_date' => 'datetime',
        'payment_details' => 'json',
        'credit_type' => 'boolean',
        'bcredited_date' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function referUser()
    {
        return $this->belongsTo(User::class, 'refer_id', 'user_id');
    }
}
