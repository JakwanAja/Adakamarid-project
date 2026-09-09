<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\KosController as AdminKosController;
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

        // Validasi price_min tidak boleh lebih besar dari price_max
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
}
