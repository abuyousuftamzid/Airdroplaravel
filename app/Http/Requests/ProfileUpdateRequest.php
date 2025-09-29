<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_first_last_name' => ['required', 'string', 'max:50'],
            'user_email' => [
                'required',
                'string',
                'email',
                'max:100',
                Rule::unique(User::class, 'user_email')->ignore($this->user()->user_id, 'user_id'),
            ],
        ];
    }
}
