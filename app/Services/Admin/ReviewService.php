<?php

namespace App\Services\Admin;

use App\Models\Review;
use App\Services\Guest\ReviewService as GuestReviewService;

class ReviewService
{
    public function __construct(
        private readonly GuestReviewService $guestReviewService,
    ) {}

    public function delete(Review $review): void
    {
        $this->guestReviewService->delete($review);
    }
}
