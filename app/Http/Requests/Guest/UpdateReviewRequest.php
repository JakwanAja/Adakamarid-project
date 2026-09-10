<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating'   => ['required', 'integer', 'min:1', 'max:5'],
            'comment'  => ['nullable', 'string', 'max:1000'],
            'photos'   => ['nullable', 'array', 'max:3'],
            'photos.*' => ['image', 'mimes:jpeg,jpg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Rating wajib diisi.',
            'rating.integer'  => 'Rating harus berupa angka.',
            'rating.min'      => 'Rating minimal 1.',
            'rating.max'      => 'Rating maksimal 5.',
            'comment.max'     => 'Komentar maksimal 1000 karakter.',
            'photos.max'      => 'Maksimal 3 foto per ulasan.',
            'photos.*.mimes'  => 'Format foto harus JPEG atau PNG.',
            'photos.*.max'    => 'Ukuran foto maksimal 2 MB per foto.',
        ];
    }
}
