<?php

namespace App\Services\Admin;

use App\Models\Kos;
use App\Models\KosPhoto;
use App\Repositories\FacilityRepository;
use App\Repositories\KosPhotoRepository;
use App\Repositories\KosPriceRepository;
use App\Repositories\KosRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class KosService
{
    public function __construct(
        private readonly KosRepository      $kosRepository,
        private readonly KosPhotoRepository $kosPhotoRepository,
        private readonly KosPriceRepository $kosPriceRepository,
        private readonly FacilityRepository $facilityRepository,
    ) {}

    /**
     * Buat kos baru lengkap dengan slug, fasilitas, dan harga.
     */
    public function store(array $data, array $facilityIds = [], array $prices = []): Kos
    {
        $data['slug'] = Kos::generateUniqueSlug($data['name']);

        $kos = $this->kosRepository->create($data);

        if (!empty($facilityIds)) {
            $kos->facilities()->sync($facilityIds);
        }

        if (!empty($prices)) {
            $this->kosPriceRepository->upsertForKos($kos, $prices);
        }

        return $kos;
    }

    /**
     * Perbarui data kos â€” regenerate slug jika nama berubah.
     */
    public function update(Kos $kos, array $data, array $facilityIds = [], array $prices = []): Kos
    {
        if (isset($data['name']) && $data['name'] !== $kos->name) {
            $data['slug'] = Kos::generateUniqueSlug($data['name'], $kos->id);
        }

        $this->kosRepository->update($kos, $data);

        if (!empty($facilityIds)) {
            $kos->facilities()->sync($facilityIds);
        }

        if (!empty($prices)) {
            $this->kosPriceRepository->upsertForKos($kos, $prices);
        }

        return $kos->fresh();
    }

    /**
     * Hapus kos beserta semua file fotonya dari storage.
     */
    public function delete(Kos $kos): void
    {
        // Hapus semua file foto dari storage sebelum delete record
        foreach ($kos->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $this->kosRepository->delete($kos);
    }

    /**
     * Toggle status aktif kos.
     */
    public function toggleActive(Kos $kos): Kos
    {
        $this->kosRepository->update($kos, ['is_active' => !$kos->is_active]);
        return $kos->fresh();
    }

    /**
     * Toggle label Plus kos.
     */
    public function togglePlus(Kos $kos): Kos
    {
        $this->kosRepository->update($kos, ['is_plus' => !$kos->is_plus]);
        return $kos->fresh();
    }

    /**
     * Upload foto kos baru.
     *
     * @throws \RuntimeException jika sudah mencapai batas 10 foto
     */
    public function uploadPhoto(Kos $kos, UploadedFile $file): KosPhoto
    {
        if ($this->kosPhotoRepository->countForKos($kos) >= 10) {
            throw new \RuntimeException('Maksimal 10 foto per kos.');
        }

        $path = $file->store('kos-photos', 'public');
        $sortOrder = $this->kosPhotoRepository->getNextSortOrder($kos);

        $photo = $this->kosPhotoRepository->store($kos, $path, $sortOrder);

        // Jika ini foto pertama, set sebagai foto utama otomatis
        if ($this->kosPhotoRepository->countForKos($kos) === 1) {
            $this->kosPhotoRepository->setPrimary($photo);
        }

        return $photo;
    }

    /**
     * Set foto sebagai foto utama kos.
     */
    public function setPrimaryPhoto(KosPhoto $photo): void
    {
        $this->kosPhotoRepository->setPrimary($photo);
    }

    /**
     * Hapus foto kos dari storage dan database.
     *
     * @throws \RuntimeException jika file gagal dihapus dari storage
     */
    public function deletePhoto(KosPhoto $photo): void
    {
        if (Storage::disk('public')->exists($photo->path)) {
            $deleted = Storage::disk('public')->delete($photo->path);
            if (!$deleted) {
                throw new \RuntimeException('Foto gagal dihapus, coba lagi.');
            }
        }

        $this->kosPhotoRepository->delete($photo);
    }

    /**
     * Sinkronisasi fasilitas kos.
     */
    public function updateFacilities(Kos $kos, array $facilityIds): void
    {
        $kos->facilities()->sync($facilityIds);
    }

    /**
     * Perbarui harga sewa kos.
     */
    public function updatePrices(Kos $kos, array $prices): void
    {
        $this->kosPriceRepository->upsertForKos($kos, $prices);
    }

    /**
     * Toggle status promosi kos (Rekomendasi AdaKamar).
     */
    public function togglePromoted(Kos $kos): Kos
    {
        $this->kosRepository->update($kos, ['is_promoted' => !$kos->is_promoted]);
        return $kos->fresh();
    }
}