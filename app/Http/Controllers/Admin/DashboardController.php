<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kos;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Statistik ringkasan
        $stats = [
            'active_kos'    => Kos::where('is_active', true)->count(),
            'plus_kos'      => Kos::where('is_active', true)->where('is_plus', true)->count(),
            'total_reviews' => Review::count(),
        ];

        // 5 kos terbaru
        $recent_kos = Kos::select(['id', 'name', 'district', 'is_active', 'is_plus', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // 5 ulasan terbaru
        $recent_reviews = Review::with([
            'kos:id,name,slug',
            'user:id,name',
        ])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'          => $stats,
            'recent_kos'     => $recent_kos,
            'recent_reviews' => $recent_reviews,
        ]);
    }
}
