<?php

namespace App\Repositories;

use App\Models\Kos;
use App\Models\Review;
use App\Models\ReviewPhoto;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ReviewRepository
{
    public function findById(int $id): ?Review
    {
        return Review::with(['user', 'photos'])->find($id);
    }

    /**
     * Cari ulasan milik user untuk kos tertentu (1 per guest per kos).
     */
    public function findByUserAndKos(User $user, Kos $kos): ?Review
    {
        return Review::where('user_id', $user->id)
            ->where('kos_id', $kos->id)
            ->with(['photos'])
            ->first();
    }

    public function forKos(Kos $kos): Collection
    {
        return Review::where('kos_id', $kos->id)
            ->orderBy('created_at', 'desc')
            ->with(['user', 'photos'])
            ->get();
    }

    public function create(array $data): Review
    {
        return Review::create($data);
    }

    public function update(Review $review, array $data): bool
    {
        return $review->update($data);
    }

    public function delete(Review $review): bool
    {
        return $review->delete();
    }

    public function storePhoto(Review $review, string $path): ReviewPhoto
    {
        return ReviewPhoto::create([
            'review_id' => $review->id,
            'path'      => $path,
        ]);
    }

    public function deletePhotos(Review $review): void
    {
        $review->photos()->delete();
    }
}
