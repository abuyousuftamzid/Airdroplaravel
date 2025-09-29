<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IpAuthorization extends Model
{
    use HasFactory;

    protected $table = 'ip_authorization';

    protected $fillable = [
        'ip_address_id',
        'user_id'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function whiteListIp()
    {
        return $this->belongsTo(WhiteListIps::class, 'ip_address_id', 'id');
    }
}
