<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\KosController as AdminKosController;
use App\Models\Kos;
use App\Services\Guest\KosService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KosController extends Controller
{
    public function __construct(
        private readonly KosService $kosService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search', 'type', 'district', 'price_type', 'price_min', 'price_max',
        ]);

        if (!empty($filters['price_min']) && !empty($filters['price_max'])) {
            if ((int) $filters['price_min'] > (int) $filters['price_max']) {
                return Inertia::render('Guest/Kos/Index', [
                    'kos'       => null,
                    'filters'   => $filters,
                    'districts' => AdminKosController::DISTRICTS,
                    'errors'    => ['price' => 'Harga minimum tidak boleh lebih besar dari harga maksimum.'],
                ]);
            }
        }

        $kos = $this->kosService->getFilteredListing($filters);

        return Inertia::render('Guest/Kos/Index', [
            'kos'       => $kos,
            'filters'   => $filters,
            'districts' => AdminKosController::DISTRICTS,
        ]);
    }

    public function show(Kos $kos): Response
    {
        // 404 jika kos nonaktif
        if (!$kos->is_active) {
            abort(404);
        }

        // Eager load semua relasi
        $kos->load([
            'photos',
            'activePrices',
            'facilities',
            'reviews' => function ($q) {
                $q->orderBy('created_at', 'desc')
                  ->with(['user', 'photos']);
            },
        ]);

        // Increment views
        $this->kosService->incrementViews($kos);

        // Kos serupa dari kecamatan yang sama
        $similarKos = $this->kosService->getSimilarKos($kos);

        // Group fasilitas per kategori
        $facilitiesByCategory = [
            'kamar'   => $kos->facilities->where('category', 'kamar')->values(),
            'bersama' => $kos->facilities->where('category', 'bersama')->values(),
            'sekitar' => $kos->facilities->where('category', 'sekitar')->values(),
        ];

        return Inertia::render('Guest/Kos/Show', [
            'kos'                  => $kos,
            'facilitiesByCategory' => $facilitiesByCategory,
            'similarKos'           => $similarKos,
        ]);
    }
}
