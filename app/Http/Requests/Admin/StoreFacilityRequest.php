<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'in:kamar,bersama,sekitar'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Nama fasilitas wajib diisi.',
            'name.max'          => 'Nama fasilitas maksimal 100 karakter.',
            'category.required' => 'Kategori fasilitas wajib dipilih.',
            'category.in'       => 'Kategori harus salah satu dari: kamar, bersama, atau sekitar.',
        ];
    }
}
