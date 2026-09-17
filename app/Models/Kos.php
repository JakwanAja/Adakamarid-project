<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Kos extends Model
{
    protected $table = 'kos';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'rules',
        'type',
        'has_ac',
        'has_wifi',
        'has_private_bathroom',
        'district',
        'address',
        'latitude',
        'longitude',
        'contact_name',
        'contact_whatsapp',
        'is_plus',
        'is_promoted',
        'is_active',
        'rating_avg',
        'review_count',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'has_ac'               => 'boolean',
            'has_wifi'             => 'boolean',
            'has_private_bathroom' => 'boolean',
            'is_plus'              => 'boolean',
            'is_promoted'          => 'boolean',
            'is_active'            => 'boolean',
            'latitude'             => 'decimal:7',
            'longitude'            => 'decimal:7',
            'rating_avg'           => 'decimal:2',
            'created_at'           => 'datetime',
            'updated_at'           => 'datetime',
        ];
    }

    // ── Scopes ───────────────────────────────────────────────
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePlus($query)
    {
        return $query->where('is_plus', true);
    }

    public function scopePromoted($query)
    {
        return $query->where('is_promoted', true);
    }

    // ── Relations ────────────────────────────────────────────
    public function prices()
    {
        return $this->hasMany(KosPrice::class);
    }

    public function activePrices()
    {
        return $this->hasMany(KosPrice::class)->where('is_active', true);
    }

    public function photos()
    {
        return $this->hasMany(KosPhoto::class)->orderBy('sort_order');
    }

    public function primaryPhoto()
    {
        return $this->hasOne(KosPhoto::class)->where('is_primary', true);
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'kos_facilities');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // ── Helpers ──────────────────────────────────────────────
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while (true) {
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            if (!$query->exists()) {
                break;
            }
            $count++;
            $slug = $original . '-' . $count;
        }

        return $slug;
    }

    public function recalculateRating(): void
    {
        $avg = $this->reviews()->avg('rating') ?? 0;
        $count = $this->reviews()->count();

        $this->update([
            'rating_avg'   => round($avg, 2),
            'review_count' => $count,
        ]);
    }
}