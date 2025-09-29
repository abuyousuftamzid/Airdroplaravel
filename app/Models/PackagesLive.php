<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackagesLive extends Model
{
    use HasFactory;

    protected $table = 'packages_live';

    protected $primaryKey = 'package_id';

    protected $fillable = [
        'packages_invoice_id',
        'package_tracking_code',
        'package_couirer_number',
        'shipping_method',
        'package_description',
        'package_admin_remarks',
        'package_shipper',
        'package_status',
        'package_weight',
        'package_weight_kg',
        'package_store',
        'package_user_id',
        'package_shipper_id',
        'package_user_account_number',
        'package_amount',
        'package_orignal_price',
        'package_shipping_price',
        'package_total_price',
        'package_additional_charges',
        'package_additional_charges_total',
        'package_consignee',
        'pckaage_invoice',
        'invoice_upload_code',
        'package_document_id',
        'package_creation_date_time',
        'box_number',
        'user_rename',
        'user_reaccount_number',
        'number_of_pieces',
        'container_id',
        'package_used',
        'status',
        'dimensions_lbs',
        'total_weight_lbs',
        'package_total_volume',
        'package_length_array',
        'package_updated_by',
        'package_updated_date',
        'package_status_updated_by',
        'package_status_updated_date',
        'pickup_location',
        'batch_id',
        'box_location',
        'send_notification_email',
        'package_custom_duty',
        'in_cart'
    ];

    protected $casts = [
        'dimensions_lbs' => 'double',
        'total_weight_lbs' => 'double',
        'package_total_volume' => 'double',
        'package_updated_date' => 'datetime',
        'package_status_updated_date' => 'datetime',
        'send_notification_email' => 'boolean',
        'package_custom_duty' => 'double',
        'in_cart' => 'boolean'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'package_user_id', 'user_id');
    }

    public function shipper()
    {
        return $this->belongsTo(User::class, 'package_shipper_id', 'user_id');
    }

    public function container()
    {
        return $this->belongsTo(Container::class, 'container_id', 'container_id');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id', 'id');
    }

    public function packageStatus()
    {
        return $this->belongsTo(PackageStatus::class, 'package_status', 'package_status_id');
    }

    public function paymentsLive()
    {
        return $this->hasMany(PaymentsLive::class, 'payment_package_tracking_code', 'package_tracking_code');
    }
}
