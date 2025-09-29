<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotions extends Model
{
    use HasFactory;

    protected $table = 'promotions';

    protected $primaryKey = 'message_id';

    protected $fillable = [
        'created_date',
        'message_description',
        'message_title'
    ];

    protected $casts = [
        'created_date' => 'datetime'
    ];
}
