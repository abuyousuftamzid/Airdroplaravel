<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthorizedUser extends Model
{
    use HasFactory;

    protected $table = 'authorized_user';

    protected $primaryKey = 'secondary_user_id';

    protected $fillable = [
        'user_account_number',
        'primary_user_id',
        'user_first_name',
        'user_middle_name',
        'user_last_name',
        'identification_type',
        'identification_id_number',
        'user_country_code',
        'user_mobile_number',
        'user_email',
        'user_password',
        'user_type',
        'user_creation_date_time',
        'user_address',
        'user_address_city',
        'user_address_state',
        'is_deleted',
        'trn_no',
        'user_activate'
    ];

    protected $casts = [
        'is_deleted' => 'boolean'
    ];
}
