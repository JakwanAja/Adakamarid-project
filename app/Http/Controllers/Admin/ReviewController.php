<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\Admin\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService,
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->get('status', ''); // '' | pending | approved | rejected

        $query = Review::with(['kos:id,name,slug', 'user:id,name', 'photos'])
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $reviews = $query->paginate(20)->withQueryString();

        // Hitung jumlah per status untuk badge counter
        $counts = [
            'all'      => Review::count(),
            'pending'  => Review::where('status', 'pending')->count(),
            'approved' => Review::where('status', 'approved')->count(),
            'rejected' => Review::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Reviews/Index', [
            'reviews'       => $reviews,
            'activeStatus'  => $status,
            'statusCounts'  => $counts,
        ]);
    }

    public function approve(Review $review)
    {
        $review->load('kos');
        $this->reviewService->approve($review);
        return back()->with('success', 'Ulasan berhasil disetujui.');
    }

    public function reject(Review $review)
    {
        $review->load('kos');
        $this->reviewService->reject($review);
        return back()->with('success', 'Ulasan berhasil ditolak.');
    }

    public function destroy(Review $review)
    {
        try {
            $review->load(['photos', 'kos']);
            $this->reviewService->delete($review);
            return back()->with('success', 'Ulasan berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Ulasan gagal dihapus, coba lagi.');
        }
    }
}