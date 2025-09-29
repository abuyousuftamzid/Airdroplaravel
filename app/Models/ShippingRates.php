<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRates extends Model
{
    use HasFactory;

    protected $table = 'shipping_rates';

    protected $fillable = [
        'rate_type',
        'rate_name',
        'rate_value',
        'description',
        'created_at',
        'updated_at',
        'updated_by',
        'is_active'
    ];

    protected $casts = [
        'rate_value' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
