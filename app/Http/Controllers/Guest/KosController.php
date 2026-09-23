<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\KosController as AdminKosController;
use App\Models\Kos;
use App\Models\Review;
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

        // Param districts (array) dari filter area populer / kampus
        if ($request->filled('districts')) {
            $districts = $request->input('districts');
            $filters['districts'] = is_array($districts)
                ? $districts
                : explode(',', $districts);
        }

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
        if (!$kos->is_active) {
            abort(404);
        }

        $kos->load([
            'photos',
            'activePrices',
            'facilities',
            // BUG FIX: hanya load reviews yang sudah APPROVED untuk ditampilkan ke publik
            'reviews' => function ($q) {
                $q->where('status', 'approved')
                  ->orderBy('created_at', 'desc')
                  ->with(['user', 'photos']);
            },
        ]);

        $this->kosService->incrementViews($kos);
        $similarKos = $this->kosService->getSimilarKos($kos);

        $facilitiesByCategory = [
            'kamar'   => $kos->facilities->where('category', 'kamar')->values(),
            'bersama' => $kos->facilities->where('category', 'bersama')->values(),
            'sekitar' => $kos->facilities->where('category', 'sekitar')->values(),
        ];

        // BUG FIX: userReview di-query langsung (bukan dari $kos->reviews yang sudah difilter approved)
        // agar ulasan pending/rejected milik sendiri tetap terbaca untuk ditampilkan badge status
        $userReview = null;
        if (auth()->check()) {
            $userReview = Review::where('kos_id', $kos->id)
                ->where('user_id', auth()->id())
                ->with('photos')
                ->first();
        }

        return Inertia::render('Guest/Kos/Show', [
            'kos'                  => $kos,
            'facilitiesByCategory' => $facilitiesByCategory,
            'similarKos'           => $similarKos,
            'userReview'           => $userReview,
        ]);
    }
}