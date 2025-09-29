<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportConfiguration extends Model
{
    use HasFactory;

    protected $table = 'report_configuration';

    protected $fillable = [
        'user_id',
        'config_json',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'config_json' => 'json'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
