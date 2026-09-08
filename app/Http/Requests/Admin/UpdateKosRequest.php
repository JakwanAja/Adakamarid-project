<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKosRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                 => ['sometimes', 'required', 'string', 'max:150'],
            'description'          => ['nullable', 'string'],
            'rules'                => ['nullable', 'string'],
            'type'                 => ['sometimes', 'required', 'in:putra,putri,campur'],
            'district'             => ['sometimes', 'required', 'string', 'max:100'],
            'address'              => ['sometimes', 'required', 'string', 'max:255'],
            'latitude'             => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'            => ['nullable', 'numeric', 'between:-180,180'],
            'contact_name'         => ['sometimes', 'required', 'string', 'max:100'],
            'contact_whatsapp'     => ['sometimes', 'required', 'string', 'regex:/^\d{10,13}$/'],
            'has_ac'               => ['boolean'],
            'has_wifi'             => ['boolean'],
            'has_private_bathroom' => ['boolean'],
            'is_plus'              => ['boolean'],
            'is_active'            => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max'               => 'Nama kos maksimal 150 karakter.',
            'type.in'                => 'Tipe kos harus putra, putri, atau campur.',
            'contact_whatsapp.regex' => 'Nomor WhatsApp harus berupa 10-13 digit angka.',
        ];
    }
}
