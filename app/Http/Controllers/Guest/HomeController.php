<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\KosController as AdminKosController;
use App\Models\Kos;
use App\Services\Guest\KosService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly KosService $kosService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Guest/Home', [
            'featuredKos'  => $this->kosService->getHomepageListing(),
            'promotedKos'  => $this->kosService->getPromotedKos(8),
            'totalKos'     => Kos::where('is_active', true)->count(),
            'districts'    => AdminKosController::DISTRICTS,
        ]);
    }
}