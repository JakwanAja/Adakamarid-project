<?php

namespace App\Repositories;

use App\Models\Kos;
use App\Models\KosPhoto;
use Illuminate\Support\Facades\DB;

class KosPhotoRepository
{
    public function store(Kos $kos, string $path, int $sortOrder): KosPhoto
    {
        return KosPhoto::create([
            'kos_id'     => $kos->id,
            'path'       => $path,
            'is_primary' => false,
            'sort_order' => $sortOrder,
        ]);
    }

    /**
     * Set foto sebagai foto utama — unset semua foto lain milik kos yang sama.
     * Dijalankan dalam transaksi untuk konsistensi data.
     */
    public function setPrimary(KosPhoto $photo): void
    {
        DB::transaction(function () use ($photo) {
            // Unset semua foto utama milik kos ini
            KosPhoto::where('kos_id', $photo->kos_id)
                ->where('id', '!=', $photo->id)
                ->update(['is_primary' => false]);

            // Set foto ini sebagai utama
            $photo->update(['is_primary' => true]);
        });
    }

    public function delete(KosPhoto $photo): bool
    {
        return $photo->delete();
    }

    /**
     * Dapatkan sort_order berikutnya untuk kos tertentu.
     */
    public function getNextSortOrder(Kos $kos): int
    {
        $max = KosPhoto::where('kos_id', $kos->id)->max('sort_order');
        return ($max ?? 0) + 1;
    }

    /**
     * Hitung jumlah foto yang dimiliki kos.
     */
    public function countForKos(Kos $kos): int
    {
        return KosPhoto::where('kos_id', $kos->id)->count();
    }
}
