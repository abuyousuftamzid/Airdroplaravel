<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArdSearch extends Model
{
    use HasFactory;

    protected $table = 'ard_search';

    protected $fillable = [
        'user_id',
        'tracking_code'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
