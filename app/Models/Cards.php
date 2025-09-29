<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cards extends Model
{
    use HasFactory;

    protected $table = 'cards';

    protected $fillable = [
        'card_type',
        'card_holder_name',
        'card_number',
        'card_expire_date',
        'card_cvv',
        'card_default_state',
        'card_holder_user_id'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'card_holder_user_id', 'user_id');
    }
}
