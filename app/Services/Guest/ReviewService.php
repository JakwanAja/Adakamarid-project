<?php

namespace App\Services\Guest;

use App\Models\Kos;
use App\Models\Review;
use App\Models\User;
use App\Repositories\KosRepository;
use App\Repositories\ReviewRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ReviewService
{
    public function __construct(
        private readonly ReviewRepository $reviewRepository,
        private readonly KosRepository    $kosRepository,
    ) {}

    /**
     * Simpan ulasan baru (1 per guest per kos).
     *
     * @param UploadedFile[] $photos
     * @throws \RuntimeException jika sudah pernah review kos ini
     */
    public function store(Kos $kos, User $user, array $data, array $photos = []): Review
    {
        // Guard: pastikan belum pernah review
        if ($this->reviewRepository->findByUserAndKos($user, $kos)) {
            throw new \RuntimeException('Kamu sudah memberikan ulasan untuk kos ini.');
        }

        $review = $this->reviewRepository->create([
            'kos_id'     => $kos->id,
            'user_id'    => $user->id,
            'rating'     => $data['rating'],
            'comment'    => $data['comment'] ?? null,
            'created_at' => now(),
        ]);

        $this->uploadPhotos($review, $photos);
        $this->kosRepository->updateRating($kos);

        return $review;
    }

    /**
     * Update ulasan yang sudah ada milik guest.
     * Foto lama dihapus dan diganti dengan foto baru (jika ada foto baru yang dikirim).
     *
     * @param UploadedFile[] $photos
     * @throws \RuntimeException jika review bukan milik user ini
     */
    public function update(Review $review, User $user, array $data, array $photos = []): Review
    {
        // Guard: pastikan review milik user ini
        if ($review->user_id !== $user->id) {
            throw new \RuntimeException('Kamu tidak berhak mengubah ulasan ini.');
        }

        $this->reviewRepository->update($review, [
            'rating'  => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        // Jika ada foto baru yang dikirim, hapus foto lama dan upload yang baru
        if (!empty($photos)) {
            $this->deletePhotos($review);
            $this->uploadPhotos($review, $photos);
        }

        $review->load('kos');
        $this->kosRepository->updateRating($review->kos);

        return $review->fresh(['photos']);
    }

    /**
     * Hapus ulasan — hanya admin yang boleh memanggil ini.
     */
    public function delete(Review $review): void
    {
        $kos = $review->kos;

        $this->deletePhotos($review);
        $this->reviewRepository->delete($review);

        if ($kos) {
            $this->kosRepository->updateRating($kos);
        }
    }

    // ── Private helpers ──────────────────────────────────────

    private function uploadPhotos(Review $review, array $photos): void
    {
        foreach ($photos as $photo) {
            if ($photo instanceof UploadedFile) {
                $path = $photo->store('review-photos', 'public');
                $this->reviewRepository->storePhoto($review, $path);
            }
        }
    }

    private function deletePhotos(Review $review): void
    {
        foreach ($review->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }
        $this->reviewRepository->deletePhotos($review);
    }
}
