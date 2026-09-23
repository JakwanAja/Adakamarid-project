<?php

namespace App\Services\Admin;

use App\Models\Review;
use App\Repositories\KosRepository;
use App\Services\Guest\ReviewService as GuestReviewService;

class ReviewService
{
    public function __construct(
        private readonly GuestReviewService $guestReviewService,
        private readonly KosRepository      $kosRepository,
    ) {}

    public function delete(Review $review): void
    {
        $this->guestReviewService->delete($review);
    }

    /**
     * Setujui ulasan — ubah status ke approved dan recalculate rating kos.
     */
    public function approve(Review $review): void
    {
        $review->update(['status' => 'approved']);

        if ($review->kos) {
            $this->kosRepository->updateRating($review->kos);
        }
    }

    /**
     * Tolak ulasan — ubah status ke rejected dan recalculate rating kos.
     */
    public function reject(Review $review): void
    {
        $review->update(['status' => 'rejected']);

        if ($review->kos) {
            $this->kosRepository->updateRating($review->kos);
        }
    }
}