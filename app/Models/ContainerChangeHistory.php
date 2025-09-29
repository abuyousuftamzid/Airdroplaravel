<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContainerChangeHistory extends Model
{
    use HasFactory;

    protected $table = 'container_change_histroy';

    protected $primaryKey = 'history_id';

    protected $fillable = [
        'container_id',
        'container_airwaybill',
        'container_status',
        'conatiner_location',
        'container_remark',
        'container_update_date',
        'container_employee_id'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function container()
    {
        return $this->belongsTo(Container::class, 'container_id', 'container_id');
    }
}
