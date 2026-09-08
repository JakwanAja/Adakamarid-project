<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKosRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                 => ['required', 'string', 'max:150'],
            'description'          => ['nullable', 'string'],
            'rules'                => ['nullable', 'string'],
            'type'                 => ['required', 'in:putra,putri,campur'],
            'district'             => ['required', 'string', 'max:100'],
            'address'              => ['required', 'string', 'max:255'],
            'latitude'             => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'            => ['nullable', 'numeric', 'between:-180,180'],
            'contact_name'         => ['required', 'string', 'max:100'],
            'contact_whatsapp'     => ['required', 'string', 'regex:/^\d{10,13}$/'],
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
            'name.required'             => 'Nama kos wajib diisi.',
            'name.max'                  => 'Nama kos maksimal 150 karakter.',
            'type.required'             => 'Tipe kos wajib dipilih.',
            'type.in'                   => 'Tipe kos harus putra, putri, atau campur.',
            'district.required'         => 'Kecamatan wajib dipilih.',
            'address.required'          => 'Alamat wajib diisi.',
            'contact_name.required'     => 'Nama kontak wajib diisi.',
            'contact_whatsapp.required' => 'Nomor WhatsApp wajib diisi.',
            'contact_whatsapp.regex'    => 'Nomor WhatsApp harus berupa 10-13 digit angka.',
        ];
    }
}
