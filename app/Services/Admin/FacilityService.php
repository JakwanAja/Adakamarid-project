<?php

namespace App\Services\Admin;

use App\Models\Facility;
use App\Repositories\FacilityRepository;

class FacilityService
{
    public function __construct(
        private readonly FacilityRepository $facilityRepository,
    ) {}

    /**
     * Simpan fasilitas baru.
     *
     * @throws \InvalidArgumentException jika nama sudah ada
     */
    public function store(array $data): Facility
    {
        if ($this->facilityRepository->existsByName($data['name'])) {
            throw new \InvalidArgumentException('Nama fasilitas sudah ada.');
        }

        return $this->facilityRepository->create($data);
    }

    /**
     * Perbarui fasilitas yang sudah ada.
     *
     * @throws \InvalidArgumentException jika nama sudah digunakan fasilitas lain
     */
    public function update(Facility $facility, array $data): Facility
    {
        if ($this->facilityRepository->existsByName($data['name'], $facility->id)) {
            throw new \InvalidArgumentException('Nama fasilitas sudah ada.');
        }

        $this->facilityRepository->update($facility, $data);
        $facility->refresh();

        return $facility;
    }

    /**
     * Hapus fasilitas (cascade ke kos_facilities sudah ditangani FK database).
     */
    public function delete(Facility $facility): void
    {
        $this->facilityRepository->delete($facility);
    }
}
