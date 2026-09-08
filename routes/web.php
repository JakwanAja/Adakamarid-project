<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\FacilityController;
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
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'active_kos'    => 0,
                'plus_kos'      => 0,
                'total_reviews' => 0,
            ],
            'recent_kos'     => [],
            'recent_reviews' => [],
        ]);
    })->name('dashboard');

    // ── Master Fasilitas ──────────────────────────────────────
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::post('/facilities', [FacilityController::class, 'store'])->name('facilities.store');
    Route::put('/facilities/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');
});
