<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kos;
use App\Models\Review;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function index(): Response
    {
        $stats = [
            // Kos
            'total_kos'    => Kos::count(),
            'active_kos'   => Kos::where('is_active', true)->count(),
            'inactive_kos' => Kos::where('is_active', false)->count(),
            'plus_kos'     => Kos::where('is_plus', true)->where('is_active', true)->count(),

            // Kos per tipe
            'kos_putra'    => Kos::where('type', 'putra')->count(),
            'kos_putri'    => Kos::where('type', 'putri')->count(),
            'kos_campur'   => Kos::where('type', 'campur')->count(),

            // Ulasan
            'total_reviews'       => Review::count(),
            'avg_rating_platform' => round(Review::avg('rating') ?? 0, 2),

            // Users
            'total_guests' => User::where('role', 'guest')->count(),
            'total_admins' => User::where('role', 'admin')->count(),

            // Views total
            'total_views'  => Kos::sum('views_count'),
        ];

        return Inertia::render('Admin/Statistics/Index', [
            'stats' => $stats,
        ]);
    }
}
