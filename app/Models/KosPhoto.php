<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KosPhoto extends Model
{
    protected $table = 'kos_photos';

    public $timestamps = false;

    protected $fillable = [
        'kos_id',
        'path',
        'is_primary',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary'  => 'boolean',
            'sort_order'  => 'integer',
            'created_at'  => 'datetime',
        ];
    }

    public function kos()
    {
        return $this->belongsTo(Kos::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
