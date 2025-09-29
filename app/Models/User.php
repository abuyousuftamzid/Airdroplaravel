<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable //implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    /**
     * Indicates if the model should be timestamped.
     * The users table doesn't have created_at/updated_at columns
     */
    public $timestamps = false;

    /**
     * The name of the column to use for authentication.
     */
    public function getAuthIdentifierName()
    {
        return 'user_id';
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getEmailForPasswordReset()
    {
        return $this->user_email;
    }

    /**
     * Get the email address that should be used for verification.
     */
    public function getEmailForVerification()
    {
        return $this->user_email;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_account_number',
        'user_email',
        'password',
        'user_master_password',
        'user_first_last_name',
        'user_second_last_name',
        'user_signup_date',
        'user_trn_number',
        'user_identity_number',
        'user_identity_type',
        'user_address_country',
        'user_tnc',
        'user_auth',
        'user_hear_type',
        'user_type',
        'user_account_status',
        'user_account_status_change_reson',
        'status_change_comment',
        'user_state',
        'user_package_delivery_location',
        'user_package_visibility',
        'user_dob',
        'user_language',
        'user_mobile',
        'user_phone',
        'user_phone_office',
        'user_fax',
        'user_address_line_1',
        'user_address_line_2',
        'user_address_city',
        'user_address_state',
        'user_delivery_instructions',
        'user_business_focus',
        'user_payment_method',
        'user_account_type',
        'pass_reset_code',
        'user_activation_code',
        'user_email_notification',
        'user_sms_notification',
        'user_offers_notification',
        'account_status',
        'user_disable_login',
        'is_deleted',
        'password_updated_date',
        'last_login_date',
        'login_verification_code',
        'pickup_location',
        'payment_currency',
        'is_logged_in',
        'google_secret_key',
        'session_token',
        'user_branch',
        'is_tlhc',
        'stripe_id',
        'pm_type',
        'pm_last_four',
        'trial_ends_at',
        'force_password_reset'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'user_master_password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_deleted' => 'boolean',
            'is_logged_in' => 'boolean',
            'is_tlhc' => 'boolean',
            'force_password_reset' => 'boolean',
            'password_updated_date' => 'datetime',
            'last_login_date' => 'datetime',
            'trial_ends_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function packages()
    {
        return $this->hasMany(Packages::class, 'package_user_id', 'user_id');
    }

    public function packagesLive()
    {
        return $this->hasMany(PackagesLive::class, 'package_user_id', 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Orders::class, 'order_user_id', 'user_id');
    }

    public function payments()
    {
        return $this->hasMany(Payments::class, 'payment_package_user_id', 'user_id');
    }

    public function paymentsLive()
    {
        return $this->hasMany(PaymentsLive::class, 'payment_package_user_id', 'user_id');
    }

    public function documents()
    {
        return $this->hasMany(Documents::class, 'doc_user_id', 'user_id');
    }

    public function cards()
    {
        return $this->hasMany(Cards::class, 'card_holder_user_id', 'user_id');
    }

    public function loginLogs()
    {
        return $this->hasMany(LoginLogs::class, 'user_id', 'user_id');
    }

    public function userSessions()
    {
        return $this->hasMany(UserSessions::class, 'user_id', 'user_id');
    }

    public function ipAuthorizations()
    {
        return $this->hasMany(IpAuthorization::class, 'user_id', 'user_id');
    }

    public function userAircoins()
    {
        return $this->hasMany(UserAircoins::class, 'user_id', 'user_id');
    }

    public function ardSearches()
    {
        return $this->hasMany(ArdSearch::class, 'user_id', 'user_id');
    }

    public function reportConfigurations()
    {
        return $this->hasMany(ReportConfiguration::class, 'user_id', 'user_id');
    }

    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocations::class, 'user_package_delivery_location', 'location_id');
    }

    /**
     * Role-based helper methods for dashboard redirection
     */

    /**
     * Check if user is an admin (any admin role)
     */
    // public function isAdmin(): bool
    // {
    //     $adminRoles = [
    //         'Airdrop_Admin',
    //         'Airdrop_Master_Admin',
    //         'Airdrop_Manager',
    //         'Airdrop_Supervisor',
    //         'Airdrop_Operations_Supervisor'
    //     ];

    //     return in_array($this->user_type, $adminRoles);
    // }

    // Instead of array comparison, use database query
    public function isAdmin(): bool
    {
        return $this->user_type && in_array($this->user_type, [
            'Airdrop_Admin',
            'Airdrop_Master_Admin',
            'Airdrop_Manager',
            'Airdrop_Supervisor',
            'Airdrop_Operations_Supervisor'
        ]);
    }
}
