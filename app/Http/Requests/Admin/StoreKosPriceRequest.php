<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKosPriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prices'             => ['required', 'array', 'min:1'],
            'prices.*.type'      => ['required', 'string', 'in:harian,bulanan,tahunan'],
            'prices.*.price'     => ['nullable', 'numeric', 'min:0', 'max:999999999'],
            'prices.*.is_active' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'prices.required'        => 'Data harga wajib dikirim.',
            'prices.*.type.required' => 'Tipe harga tidak valid.',
            'prices.*.type.in'       => 'Tipe harga harus harian, bulanan, atau tahunan.',
            'prices.*.price.numeric' => 'Harga harus berupa angka.',
            'prices.*.price.min'     => 'Harga tidak boleh negatif.',
            'prices.*.price.max'     => 'Harga tidak boleh melebihi 999.999.999.',
        ];
    }
}
