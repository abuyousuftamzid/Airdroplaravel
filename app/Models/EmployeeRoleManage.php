<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeRoleManage extends Model
{
    protected $table = 'employee_role_manage';
    protected $primaryKey = 'module_id';
    public $timestamps = false;

    protected $fillable = [
        'module_name',
        'Airdrop_Shipper',
        'Airdrop_Cashier',
        'Airdrop_Manager',
        'Airdrop_Supervisor',
        'Airdrop_Admin',
        'Airdrop_Master_Admin',
        'Airdrop_Operations_Supervisor',
    ];

    protected $casts = [
        'Airdrop_Shipper' => 'string',
        'Airdrop_Cashier' => 'string',
        'Airdrop_Manager' => 'string',
        'Airdrop_Supervisor' => 'string',
        'Airdrop_Admin' => 'string',
        'Airdrop_Master_Admin' => 'integer',
        'Airdrop_Operations_Supervisor' => 'string',
    ];
}
