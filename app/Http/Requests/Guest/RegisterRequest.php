<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'string', 'email:rfc', 'max:254', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'max:72', 'confirmed'],
            'password_confirmation' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                  => 'Nama wajib diisi.',
            'name.max'                       => 'Nama maksimal 255 karakter.',
            'email.required'                 => 'Email wajib diisi.',
            'email.email'                    => 'Format email tidak valid.',
            'email.unique'                   => 'Email sudah terdaftar.',
            'password.required'              => 'Password wajib diisi.',
            'password.min'                   => 'Password minimal 8 karakter.',
            'password.max'                   => 'Password maksimal 72 karakter.',
            'password.confirmed'             => 'Konfirmasi password tidak cocok.',
            'password_confirmation.required' => 'Konfirmasi password wajib diisi.',
        ];
    }
}
