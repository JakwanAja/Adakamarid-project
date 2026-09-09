<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKosPhotoRequest;
use App\Http\Requests\Admin\StoreKosPriceRequest;
use App\Http\Requests\Admin\StoreKosRequest;
use App\Http\Requests\Admin\UpdateKosRequest;
use App\Models\Kos;
use App\Models\KosPhoto;
use App\Repositories\FacilityRepository;
use App\Repositories\KosRepository;
use App\Services\Admin\KosService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KosController extends Controller
{
    const DISTRICTS = [
        'Danurejan', 'Gedongtengen', 'Gondokusuman', 'Gondomanan',
        'Jetis', 'Kotagede', 'Kraton', 'Mantrijeron', 'Mergangsan',
        'Ngampilan', 'Pakualaman', 'Tegalrejo', 'Umbulharjo', 'Wirobrajan',
        // Sleman
        'Depok', 'Mlati', 'Gamping', 'Ngaglik', 'Kalasan',
        'Berbah', 'Prambanan', 'Sewon', 'Kasihan', 'Banguntapan',
        // Bantul
        'Bantul', 'Imogiri', 'Pajangan',
    ];

    public function __construct(
        private readonly KosService         $kosService,
        private readonly KosRepository      $kosRepository,
        private readonly FacilityRepository $facilityRepository,
    ) {}

    public function index()
    {
        return Inertia::render('Admin/Kos/Index', [
            'kosList' => $this->kosRepository->getAdminList(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kos/Create', [
            'facilities' => $this->facilityRepository->allGroupedByCategory(),
            'districts'  => self::DISTRICTS,
        ]);
    }

    public function store(StoreKosRequest $request)
    {
        $data        = $request->validated();
        $facilityIds = $request->input('facility_ids', []);
        $prices      = $request->input('prices', []);

        // Cast is_active di setiap price dari string/int ke boolean
        $prices = array_map(function ($price) {
            $price['is_active'] = filter_var($price['is_active'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $price['price']     = isset($price['price']) ? (float) $price['price'] : 0;
            return $price;
        }, $prices);

        $kos = $this->kosService->store($data, $facilityIds, $prices);

        // Redirect ke halaman edit dengan flash message informatif
        return redirect()->route('admin.kos.edit', $kos->slug)
            ->with('success', 'Kos berhasil disimpan! Silakan tambahkan foto, sesuaikan harga, dan pilih fasilitas kos.');
    }

    public function edit(Kos $kos)
    {
        $kos->load(['photos', 'prices', 'facilities']);

        return Inertia::render('Admin/Kos/Edit', [
            'kos'           => $kos,
            'photos'        => $kos->photos,
            'prices'        => $kos->prices,
            'facilities'    => $kos->facilities->pluck('id'),
            'allFacilities' => $this->facilityRepository->allGroupedByCategory(),
            'districts'     => self::DISTRICTS,
        ]);
    }

    public function update(UpdateKosRequest $request, Kos $kos)
    {
        $this->kosService->update($kos, $request->validated());

        return back()->with('success', 'Data kos berhasil diperbarui.');
    }

    public function destroy(Kos $kos)
    {
        $this->kosService->delete($kos);

        return redirect()->route('admin.kos.index')
            ->with('success', 'Kos berhasil dihapus.');
    }

    public function toggleActive(Kos $kos)
    {
        $this->kosService->toggleActive($kos);

        return back()->with('success', 'Status kos berhasil diubah.');
    }

    public function togglePlus(Kos $kos)
    {
        $this->kosService->togglePlus($kos);

        return back()->with('success', 'Status Plus kos berhasil diubah.');
    }

    public function storePhoto(StoreKosPhotoRequest $request, Kos $kos)
    {
        try {
            $this->kosService->uploadPhoto($kos, $request->file('photo'));
            return back()->with('success', 'Foto berhasil diunggah.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function setPrimaryPhoto(Kos $kos, KosPhoto $photo)
    {
        $this->kosService->setPrimaryPhoto($photo);

        return back()->with('success', 'Foto utama berhasil diatur.');
    }

    public function destroyPhoto(Kos $kos, KosPhoto $photo)
    {
        try {
            $this->kosService->deletePhoto($photo);
            return back()->with('success', 'Foto berhasil dihapus.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updatePrices(StoreKosPriceRequest $request, Kos $kos)
    {
        $prices = $request->validated()['prices'];

        // Cast is_active dari berbagai format (bool, int, string) ke boolean
        $prices = array_map(function ($price) {
            $price['is_active'] = filter_var($price['is_active'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $price['price']     = isset($price['price']) && $price['price'] !== '' ? (float) $price['price'] : 0;
            return $price;
        }, $prices);

        $this->kosService->updatePrices($kos, $prices);

        return back()->with('success', 'Harga sewa berhasil diperbarui.');
    }

    public function updateFacilities(Request $request, Kos $kos)
    {
        $facilityIds = $request->input('facility_ids', []);
        $this->kosService->updateFacilities($kos, $facilityIds);

        return back()->with('success', 'Fasilitas kos berhasil diperbarui.');
    }
}
