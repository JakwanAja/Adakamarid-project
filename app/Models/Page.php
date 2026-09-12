<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $table = 'pages';

    public $timestamps = false;

    protected $fillable = [
        'slug',
        'title',
        'content',
        'is_active',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active'  => 'boolean',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Ambil halaman by slug, hanya yang aktif.
     */
    public static function findBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->where('is_active', true)->first();
    }
}
