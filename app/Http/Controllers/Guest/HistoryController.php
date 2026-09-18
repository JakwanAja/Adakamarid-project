<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\Guest\KosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function __construct(
        private readonly KosService $kosService,
    ) {}

    /**
     * POST /api/kos/history
     * Body: { ids: [3, 1, 7, ...] }   (urutan = terbaru duluan)
     *
     * Mengembalikan detail kos berdasarkan riwayat localStorage guest.
     * Urutan hasil mengikuti urutan ids yang dikirim.
     */
    public function resolve(Request $request): JsonResponse
    {
        $request->validate([
            'ids'   => ['required', 'array', 'max:20'],
            'ids.*' => ['integer', 'min:1'],
        ]);

        $kos = $this->kosService->getKosByHistory(
            ids:   $request->ids,
            limit: 8,
        );

        return response()->json(
            $kos->map(fn ($k) => $this->format($k))->values()
        );
    }

    private function format($kos): array
    {
        $photo       = $kos->primary_photo;
        $lowestPrice = $kos->active_prices->first();

        return [
            'id'            => $kos->id,
            'name'          => $kos->name,
            'slug'          => $kos->slug,
            'type'          => $kos->type,
            'district'      => $kos->district,
            'is_plus'       => $kos->is_plus,
            'is_promoted'   => $kos->is_promoted,
            'rating_avg'    => $kos->rating_avg,
            'primary_photo' => $photo ? ['path' => $photo->path] : null,
            'active_prices' => $kos->active_prices->map(fn ($p) => [
                'id'    => $p->id,
                'type'  => $p->type,
                'price' => $p->price,
            ])->values()->toArray(),
        ];
    }
}