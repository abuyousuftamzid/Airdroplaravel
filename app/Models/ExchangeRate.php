<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    use HasFactory;

    protected $table = 'exchange_rate';

    protected $primaryKey = 'exchange_id';

    protected $fillable = [
        'exchange_price'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
