<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdersNew extends Model
{
    use HasFactory;

    protected $table = 'orders_new';

    protected $fillable = [
        'customer_name',
        'email',
        'phone',
        'shipping_address',
        'product_title',
        'product_price',
        'product_image',
        'amazon_link',
        'user_account_number',
        'weight_lbs',
        'weight_kg',
        'invoice_amount_usd',
        'freight_value',
        'insurance_value',
        'fuel_value',
        'cif_value',
        'airdrop_charges',
        'grand_total',
        'payment_method',
        'payment_status',
        'payment_intent_id',
        'order_status',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'product_price' => 'decimal:2',
        'weight_lbs' => 'decimal:2',
        'weight_kg' => 'decimal:2',
        'invoice_amount_usd' => 'decimal:2',
        'freight_value' => 'decimal:2',
        'insurance_value' => 'decimal:2',
        'fuel_value' => 'decimal:2',
        'cif_value' => 'decimal:2',
        'airdrop_charges' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}
