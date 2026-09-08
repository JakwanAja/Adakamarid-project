<?php

namespace App\Repositories;

use App\Models\Kos;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KosRepository
{
    /**
     * Ambil semua kos dengan filter opsional, paginated 15 per halaman.
     */
    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = Kos::with(['primaryPhoto', 'activePrices'])
            ->where('is_active', true);

        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', $search)
                  ->orWhere('address', 'LIKE', $search);
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['district'])) {
            $query->where('district', $filters['district']);
        }

        if (!empty($filters['price_type'])) {
            $query->whereHas('activePrices', function ($q) use ($filters) {
                $q->where('type', $filters['price_type']);
            });
        }

        if (!empty($filters['price_min'])) {
            $query->whereHas('activePrices', function ($q) use ($filters) {
                $q->where('price', '>=', $filters['price_min']);
            });
        }

        if (!empty($filters['price_max'])) {
            $query->whereHas('activePrices', function ($q) use ($filters) {
                $q->where('price', '<=', $filters['price_max']);
            });
        }

        return $query->orderBy('is_plus', 'desc')
                     ->orderBy('created_at', 'desc')
                     ->paginate(15)
                     ->withQueryString();
    }

    /**
     * Ambil semua kos untuk halaman admin (tanpa filter aktif).
     */
    public function getAdminList(): Collection
    {
        return Kos::with(['primaryPhoto'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Ambil kos aktif untuk homepage — Plus dulu, lalu terbaru, max 8.
     */
    public function getActiveForHomepage(): Collection
    {
        return Kos::with(['primaryPhoto', 'activePrices'])
            ->where('is_active', true)
            ->orderBy('is_plus', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();
    }

    /**
     * Ambil kos serupa berdasarkan kecamatan (untuk rekomendasi di halaman detail).
     */
    public function getSimilarByDistrict(Kos $kos, int $limit = 4): Collection
    {
        return Kos::with(['primaryPhoto', 'activePrices'])
            ->where('is_active', true)
            ->where('district', $kos->district)
            ->where('id', '!=', $kos->id)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function findBySlug(string $slug): ?Kos
    {
        return Kos::where('slug', $slug)->first();
    }

    public function findById(int $id): ?Kos
    {
        return Kos::find($id);
    }

    public function create(array $data): Kos
    {
        return Kos::create($data);
    }

    public function update(Kos $kos, array $data): bool
    {
        return $kos->update($data);
    }

    public function delete(Kos $kos): bool
    {
        return $kos->delete();
    }

    public function incrementViews(Kos $kos): void
    {
        $kos->increment('views_count');
    }

    /**
     * Hitung ulang rating_avg dan review_count berdasarkan ulasan yang ada.
     */
    public function updateRating(Kos $kos): void
    {
        $kos->recalculateRating();
    }

    /**
     * Ambil daftar kecamatan unik yang tersedia di database.
     */
    public function getDistinctDistricts(): array
    {
        return Kos::distinct()->orderBy('district')->pluck('district')->toArray();
    }
}
