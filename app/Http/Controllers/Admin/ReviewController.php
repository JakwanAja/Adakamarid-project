<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\Admin\ReviewService;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService,
    ) {}

    public function index(): Response
    {
        $reviews = Review::with(['kos:id,name,slug', 'user:id,name', 'photos'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
        ]);
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
