<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFacilityRequest;
use App\Http\Requests\Admin\UpdateFacilityRequest;
use App\Models\Facility;
use App\Repositories\FacilityRepository;
use App\Services\Admin\FacilityService;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct(
        private readonly FacilityService    $facilityService,
        private readonly FacilityRepository $facilityRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Facilities/Index', [
            'facilities' => $this->facilityRepository->allGroupedByCategory(),
        ]);
    }

    public function store(StoreFacilityRequest $request)
    {
        try {
            $this->facilityService->store($request->validated());

            return back()->with('success', 'Fasilitas berhasil ditambahkan.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateFacilityRequest $request, Facility $facility)
    {
        try {
            $this->facilityService->update($facility, $request->validated());

            return back()->with('success', 'Fasilitas berhasil diperbarui.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Facility $facility)
    {
        $this->facilityService->delete($facility);

        return back()->with('success', 'Fasilitas berhasil dihapus.');
    }
}
