<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromotionMessagesStates extends Model
{
    use HasFactory;

    protected $table = 'promotion_messages_states';

    protected $primaryKey = 'message_state_id';

    protected $fillable = [
        'message_star',
        'message_deleted',
        'message_id',
        'user_account',
        'message_read'
    ];

    protected $casts = [
        // Add your casts here
    ];
}
