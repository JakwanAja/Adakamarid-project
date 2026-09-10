<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreReviewRequest;
use App\Http\Requests\Guest\UpdateReviewRequest;
use App\Models\Kos;
use App\Models\Review;
use App\Services\Guest\ReviewService;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService,
    ) {}

    public function store(StoreReviewRequest $request, Kos $kos)
    {
        try {
            $this->reviewService->store(
                $kos,
                Auth::user(),
                $request->validated(),
                $request->file('photos', [])
            );

            return back()->with('success', 'Ulasan berhasil dikirim. Terima kasih!');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateReviewRequest $request, Kos $kos, Review $review)
    {
        try {
            $this->reviewService->update(
                $review,
                Auth::user(),
                $request->validated(),
                $request->file('photos', [])
            );

            return back()->with('success', 'Ulasan berhasil diperbarui.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
