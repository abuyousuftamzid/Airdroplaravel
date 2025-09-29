<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'order_tracking_number',
        'package_couirer_number',
        'order_courier_company',
        'order_store_name',
        'order_package_value',
        'order_consignee',
        'order_description',
        'order_invoice_file_name',
        'order_invoice_file_url',
        'order_type',
        'order_status',
        'order_date_time',
        'order_user_id',
        'package_invoice_id'
    ];

    protected $casts = [
        'order_date_time' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'order_user_id', 'user_id');
    }
}
