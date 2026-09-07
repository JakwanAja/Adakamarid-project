<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KosPrice extends Model
{
    protected $table = 'kos_prices';

    public $timestamps = false;

    protected $fillable = [
        'kos_id',
        'type',
        'price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'      => 'decimal:2',
            'is_active'  => 'boolean',
            'updated_at' => 'datetime',
        ];
    }

    public function kos()
    {
        return $this->belongsTo(Kos::class);
    }
}
