<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhiteListIps extends Model
{
    use HasFactory;

    protected $table = 'white_list_ips';

    protected $fillable = [
        'ips',
        'created_date',
        'created_by',
        'is_deleted',
        'updated_date',
        'updated_by'
    ];

    protected $casts = [
        'created_date' => 'datetime',
        'updated_date' => 'datetime',
        'is_deleted' => 'boolean'
    ];

    // Relationships
    public function ipAuthorizations()
    {
        return $this->hasMany(IpAuthorization::class, 'ip_address_id', 'id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
