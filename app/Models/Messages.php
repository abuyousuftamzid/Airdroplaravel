<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messages extends Model
{
    use HasFactory;

    protected $table = 'messages';

    protected $primaryKey = 'message_id';

    protected $fillable = [
        'message_title',
        'message_description',
        'message_package_id',
        'message_current_user',
        'message_current_account',
        'message_assign_user',
        'message_assign_account',
        'message_ajent_user',
        'message_ajent_account',
        'message_airwaybill',
        'message_container_id',
        'message_status',
        'message_date',
        'message_receiver_ids',
        'sender',
        'reciever',
        'message_deleted',
        'message_star',
        'message_reciever_meta_settings',
        'read_status',
        'delete_status'
    ];

    protected $casts = [
        'message_reciever_meta_settings' => 'json',
        'read_status' => 'json',
        'delete_status' => 'json'
    ];

    // Relationships
    public function package()
    {
        return $this->belongsTo(Packages::class, 'message_package_id', 'package_id');
    }

    public function container()
    {
        return $this->belongsTo(Container::class, 'message_container_id', 'container_id');
    }
}
