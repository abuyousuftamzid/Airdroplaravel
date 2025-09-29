<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentsLive extends Model
{
    use HasFactory;

    protected $table = 'payments_live';

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'packages_invoice_id',
        'payment_method',
        'payment_processor',
        'payment_card_type',
        'payment_authorization_number',
        'payment_check_number',
        'payment_check_bank',
        'payment_currency',
        'payment_total_ammount',
        'payment_paid_ammount',
        'payment_left_ammount',
        'payment_additional_charges',
        'payment_package_id',
        'payment_package_tracking_code',
        'payment_package_user_id',
        'paymemt_date',
        'package_exchange_rate',
        'package_cashire_id',
        'payments_package_types'
    ];

    protected $casts = [
        'paymemt_date' => 'datetime',
        'payments_package_types' => 'json'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'payment_package_user_id', 'user_id');
    }

    public function packageLive()
    {
        return $this->belongsTo(PackagesLive::class, 'payment_package_tracking_code', 'package_tracking_code');
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'package_cashire_id', 'user_id');
    }
}
