<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKosPriceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'prices'             => ['required', 'array'],
            'prices.*.type'      => ['required', 'in:harian,bulanan,tahunan'],
            'prices.*.price'     => ['required_if:prices.*.is_active,true', 'nullable', 'numeric', 'min:1', 'max:999999999'],
            'prices.*.is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'prices.*.type.in'            => 'Tipe harga tidak valid.',
            'prices.*.price.required_if'  => 'Harga wajib diisi jika tipe sewa diaktifkan.',
            'prices.*.price.min'          => 'Harga harus lebih dari 0.',
            'prices.*.price.max'          => 'Harga tidak boleh melebihi 999.999.999.',
        ];
    }
}
