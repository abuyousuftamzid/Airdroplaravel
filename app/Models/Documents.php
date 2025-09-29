<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documents extends Model
{
    use HasFactory;

    protected $table = 'documents';

    protected $primaryKey = 'doc_id';

    protected $fillable = [
        'doc_file_name',
        'doc_file_path',
        'doc_type',
        'doc_user_id',
        'doc_upload_status',
        'doc_approved_status'
    ];

    protected $casts = [
        // Add your casts here
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'doc_user_id', 'user_id');
    }
}
