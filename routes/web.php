<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public ───────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ── Admin Auth (akan diisi di Phase 1) ───────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Admin/Login');
    })->name('login');
});

// ── Admin Protected (akan diisi di Phase 1) ──────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
});
