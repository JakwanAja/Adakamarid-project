<?php

namespace App\Services\Guest;

use App\Models\Kos;
use App\Repositories\KosRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class KosService
{
    public function __construct(
        private readonly KosRepository $kosRepository,
    ) {}

    public function getHomepageListing(): Collection
    {
        return $this->kosRepository->getActiveForHomepage();
    }

    public function getPromotedKos(int $limit = 8): Collection
    {
        return $this->kosRepository->getPromoted($limit);
    }


    public function getFilteredListing(array $filters): LengthAwarePaginator
    {
        return $this->kosRepository->all($filters);
    }

    public function getDetailBySlug(string $slug): Kos
    {
        $kos = $this->kosRepository->findBySlug($slug);

        if (!$kos || !$kos->is_active) {
            throw new NotFoundHttpException('Kos tidak ditemukan.');
        }

        return $kos;
    }

    public function getSimilarKos(Kos $kos): Collection
    {
        return $this->kosRepository->getSimilarByDistrict($kos, 4);
    }

    public function incrementViews(Kos $kos): void
    {
        $this->kosRepository->incrementViews($kos);
    }
}