<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\Guest\KosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(
        private readonly KosService $kosService,
    ) {}

    /**
     * GET /api/kos/nearby
     * Params: district (string nama kecamatan), limit (optional, default 6)
     *
     * Menerima nama kecamatan hasil reverse geocode dari browser (Nominatim),
     * lalu mengembalikan kos aktif di kecamatan yang sama.
     */
    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'district' => ['required', 'string', 'max:100'],
            'limit'    => ['sometimes', 'integer', 'min:1', 'max:12'],
        ]);

        $kos = $this->kosService->getKosByDistrict(
            district: trim($request->district),
            limit:    (int) $request->get('limit', 6),
        );

        return response()->json(
            $kos->map(fn ($k) => $this->formatKos($k))
        );
    }

    /**
     * POST /api/kos/history
     * Body: { ids: [1,2,3,...] }
     *
     * Mengembalikan detail kos berdasarkan array ID riwayat (dari localStorage).
     */
    public function history(Request $request): JsonResponse
    {
        $request->validate([
            'ids'   => ['required', 'array', 'max:20'],
            'ids.*' => ['integer', 'min:1'],
        ]);

        $kos = $this->kosService->getKosByHistory(
            ids:   $request->ids,
            limit: 6,
        );

        return response()->json(
            $kos->map(fn ($k) => $this->formatKos($k))
        );
    }

    // ─────────────────────────────────────────────────────────
    private function formatKos($kos): array
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
            'active_prices' => $lowestPrice ? [[
                'type'  => $lowestPrice->type,
                'price' => $lowestPrice->price,
            ]] : [],
        ];
    }
}