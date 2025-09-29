<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseAddress extends Model
{
    use HasFactory;

    protected $table = 'warehoue_address';

    protected $primaryKey = 'address_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'address_id',
        'fullname',
        'address_line_1',
        'address_line_2',
        'address_line_3',
        'address_line_4',
        'city',
        'state',
        'zip_code',
        'phone_number'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
