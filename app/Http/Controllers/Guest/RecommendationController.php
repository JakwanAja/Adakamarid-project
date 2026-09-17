<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\KosController as AdminKosController;
use App\Services\Guest\KosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendationController extends Controller
{
    public function __construct(
        private readonly KosService $kosService,
    ) {}

    /**
     * GET /api/kos/nearby
     * Params: lat (float), lng (float), limit (optional, default 6)
     *
     * Backend resolve koordinat ke kecamatan via Nominatim,
     * lalu kembalikan kos aktif di kecamatan tersebut.
     * Response shape:
     *   { district_detected: string|null, no_match: bool, kos: [...] }
     */
    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat'   => ['required', 'numeric', 'between:-90,90'],
            'lng'   => ['required', 'numeric', 'between:-180,180'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:12'],
        ]);

        $lat   = (float) $request->lat;
        $lng   = (float) $request->lng;
        $limit = (int) $request->get('limit', 6);

        $district = $this->resolveDistrictFromCoords($lat, $lng);

        // Kecamatan tidak dikenali — di luar area Yogyakarta
        if ($district === null) {
            return response()->json([
                'district_detected' => null,
                'no_match'          => true,
                'kos'               => [],
            ]);
        }

        $kos = $this->kosService->getKosByDistrict($district, $limit);

        return response()->json([
            'district_detected' => $district,
            'no_match'          => false,
            'kos'               => $kos->map(fn ($k) => $this->formatKos($k))->values(),
        ]);
    }

    /**
     * POST /api/kos/history
     * Body: { ids: [1,2,3,...] }
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
            $kos->map(fn ($k) => $this->formatKos($k))->values()
        );
    }

    // ── Private helpers ───────────────────────────────────────

    private function resolveDistrictFromCoords(float $lat, float $lng): ?string
    {
        $knownDistricts = AdminKosController::DISTRICTS;

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'AdaKamar.id/1.0 (contact@adakamar.id)',
            ])->timeout(5)->get('https://nominatim.openstreetmap.org/reverse', [
                'lat'             => $lat,
                'lon'             => $lng,
                'format'          => 'json',
                'accept-language' => 'id',
            ]);

            if (!$response->ok()) {
                return null;
            }

            $addr = $response->json('address') ?? [];

            // Nominatim field priority untuk kecamatan Yogyakarta:
            // city_district dan town paling sering berisi nama kecamatan
            $candidates = array_values(array_filter([
                $addr['city_district']  ?? null,
                $addr['town']           ?? null,
                $addr['suburb']         ?? null,
                $addr['village']        ?? null,
                $addr['municipality']   ?? null,
                $addr['county']         ?? null,
                $addr['quarter']        ?? null,
            ]));

            foreach ($candidates as $candidate) {
                $normalized = strtolower(
                    preg_replace('/^kecamatan\s+/i', '', trim($candidate))
                );

                foreach ($knownDistricts as $district) {
                    $distLow = strtolower($district);
                    if (
                        $distLow === $normalized ||
                        str_contains($normalized, $distLow) ||
                        str_contains($distLow, $normalized)
                    ) {
                        return $district;
                    }
                }
            }

        } catch (\Throwable $e) {
            Log::warning('Nominatim reverse geocoding failed', [
                'lat'   => $lat,
                'lng'   => $lng,
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }

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