<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\KosController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Homepage ──────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ── Admin Auth ────────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// ── Admin Protected ───────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'stats'          => ['active_kos' => 0, 'plus_kos' => 0, 'total_reviews' => 0],
            'recent_kos'     => [],
            'recent_reviews' => [],
        ]);
    })->name('dashboard');

    // ── Master Fasilitas ──────────────────────────────────────
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::post('/facilities', [FacilityController::class, 'store'])->name('facilities.store');
    Route::put('/facilities/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');

    // ── Manajemen Kos ─────────────────────────────────────────
    Route::get('/kos', [KosController::class, 'index'])->name('kos.index');
    Route::get('/kos/create', [KosController::class, 'create'])->name('kos.create');
    Route::post('/kos', [KosController::class, 'store'])->name('kos.store');
    Route::get('/kos/{kos}/edit', [KosController::class, 'edit'])->name('kos.edit');
    Route::put('/kos/{kos}', [KosController::class, 'update'])->name('kos.update');
    Route::delete('/kos/{kos}', [KosController::class, 'destroy'])->name('kos.destroy');
    Route::patch('/kos/{kos}/toggle-active', [KosController::class, 'toggleActive'])->name('kos.toggleActive');
    Route::patch('/kos/{kos}/toggle-plus', [KosController::class, 'togglePlus'])->name('kos.togglePlus');

    // Foto Kos
    Route::post('/kos/{kos}/photos', [KosController::class, 'storePhoto'])->name('kos.photos.store');
    Route::patch('/kos/{kos}/photos/{photo}/primary', [KosController::class, 'setPrimaryPhoto'])->name('kos.photos.setPrimary');
    Route::delete('/kos/{kos}/photos/{photo}', [KosController::class, 'destroyPhoto'])->name('kos.photos.destroy');

    // Harga Sewa
    Route::put('/kos/{kos}/prices', [KosController::class, 'updatePrices'])->name('kos.prices.update');

    // Fasilitas Kos
    Route::put('/kos/{kos}/facilities', [KosController::class, 'updateFacilities'])->name('kos.facilities.update');
});
