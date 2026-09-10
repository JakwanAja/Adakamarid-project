<?php

use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\KosController as AdminKosController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Guest\AuthController as GuestAuthController;
use App\Http\Controllers\Guest\HomeController;
use App\Http\Controllers\Guest\KosController as GuestKosController;
use App\Http\Controllers\Guest\ReviewController as GuestReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public ────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/kos', [GuestKosController::class, 'index'])->name('kos.index');
Route::get('/kos/{kos:slug}', [GuestKosController::class, 'show'])->name('kos.show');

// ── Guest Auth ────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [GuestAuthController::class, 'showLogin'])->name('guest.login');
    Route::post('/login', [GuestAuthController::class, 'login'])->name('guest.login.post');
    Route::get('/register', [GuestAuthController::class, 'showRegister'])->name('guest.register');
    Route::post('/register', [GuestAuthController::class, 'register'])->name('guest.register.post');
    Route::get('/auth/google', [GuestAuthController::class, 'redirectToGoogle'])->name('guest.auth.google');
    Route::get('/auth/google/callback', [GuestAuthController::class, 'handleGoogleCallback'])->name('guest.auth.google.callback');
});

Route::post('/logout', [GuestAuthController::class, 'logout'])
    ->name('guest.logout')
    ->middleware('auth');

// ── Guest Protected ───────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/kos/{kos:slug}/reviews', [GuestReviewController::class, 'store'])->name('reviews.store');
    Route::put('/kos/{kos:slug}/reviews/{review}', [GuestReviewController::class, 'update'])->name('reviews.update');
});

// ── Admin Protected ───────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'stats'          => ['active_kos' => 0, 'plus_kos' => 0, 'total_reviews' => 0],
            'recent_kos'     => [],
            'recent_reviews' => [],
        ]);
    })->name('dashboard');

    // Fasilitas
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::post('/facilities', [FacilityController::class, 'store'])->name('facilities.store');
    Route::put('/facilities/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');

    // Kos
    Route::get('/kos', [AdminKosController::class, 'index'])->name('kos.index');
    Route::get('/kos/create', [AdminKosController::class, 'create'])->name('kos.create');
    Route::post('/kos', [AdminKosController::class, 'store'])->name('kos.store');
    Route::get('/kos/{kos}/edit', [AdminKosController::class, 'edit'])->name('kos.edit');
    Route::put('/kos/{kos}', [AdminKosController::class, 'update'])->name('kos.update');
    Route::delete('/kos/{kos}', [AdminKosController::class, 'destroy'])->name('kos.destroy');
    Route::patch('/kos/{kos}/toggle-active', [AdminKosController::class, 'toggleActive'])->name('kos.toggleActive');
    Route::patch('/kos/{kos}/toggle-plus', [AdminKosController::class, 'togglePlus'])->name('kos.togglePlus');
    Route::post('/kos/{kos}/photos', [AdminKosController::class, 'storePhoto'])->name('kos.photos.store');
    Route::patch('/kos/{kos}/photos/{photo}/primary', [AdminKosController::class, 'setPrimaryPhoto'])->name('kos.photos.setPrimary');
    Route::delete('/kos/{kos}/photos/{photo}', [AdminKosController::class, 'destroyPhoto'])->name('kos.photos.destroy');
    Route::put('/kos/{kos}/prices', [AdminKosController::class, 'updatePrices'])->name('kos.prices.update');
    Route::put('/kos/{kos}/facilities', [AdminKosController::class, 'updateFacilities'])->name('kos.facilities.update');

    // Ulasan
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    // Users
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/admin', [AdminUserController::class, 'storeAdmin'])->name('users.storeAdmin');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('users.toggleActive');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
});
