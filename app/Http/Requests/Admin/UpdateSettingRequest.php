<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'platform_name' => ['required', 'string', 'max:100'],
            'logo'          => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'platform_name.required' => 'Nama platform wajib diisi.',
            'platform_name.max'      => 'Nama platform maksimal 100 karakter.',
            'logo.mimes'             => 'Format logo harus PNG, JPG, atau SVG.',
            'logo.max'               => 'Ukuran logo maksimal 2 MB.',
        ];
    }
}
