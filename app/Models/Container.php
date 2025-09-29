<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Container extends Model
{
    use HasFactory;

    protected $table = 'container';

    protected $primaryKey = 'container_id';

    protected $fillable = [
        'container_tracking_number',
        'container_airwaybillno',
        'container_Gross_weight_kg',
        'container_net_weight',
        'container_pack_number',
        'container_total_pieces',
        'container_origin',
        'container_destination',
        'container_date_of_departure',
        'container_date_of_arrival',
        'container_create_date',
        'container_update_date',
        'container_flight_ship_truck_no',
        'container_packages_id',
        'container_info',
        'container_status',
        'xml_file_path',
        'csv_file_path',
        'pdf_file_path',
        'container_type',
        'c86_form_path',
        'container_emoloye_id',
        'container_office_code'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function packages()
    {
        return $this->hasMany(Packages::class, 'container_id', 'container_id');
    }

    public function packagesLive()
    {
        return $this->hasMany(PackagesLive::class, 'container_id', 'container_id');
    }

    public function containerChangeHistory()
    {
        return $this->hasMany(ContainerChangeHistory::class, 'container_id', 'container_id');
    }

    public function messages()
    {
        return $this->hasMany(Messages::class, 'message_container_id', 'container_id');
    }
}
