<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingRequest;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'platform_name' => Setting::get('platform_name', 'AdaKamar.id'),
                'platform_logo' => Setting::get('platform_logo')
                    ? asset('storage/' . Setting::get('platform_logo'))
                    : null,
            ],
            'pages' => Page::orderBy('id')->get(['id', 'slug', 'title', 'is_active', 'updated_at']),
        ]);
    }

    public function update(UpdateSettingRequest $request)
    {
        // Update nama platform
        Setting::set('platform_name', $request->platform_name);

        // Upload logo baru jika ada
        if ($request->hasFile('logo')) {
            // Hapus logo lama
            $oldLogo = Setting::get('platform_logo');
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }

            $path = $request->file('logo')->store('logos', 'public');
            Setting::set('platform_logo', $path);
        }

        return back()->with('success', 'Pengaturan platform berhasil disimpan.');
    }
}
