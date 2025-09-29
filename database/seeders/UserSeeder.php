<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user with proper Bcrypt hashing
        User::create([
            'user_account_number' => 'AC123456',
            'user_email' => 'admin@example.com',
            'password' => Hash::make('password'), // This will use Bcrypt
            'user_first_last_name' => 'Admin User',
            'pickup_location' => 'Kingston',
            'payment_currency' => 'JMD',
        ]);

        User::create([
            'user_account_number' => 'AC123457',
            'user_email' => 'test@example.com',
            'password' => Hash::make('password'),
            'user_first_last_name' => 'Test User',
            'pickup_location' => 'Kingston',
            'payment_currency' => 'JMD',
        ]);
    }
}
