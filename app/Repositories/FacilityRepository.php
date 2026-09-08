<?php

namespace App\Repositories;

use App\Models\Facility;
use Illuminate\Support\Collection;

class FacilityRepository
{
    /**
     * Ambil semua fasilitas dikelompokkan berdasarkan kategori.
     *
     * @return array<string, Collection>
     */
    public function allGroupedByCategory(): array
    {
        $all = Facility::orderBy('name')->get();

        return [
            'kamar'   => $all->where('category', 'kamar')->values(),
            'bersama' => $all->where('category', 'bersama')->values(),
            'sekitar' => $all->where('category', 'sekitar')->values(),
        ];
    }

    /**
     * Ambil semua fasilitas sebagai flat collection (untuk checkbox selector).
     */
    public function all(): Collection
    {
        return Facility::orderBy('category')->orderBy('name')->get();
    }

    public function findById(int $id): ?Facility
    {
        return Facility::find($id);
    }

    public function create(array $data): Facility
    {
        return Facility::create($data);
    }

    public function update(Facility $facility, array $data): bool
    {
        return $facility->update($data);
    }

    public function delete(Facility $facility): bool
    {
        return $facility->delete();
    }

    /**
     * Cek apakah nama fasilitas sudah ada (case-insensitive).
     *
     * @param string   $name      Nama yang akan dicek
     * @param int|null $excludeId ID yang dikecualikan (untuk validasi edit)
     */
    public function existsByName(string $name, ?int $excludeId = null): bool
    {
        $query = Facility::whereRaw('LOWER(name) = ?', [strtolower($name)]);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
