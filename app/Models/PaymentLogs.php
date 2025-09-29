<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentLogs extends Model
{
    use HasFactory;

    protected $table = 'payment_logs';

    protected $fillable = [
        'tracking_code',
        'invoice_id',
        'payment_id',
        'payment_method',
        'payment_processor',
        'payment_card_type',
        'payment_authorization_number',
        'payment_check_number',
        'payment_check_bank',
        'payment_currency',
        'payment_current_time',
        'payment_package_user_id',
        'package_exchange_rate',
        'package_cashire_id',
        'payments_package_types',
        'comments',
        'payment_total_amount',
        'package_additional_charge',
        'total_aircoins',
        'user_id',
        'refer_id',
        'aircoin_point',
        'aircoin_amt'
    ];

    protected $casts = [
        'payment_current_time' => 'datetime'
    ];
}
