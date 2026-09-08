<?php

namespace App\Repositories;

use App\Models\Kos;
use App\Models\KosPrice;

class KosPriceRepository
{
    /**
     * Upsert harga sewa untuk kos.
     * $prices = [
     *   ['type' => 'harian',   'price' => 150000, 'is_active' => true],
     *   ['type' => 'bulanan',  'price' => 800000, 'is_active' => true],
     *   ['type' => 'tahunan',  'price' => 8000000, 'is_active' => false],
     * ]
     */
    public function upsertForKos(Kos $kos, array $prices): void
    {
        foreach ($prices as $priceData) {
            KosPrice::updateOrCreate(
                [
                    'kos_id' => $kos->id,
                    'type'   => $priceData['type'],
                ],
                [
                    'price'     => $priceData['price'] ?? 0,
                    'is_active' => $priceData['is_active'] ?? false,
                ]
            );
        }
    }
}
