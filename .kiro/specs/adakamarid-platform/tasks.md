# Implementation Plan: Adakamar.id Platform

## Overview

Rencana implementasi ini mencakup **Phase 2–10** dari platform Adakamar.id. Phase 0 (Foundation) dan Phase 1 (Autentikasi Admin) sudah selesai. Setiap phase diimplementasikan dengan pola arsitektur **Controller → Service → Repository** menggunakan stack Laravel 12 + React 19 + Inertia.js. Database dan semua model sudah tersedia — tidak perlu membuat migrasi baru.

---

## Tasks

---

### Phase 2: Master Fasilitas Admin

- [ ] 1. Buat Repository dan Service layer untuk Fasilitas
  - [ ] 1.1 Implementasi `FacilityRepository` (concrete class)
    - Buat `app/Repositories/FacilityRepository.php` yang mengimplementasikan method: `allGroupedByCategory()`, `findById()`, `create()`, `update()`, `delete()`, `existsByName()`
    - `allGroupedByCategory()` mengembalikan array `['kamar'=>[...],'bersama'=>[...],'sekitar'=>[...]]`
    - `existsByName()` menerima parameter opsional `$excludeId` untuk validasi edit
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

  - [ ] 1.2 Implementasi `FacilityService`
    - Buat `app/Services/Admin/FacilityService.php`
    - Method `store(array $data): Facility` — cek nama unik via `existsByName()`, lalu panggil `FacilityRepository@create()`
    - Method `update(Facility $facility, array $data): Facility` — cek nama unik (exclude id sendiri), lalu `FacilityRepository@update()`
    - Method `delete(Facility $facility): void` — panggil `FacilityRepository@delete()`
    - Lempar `\InvalidArgumentException` jika nama duplikat
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [ ]* 1.3 Tulis property test untuk uniqueness constraint fasilitas
    - **Property 15: Nama Fasilitas Harus Unik di Master Fasilitas**
    - Buat `tests/Feature/Properties/FacilityNameUniquePropertyTest.php`
    - For any existing facility name, upaya membuat fasilitas dengan nama sama (case-insensitive) harus ditolak
    - Tag: `// Feature: adakamarid-platform, Property 15`
    - **Validates: Requirements 10.5**

- [ ] 2. Buat Controller, Request, Route, dan Halaman untuk Master Fasilitas
  - [ ] 2.1 Buat Form Requests untuk Fasilitas
    - Buat `app/Http/Requests/Admin/StoreFacilityRequest.php`: validasi `name` (required, string, max:100), `category` (required, in:kamar,bersama,sekitar)
    - Buat `app/Http/Requests/Admin/UpdateFacilityRequest.php`: validasi sama, `sometimes` pada rules
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 2.2 Implementasi `FacilityController`
    - Buat `app/Http/Controllers/Admin/FacilityController.php`
    - Method `index()`: panggil `FacilityService` lewat `FacilityRepository@allGroupedByCategory()`, return `Inertia::render('Admin/Facilities/Index', ['facilities' => ...])`
    - Method `store(StoreFacilityRequest $request)`: panggil `FacilityService@store()`, redirect back dengan flash `success`
    - Method `update(UpdateFacilityRequest $request, Facility $facility)`: panggil `FacilityService@update()`, redirect back dengan flash `success`
    - Method `destroy(Facility $facility)`: panggil `FacilityService@delete()`, redirect back dengan flash `success`
    - Tangkap `\InvalidArgumentException` dan redirect back dengan flash `error`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 2.3 Daftarkan routes Fasilitas di `web.php`
    - Tambahkan di dalam grup `admin` protected: `GET /admin/facilities`, `POST /admin/facilities`, `PUT /admin/facilities/{facility}`, `DELETE /admin/facilities/{facility}`
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 2.4 Buat halaman `Admin/Facilities/Index.jsx`
    - Tampilkan tabel fasilitas dikelompokkan per kategori (3 section/accordion menggunakan Flowbite)
    - Setiap section memiliki inline form tambah fasilitas (nama + select kategori) di bagian bawah tabel
    - Setiap baris tabel mendukung edit inline (klik ikon edit → row berubah menjadi input)
    - Setiap baris memiliki tombol hapus yang membuka `<ConfirmDeleteDialog>`
    - Buat komponen `resources/js/Components/Admin/ConfirmDeleteDialog.jsx` menggunakan shadcn/ui `<Dialog>`
    - Gunakan `useForm` dari Inertia untuk operasi store dan update
    - Tampilkan flash message dari prop `flash` menggunakan komponen `<FlashMessage>`
    - Buat komponen `resources/js/Components/Shared/FlashMessage.jsx`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 3. Checkpoint Phase 2 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 3: Manajemen Kos Admin

- [ ] 4. Buat Repository dan Service layer untuk Kos
  - [ ] 4.1 Implementasi `KosRepository`
    - Buat `app/Repositories/KosRepository.php`
    - Method `all(array $filters)`: query dengan filter search (nama/alamat LIKE), type, district, paginated 15 per page
    - Method `findBySlug()`, `findById()`, `create()`, `update()`, `delete()`
    - Method `getActiveForHomepage()`: `is_active=1`, `orderBy('is_plus','desc')->orderBy('created_at','desc')->limit(8)`
    - Method `getSimilarByDistrict(Kos $kos, int $limit)`: aktif, district sama, exclude kos saat ini, `inRandomOrder()`
    - Method `getAdminList()`: semua kos dengan `orderBy('created_at','desc')`
    - Method `incrementViews(Kos $kos)`: `increment('views_count')`
    - Method `updateRating(Kos $kos)`: panggil `$kos->recalculateRating()`
    - _Requirements: 8.1, 8.2, 8.3, 8.11_

  - [ ] 4.2 Implementasi `KosPhotoRepository`
    - Buat `app/Repositories/KosPhotoRepository.php`
    - Method `store()`, `setPrimary()`, `delete()`, `getNextSortOrder()`, `countForKos()`
    - `setPrimary()`: unset semua foto `is_primary = 0` milik kos, lalu set foto target `is_primary = 1` dalam satu transaksi DB
    - _Requirements: 8.4, 8.5, 8.6_

  - [ ] 4.3 Implementasi `KosPriceRepository`
    - Buat `app/Repositories/KosPriceRepository.php`
    - Method `upsertForKos(Kos $kos, array $prices)`: gunakan `updateOrCreate` untuk setiap tipe (harian, bulanan, tahunan)
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 4.4 Implementasi `Admin\KosService`
    - Buat `app/Services/Admin/KosService.php`
    - Method `store(array $data, array $facilityIds, array $prices): Kos` — generate slug unik, buat kos, sync facilities, upsert prices
    - Method `update(Kos $kos, array $data, array $facilityIds, array $prices): Kos` — update data, regenerate slug jika nama berubah
    - Method `delete(Kos $kos): void` — hapus semua file foto dari Storage, hapus record
    - Method `toggleActive(Kos $kos)`, `togglePlus(Kos $kos)`
    - Method `uploadPhoto(Kos $kos, UploadedFile $file): KosPhoto` — validasi max 10 foto, simpan ke `storage/app/public/kos-photos/`
    - Method `setPrimaryPhoto(KosPhoto $photo)`, `deletePhoto(KosPhoto $photo)`
    - Method `updateFacilities(Kos $kos, array $facilityIds)`: `$kos->facilities()->sync($facilityIds)`
    - Method `updatePrices(Kos $kos, array $prices)`: delegasi ke `KosPriceRepository@upsertForKos()`
    - Lempar `\RuntimeException` jika hapus file gagal (sesuai pola design.md)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 4.5 Tulis property test untuk keunikan slug kos
    - **Property 7: Slug Kos Selalu Unik di Seluruh Dataset**
    - Buat `tests/Feature/Properties/KosSlugUniquePropertyTest.php`
    - For any list of kos names (termasuk nama identik), semua slug yang dihasilkan harus unik
    - Tag: `// Feature: adakamarid-platform, Property 7`
    - **Validates: Requirements 8.2**

  - [ ]* 4.6 Tulis property test untuk single primary photo invariant
    - **Property 8: Setiap Kos Memiliki Paling Banyak Satu Foto Utama**
    - Buat `tests/Feature/Properties/KosPrimaryPhotoPropertyTest.php`
    - For any sequence of `setPrimary` operations, jumlah foto dengan `is_primary=1` tidak pernah melebihi 1
    - Tag: `// Feature: adakamarid-platform, Property 8`
    - **Validates: Requirements 8.5**

  - [ ]* 4.7 Tulis property test untuk validasi upload foto
    - **Property 9: Foto Kos Ditolak Jika Ukuran > 2MB atau Format Tidak Valid**
    - Buat `tests/Feature/Properties/KosPhotoValidationPropertyTest.php`
    - For any file > 2MB atau MIME bukan jpeg/png/webp, upload harus ditolak tanpa menyimpan file
    - Tag: `// Feature: adakamarid-platform, Property 9`
    - **Validates: Requirements 8.4**

- [ ] 5. Buat Form Requests, Controller, Routes, dan Halaman Kos Admin
  - [ ] 5.1 Buat Form Requests untuk Kos
    - Buat `app/Http/Requests/Admin/StoreKosRequest.php`: validasi semua field wajib (name max:150, type enum, district, address, contact_name, contact_whatsapp regex digits 10-13)
    - Buat `app/Http/Requests/Admin/UpdateKosRequest.php`: validasi sama dengan `sometimes`
    - Buat `app/Http/Requests/Admin/StoreKosPhotoRequest.php`: validasi `photo` (required, image, mimes:jpeg,png,webp, max:2048)
    - Buat `app/Http/Requests/Admin/StoreKosPriceRequest.php`: validasi array `prices` dengan setiap item memiliki type, price (numeric, min:1, max:999999999), is_active
    - _Requirements: 8.1, 8.4, 9.4_

  - [ ] 5.2 Implementasi `KosController` (Admin)
    - Buat `app/Http/Controllers/Admin/KosController.php`
    - Method `index()`: return `Admin/Kos/Index` dengan props `{ kos: [...] }` dari `KosRepository@getAdminList()`
    - Method `create()`: return `Admin/Kos/Create` dengan props `{ facilities: allGroupedByCategory, districts: [...] }`
    - Method `store(StoreKosRequest $request)`: panggil `KosService@store()`, redirect ke `admin.kos.index`
    - Method `edit(Kos $kos)`: return `Admin/Kos/Edit` dengan props `{ kos, photos, prices, facilities, allFacilities, districts }`
    - Method `update(UpdateKosRequest $request, Kos $kos)`: panggil `KosService@update()`, redirect back
    - Method `destroy(Kos $kos)`: panggil `KosService@delete()`, redirect ke index
    - Method `toggleActive(Kos $kos)`, `togglePlus(Kos $kos)`: panggil KosService, redirect back dengan `preserveScroll`
    - Method `storePhoto(StoreKosPhotoRequest $request, Kos $kos)`: panggil `KosService@uploadPhoto()`
    - Method `setPrimaryPhoto(Kos $kos, KosPhoto $photo)`: panggil `KosService@setPrimaryPhoto()`
    - Method `destroyPhoto(Kos $kos, KosPhoto $photo)`: panggil `KosService@deletePhoto()`, tangkap RuntimeException
    - Method `updatePrices(StoreKosPriceRequest $request, Kos $kos)`: panggil `KosService@updatePrices()`
    - Method `updateFacilities(Request $request, Kos $kos)`: panggil `KosService@updateFacilities()`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11_

  - [ ] 5.3 Daftarkan semua routes Kos Admin di `web.php`
    - Tambahkan semua routes sesuai desain routing di design.md: Kos CRUD, foto, harga, fasilitas
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 8.6, 8.8, 8.9, 8.10, 9.1, 9.2, 9.3_

  - [ ] 5.4 Buat halaman `Admin/Kos/Index.jsx`
    - Tabel semua kos menggunakan Flowbite table classes
    - Kolom: nama, tipe, kecamatan, status aktif (toggle Flowbite), status Plus (toggle Flowbite), tanggal dibuat, aksi
    - Tombol aksi: Edit (link ke halaman edit), Hapus (buka ConfirmDeleteDialog) menggunakan shadcn/ui DropdownMenu
    - Toggle aktif/plus via `router.patch` dengan `preserveScroll: true`
    - Tombol "Tambah Kos" link ke `admin.kos.create`
    - _Requirements: 8.8, 8.9, 8.10, 8.11_

  - [ ] 5.5 Buat halaman `Admin/Kos/Create.jsx` dan komponen `KosForm`
    - Buat `resources/js/Components/Admin/KosForm.jsx` (shared antara Create dan Edit)
    - Field: nama, deskripsi, peraturan, tipe (select), kecamatan (select dropdown dari konstanta), alamat, latitude, longitude, nama kontak, nomor WhatsApp, has_ac/has_wifi/has_private_bathroom (checkbox)
    - Gunakan `useForm` dari Inertia, submit ke `admin.kos.store`
    - _Requirements: 8.1_

  - [ ] 5.6 Buat halaman `Admin/Kos/Edit.jsx` dengan Tabs
    - Gunakan shadcn/ui `<Tabs>` dengan 4 tab: Info Dasar, Foto, Harga Sewa, Fasilitas
    - **Tab Info Dasar**: render `<KosForm>` dengan data kos yang ada, submit ke `admin.kos.update`
    - **Tab Foto**: render komponen `<PhotoManager>`
    - **Tab Harga Sewa**: render komponen `<PriceManager>`
    - **Tab Fasilitas**: render komponen `<FacilitySelector>`
    - _Requirements: 8.3, 8.4, 8.5, 8.6, 9.1, 9.2, 9.3, 11.1, 11.2, 11.3_

  - [ ] 5.7 Buat komponen `PhotoManager.jsx`
    - Buat `resources/js/Components/Admin/PhotoManager.jsx`
    - Tampilkan grid foto kos yang sudah ada dengan tombol "Set Utama" dan "Hapus" per foto
    - Foto utama ditandai dengan badge/border berbeda
    - Form upload foto baru (file input, tombol upload)
    - Operasi upload via `useForm().post(route('admin.kos.photos.store', kos.id))` dengan `forceFormData: true`
    - Operasi set primary via `router.patch(route('admin.kos.photos.setPrimary', ...))`
    - Operasi hapus via `router.delete(route('admin.kos.photos.destroy', ...))` dengan konfirmasi
    - Buat komponen `resources/js/Components/Shared/ImageWithFallback.jsx`
    - _Requirements: 8.4, 8.5, 8.6, 8.7_

  - [ ] 5.8 Buat komponen `PriceManager.jsx`
    - Buat `resources/js/Components/Admin/PriceManager.jsx`
    - Tampilkan 3 baris (harian, bulanan, tahunan), masing-masing dengan toggle aktif dan input harga
    - Toggle diimplementasikan dengan Flowbite toggle switch
    - Submit semua harga sekaligus via `router.put(route('admin.kos.prices.update', kos.id))`
    - Validasi client-side: harga > 0 jika tipe aktif
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 5.9 Buat komponen `FacilitySelector.jsx`
    - Buat `resources/js/Components/Admin/FacilitySelector.jsx`
    - Tampilkan fasilitas dikelompokkan per kategori (kamar/bersama/sekitar) sebagai checkbox group
    - State lokal checkbox, submit semua id yang dicentang via `router.put(route('admin.kos.facilities.update', kos.id))`
    - Pre-check fasilitas yang sudah terkait dengan kos saat edit
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 6. Checkpoint Phase 3 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 4: Landing Page + Halaman Listing Publik (Guest)

- [ ] 7. Buat Repository dan Service layer untuk Guest
  - [ ] 7.1 Implementasi `SettingRepository`
    - Buat `app/Repositories/SettingRepository.php`
    - Method `get(string $key, mixed $default)`, `set(string $key, mixed $value)`, `getMultiple(array $keys)`
    - Delegasi ke `Setting::get()` dan `Setting::set()` yang sudah ada di model
    - _Requirements: 14.6_

  - [ ] 7.2 Implementasi `Guest\KosService`
    - Buat `app/Services/Guest/KosService.php`
    - Method `getHomepageListing()`: panggil `KosRepository@getActiveForHomepage()`
    - Method `getFilteredListing(array $filters)`: panggil `KosRepository@all($filters)` (filter: search, type, district, price_type, price_min, price_max)
    - Method `getDetailBySlug(string $slug)`: panggil `findBySlug()`, throw `\Symfony\Component\HttpKernel\Exception\NotFoundHttpException` jika null atau `is_active=false`
    - Method `getSimilarKos(Kos $kos)`: panggil `KosRepository@getSimilarByDistrict($kos, 4)`
    - Method `incrementViews(Kos $kos)`: panggil `KosRepository@incrementViews($kos)`
    - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.12, 5.13_

  - [ ]* 7.3 Tulis property test untuk homepage listing ordering
    - **Property 4: Homepage Listing Selalu Aktif, Terurut Plus-First, Maks 8**
    - Buat `tests/Feature/Properties/HomepageListingPropertyTest.php`
    - For any dataset kos dengan kombinasi `is_active` dan `is_plus` acak: hanya aktif, plus di depan, max 8
    - Tag: `// Feature: adakamarid-platform, Property 4`
    - **Validates: Requirements 3.2**

  - [ ]* 7.4 Tulis property test untuk filter konjungtif listing
    - **Property 5: Semua Filter Listing Bersifat Konjungtif (AND)**
    - Buat `tests/Feature/Properties/ListingFilterConjunctivePropertyTest.php`
    - For any kombinasi filter aktif, setiap kos di hasil harus memenuhi SEMUA filter secara bersamaan
    - Tag: `// Feature: adakamarid-platform, Property 5`
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6**

  - [ ]* 7.5 Tulis property test untuk validasi price_min ≤ price_max
    - **Property 6: Validasi Harga Min Tidak Boleh Melebihi Harga Max**
    - Buat `tests/Feature/Properties/PriceFilterValidationPropertyTest.php`
    - For any (price_min, price_max) di mana price_min > price_max, query harus ditolak dengan pesan validasi
    - Tag: `// Feature: adakamarid-platform, Property 6`
    - **Validates: Requirements 4.8**

- [ ] 8. Buat Controllers, Routes, dan Halaman untuk Publik (Landing + Listing)
  - [ ] 8.1 Buat `Guest\HomeController` dan `Guest\KosController` (index)
    - Buat `app/Http/Controllers/Guest/HomeController.php`
    - Method `index()`: ambil `featuredKos` dari `Guest\KosService@getHomepageListing()` dan daftar kecamatan, return `Inertia::render('Guest/Home', [...])`
    - Buat `app/Http/Controllers/Guest/KosController.php`
    - Method `index(Request $request)`: ambil filters dari query params, validasi price_min ≤ price_max (lempar ValidationException jika tidak valid), panggil `Guest\KosService@getFilteredListing($filters)`, return `Inertia::render('Guest/Kos/Index', [...])`
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ] 8.2 Daftarkan routes publik di `web.php` dan perbarui route homepage
    - Ganti closure homepage dengan `Guest\HomeController@index`
    - Tambahkan `GET /kos` → `Guest\KosController@index` dengan nama `kos.index`
    - _Requirements: 3.1, 4.1_

  - [ ] 8.3 Buat halaman `Guest/Home.jsx`
    - Hero section: headline, deskripsi singkat, `<SearchBar>` (input teks, validasi tidak boleh kosong sebelum submit)
    - Quick filter chips: tipe sewa (harian/bulanan/tahunan) dan tipe kos (putra/putri/campur) — klik redirect ke `/kos?type=...` atau `/kos?price_type=...`
    - Grid 8 kos menggunakan komponen `<KosCard>`
    - Section keunggulan platform (minimal 3 poin)
    - Tautan "Lihat Semua Kos" ke `/kos`
    - Gunakan `GuestLayout`
    - Buat komponen `resources/js/Components/Guest/SearchBar.jsx`
    - Buat komponen `resources/js/Components/Guest/KosCard.jsx`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ] 8.4 Buat halaman `Guest/Kos/Index.jsx`
    - Layout dua kolom: sidebar filter kiri + grid listing kanan
    - Buat komponen `resources/js/Components/Guest/FilterPanel.jsx`: filter tipe sewa, kecamatan (dropdown), rentang harga (input min/max), tipe kos
    - Filter state disimpan di URL query params via `router.get(route('kos.index'), filters, { preserveState: true, replace: true })`
    - Tampilkan pesan "Tidak ada kos yang ditemukan..." jika kosong (_Requirement 4.9_)
    - Tampilkan pesan validasi jika price_min > price_max di sisi client sebelum submit (_Requirement 4.8_)
    - Grid kos menggunakan `<KosCard>` dengan paginasi
    - Buat komponen `resources/js/Components/Shared/Pagination.jsx`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

- [ ] 9. Checkpoint Phase 4 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 5: Halaman Detail Kos

- [ ] 10. Buat Controller dan Halaman Detail Kos
  - [ ] 10.1 Implementasi `Guest\KosController@show`
    - Tambahkan method `show(string $slug)` ke `Guest\KosController`
    - Eager load relasi: `photos` (orderBy sort_order), `activePrices`, `facilities`, `reviews.user`, `reviews.photos`
    - Panggil `Guest\KosService@getDetailBySlug($slug)` — otomatis 404 jika tidak ada / nonaktif
    - Panggil `Guest\KosService@incrementViews($kos)` setelah fetch data
    - Panggil `Guest\KosService@getSimilarKos($kos)` untuk rekomendasi
    - Return `Inertia::render('Guest/Kos/Show', ['kos' => $kos, 'similarKos' => $similarKos])`
    - Daftarkan route `GET /kos/{kos:slug}` → `Guest\KosController@show` dengan nama `kos.show`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14_

  - [ ]* 10.2 Tulis property test untuk 404 pada slug tidak valid / kos nonaktif
    - **Property 13: Slug Tidak Valid atau Kos Nonaktif Selalu Menghasilkan 404**
    - Buat `tests/Feature/Properties/KosDetailNotFoundPropertyTest.php`
    - For any slug tidak terdaftar atau kos dengan `is_active=0`, response harus HTTP 404
    - Tag: `// Feature: adakamarid-platform, Property 13`
    - **Validates: Requirements 5.2**

  - [ ]* 10.3 Tulis property test untuk urutan foto berdasarkan sort_order
    - **Property 14: Foto Kos Ditampilkan Sesuai Urutan sort_order ASC**
    - Buat `tests/Feature/Properties/KosPhotoOrderPropertyTest.php`
    - For any koleksi foto dengan sort_order acak, urutan yang dikembalikan harus selalu ASC
    - Tag: `// Feature: adakamarid-platform, Property 14`
    - **Validates: Requirements 5.3**

  - [ ] 10.4 Buat halaman `Guest/Kos/Show.jsx`
    - Galeri foto: foto utama besar + thumbnail strip, foto diurutkan by sort_order, fallback placeholder jika tidak ada foto, gunakan `<ImageWithFallback>`
    - Nama kos + badge "Plus" jika `is_plus=true`
    - Harga per tipe aktif sebagai pill/badge; fallback "Hubungi pemilik untuk informasi harga" jika kosong
    - Info umum: AC, WiFi, KM Dalam dengan icon
    - Fasilitas 3 kelompok: kamar, bersama, sekitar
    - Lokasi: kecamatan, alamat, embed Google Maps (`<iframe>` dengan lat/lng); fallback "Peta tidak tersedia"
    - Peraturan: tampil hanya jika `rules` terisi
    - Kontak: nama + tombol WhatsApp hijau (`https://wa.me/{contact_whatsapp}`)
    - Daftar ulasan: nama reviewer, bintang, komentar, foto, tanggal; fallback "Belum ada ulasan..."
    - Buat komponen `resources/js/Components/Guest/ReviewItem.jsx`
    - Buat komponen `resources/js/Components/Guest/StarRating.jsx`
    - Rekomendasi kos serupa: grid 4 `<KosCard>`
    - Tempat placeholder untuk `<ReviewForm>` (diimplementasikan di Phase 7)
    - Gunakan `<LoadingSpinner>` untuk state loading; buat `resources/js/Components/Shared/LoadingSpinner.jsx`
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.14_

- [ ] 11. Checkpoint Phase 5 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 6: Autentikasi Guest

- [ ] 12. Buat Repository dan Service untuk User Guest Auth
  - [ ] 12.1 Implementasi `UserRepository`
    - Buat `app/Repositories/UserRepository.php`
    - Method `allAdmins()`, `allGuests()`, `findById()`, `create()`, `update()`, `toggleActive()`
    - Method `existsByEmail(string $email, ?int $excludeId)`: cek duplikat email
    - Method `findByGoogleId(string $googleId)`, `findByEmail(string $email)`
    - _Requirements: 2.1, 2.6, 13.1, 13.2, 13.3, 13.4_

  - [ ] 12.2 Implementasi `Guest\AuthController`
    - Buat `app/Http/Controllers/Guest/AuthController.php`
    - Method `showLogin()` → return `Inertia::render('Guest/Auth/Login')`
    - Method `login(LoginRequest $request)` → auth, cek `is_active`, redirect ke `intended('/')`
    - Method `showRegister()` → return `Inertia::render('Guest/Auth/Register')`
    - Method `register(RegisterRequest $request)` → cek email unik via `UserRepository`, buat user role `guest`, auto-login, redirect ke `/`
    - Method `logout(Request $request)` → logout, redirect ke `/`
    - Method `redirectToGoogle()` → `Socialite::driver('google')->redirect()`
    - Method `handleGoogleCallback()` → `Socialite::driver('google')->user()`, cari via `findByGoogleId()` atau buat baru, auto-login, redirect ke `/`; tangkap exception OAuth dan redirect ke login dengan error
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 12.3 Buat Form Requests Guest Auth
    - Buat `app/Http/Requests/Guest/LoginRequest.php`: validasi `email` (required, email, max:254), `password` (required)
    - Buat `app/Http/Requests/Guest/RegisterRequest.php`: validasi `name` (required, max:255), `email` (required, email, max:254, unique:users), `password` (required, min:8, max:72, confirmed)
    - _Requirements: 2.1, 2.2_

  - [ ] 12.4 Daftarkan routes Guest Auth di `web.php`
    - Tambahkan grup `middleware('guest')` untuk: `GET/POST /login`, `GET/POST /register`, `GET /auth/google`, `GET /auth/google/callback`
    - Tambahkan `POST /logout` dengan `middleware('auth')`
    - _Requirements: 2.1, 2.3, 2.5, 2.8_

  - [ ] 12.5 Buat halaman `Guest/Auth/Login.jsx` dan `Guest/Auth/Register.jsx`
    - `Login.jsx`: form email + password, tombol "Masuk", tombol "Login dengan Google" (link ke `route('guest.auth.google')`), link ke halaman register; tampilkan error dari `errors` prop
    - `Register.jsx`: form nama, email, password, konfirmasi password; link ke halaman login
    - Gunakan `GuestLayout` (atau layout minimal tanpa navbar)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 13. Checkpoint Phase 6 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 7: Ulasan & Rating

- [ ] 14. Buat Repository, Service, Controller, dan Halaman untuk Ulasan Guest
  - [ ] 14.1 Implementasi `ReviewRepository`
    - Buat `app/Repositories/ReviewRepository.php`
    - Method `allWithRelations(array $filters)`: paginated, eager load `kos`, `user`
    - Method `forKos(Kos $kos)`: `orderBy('created_at', 'desc')` eager load `user`, `photos`
    - Method `create(array $data): Review`
    - Method `delete(Review $review): bool`
    - Method `storePhoto(Review $review, string $path): ReviewPhoto`
    - _Requirements: 6.2, 6.3, 12.1_

  - [ ] 14.2 Implementasi `Guest\ReviewService`
    - Buat `app/Services/Guest/ReviewService.php`
    - Method `store(Kos $kos, User $user, array $data, array $files): Review`
    - Internal: simpan review via `ReviewRepository@create()`, upload setiap foto ke `storage/app/public/review-photos/`, simpan via `ReviewRepository@storePhoto()`, panggil `KosRepository@updateRating($kos)`
    - Lempar exception jika foto > 3 atau ukuran > 2MB (double-check setelah Form Request)
    - _Requirements: 6.2, 6.3, 6.6, 6.7, 6.8, 6.9_

  - [ ] 14.3 Buat Form Request `Guest\StoreReviewRequest`
    - Buat `app/Http/Requests/Guest/StoreReviewRequest.php`
    - Validasi: `rating` (required, integer, min:1, max:5), `comment` (nullable, string, max:1000), `photos` (nullable, array, max:3), `photos.*` (image, mimes:jpeg,png, max:2048)
    - _Requirements: 6.2, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ] 14.4 Implementasi `Guest\ReviewController`
    - Buat `app/Http/Controllers/Guest/ReviewController.php`
    - Method `store(StoreReviewRequest $request, Kos $kos)` dengan middleware `auth`
    - Panggil `Guest\ReviewService@store($kos, Auth::user(), $request->validated(), $request->file('photos', []))`
    - Redirect back dengan flash `success`
    - Daftarkan route `POST /kos/{kos:slug}/reviews` → `Guest\ReviewController@store` dengan nama `reviews.store` di grup `middleware(['auth'])`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11_

  - [ ] 14.5 Buat komponen `ReviewForm.jsx` dan wire ke `Guest/Kos/Show.jsx`
    - Buat `resources/js/Components/Guest/ReviewForm.jsx`
    - `useForm` dengan field: `rating` (input `<StarRating>`), `comment` (textarea), `photos` (file input multi)
    - Submit ke `route('reviews.store', kos.slug)` dengan `forceFormData: true`
    - Tampilkan error dari `errors` prop Inertia
    - Di `Guest/Kos/Show.jsx`: tampilkan `<ReviewForm>` jika `auth.user` tidak null; jika null tampilkan tombol "Login untuk memberi ulasan"
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.7, 6.8, 6.11_

  - [ ]* 14.6 Tulis property test untuk rating average consistency
    - **Property 10: Rating Average Selalu Merupakan Rata-Rata Aritmetika**
    - Buat `tests/Feature/Properties/KosRatingAveragePropertyTest.php`
    - For any array of ratings (1–5), `rating_avg` harus selalu `round(sum/count, 2)` setelah add/delete review
    - Tag: `// Feature: adakamarid-platform, Property 10`
    - **Validates: Requirements 6.9**

  - [ ]* 14.7 Tulis property test untuk batas panjang komentar
    - **Property 11: Komentar Ulasan Lebih dari 1000 Karakter Selalu Ditolak**
    - Buat `tests/Feature/Properties/ReviewCommentLengthPropertyTest.php`
    - For any comment string dengan length > 1000, pengiriman review harus ditolak dan tidak ada record tersimpan
    - Tag: `// Feature: adakamarid-platform, Property 11`
    - **Validates: Requirements 6.5**

  - [ ]* 14.8 Tulis property test untuk validasi ukuran foto ulasan
    - **Property 12: Foto Ulasan Ditolak Jika Ukuran > 2MB**
    - Buat `tests/Feature/Properties/ReviewPhotoSizePropertyTest.php`
    - For any foto dengan ukuran > 2MB, pengiriman harus ditolak tanpa menyimpan ulasan maupun foto
    - Tag: `// Feature: adakamarid-platform, Property 12`
    - **Validates: Requirements 6.7**

- [ ] 15. Checkpoint Phase 7 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 8: Dashboard Admin Real + Statistik Platform

- [ ] 16. Implementasi Dashboard Admin dan Halaman Statistik
  - [ ] 16.1 Implementasi `DashboardController`
    - Buat `app/Http/Controllers/Admin/DashboardController.php`
    - Query: `Kos::active()->count()`, `Kos::active()->plus()->count()`, `Review::count()`
    - `recent_kos`: 5 kos terbaru `orderBy('created_at','desc')->limit(5)->get(['id','name','district','created_at'])`
    - `recent_reviews`: 5 ulasan terbaru dengan eager load `kos:id,name` dan `user:id,name`, `orderBy('created_at','desc')->limit(5)`
    - Ganti closure route `/admin/dashboard` dengan `DashboardController@index`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 16.2 Implementasi `StatisticsController`
    - Buat `app/Http/Controllers/Admin/StatisticsController.php`
    - Query: total kos, kos aktif, kos per tipe (putra/putri/campur), kos Plus aktif, total ulasan
    - Return `Inertia::render('Admin/Statistics/Index', ['stats' => $stats])`
    - Daftarkan route `GET /admin/statistics` → `StatisticsController@index` dengan nama `admin.statistics.index`
    - _Requirements: 16.1, 16.2_

  - [ ] 16.3 Buat halaman `Admin/Statistics/Index.jsx`
    - Grid kartu statistik: total kos, kos aktif, kos per tipe (3 kartu), kos Plus, total ulasan
    - Setiap kartu menampilkan angka 0 jika nilai nol (tidak kosong/tersembunyi)
    - Gunakan `AdminLayout`
    - _Requirements: 16.1, 16.2_

- [ ] 17. Checkpoint Phase 8 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 9: Manajemen Ulasan & User Admin

- [ ] 18. Implementasi Manajemen Ulasan Admin
  - [ ] 18.1 Implementasi `Admin\ReviewService`
    - Buat `app/Services/Admin/ReviewService.php`
    - Method `delete(Review $review): void`
    - Hapus semua file foto ulasan dari Storage (`Storage::delete($photo->path)` untuk setiap `review->photos`)
    - Hapus semua record `ReviewPhoto`, hapus record `Review`
    - Panggil `KosRepository@updateRating($review->kos)` untuk recalculate rating
    - Lempar `\RuntimeException` jika penghapusan file gagal
    - _Requirements: 12.3, 12.4_

  - [ ] 18.2 Implementasi `ReviewController` (Admin)
    - Buat `app/Http/Controllers/Admin/ReviewController.php`
    - Method `index()`: ambil semua ulasan paginated dengan eager load `kos`, `user`, `photos`; return `Admin/Reviews/Index`
    - Method `destroy(Review $review)`: panggil `Admin\ReviewService@delete()`, tangkap `RuntimeException`, redirect back dengan flash
    - Daftarkan routes: `GET /admin/reviews`, `DELETE /admin/reviews/{review}`
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ] 18.3 Buat halaman `Admin/Reviews/Index.jsx`
    - Tabel ulasan: nama kos, nama reviewer, rating (bintang), cuplikan komentar (max 100 char), tanggal, tombol hapus
    - Tombol hapus membuka `<ConfirmDeleteDialog>` sebelum eksekusi
    - Paginasi menggunakan `<Pagination>`
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 19. Implementasi Manajemen User Admin
  - [ ] 19.1 Implementasi `Admin\UserService`
    - Buat `app/Services/Admin/UserService.php`
    - Method `storeAdmin(array $data): User` — cek email unik via `UserRepository@existsByEmail()`, buat user dengan role `admin`
    - Method `update(User $user, array $data): User` — cek email unik (exclude id sendiri)
    - Method `toggleActive(User $user, User $currentAdmin): void` — guard: jika `$user->id === $currentAdmin->id` lempar `\InvalidArgumentException('Anda tidak dapat menonaktifkan akun Anda sendiri')`; lalu panggil `UserRepository@toggleActive($user)`
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9_

  - [ ] 19.2 Buat Form Requests User Admin
    - Buat `app/Http/Requests/Admin/StoreAdminUserRequest.php`: validasi `name` (required, max:255), `email` (required, email, max:254, unique:users), `password` (required, min:8, max:255)
    - Buat `app/Http/Requests/Admin/UpdateAdminUserRequest.php`: validasi `name` (required, max:255), `email` (required, email, max:254, unique:users,email,{route parameter id})
    - _Requirements: 13.2, 13.3, 13.4, 13.8_

  - [ ] 19.3 Implementasi `UserController` (Admin)
    - Buat `app/Http/Controllers/Admin/UserController.php`
    - Method `index()`: ambil `admins` dan `guests` via `UserRepository`, return `Admin/Users/Index`
    - Method `storeAdmin(StoreAdminUserRequest $request)`: panggil `Admin\UserService@storeAdmin()`, redirect back dengan flash
    - Method `update(UpdateAdminUserRequest $request, User $user)`: panggil `Admin\UserService@update()`, redirect back
    - Method `toggleActive(User $user)`: panggil `Admin\UserService@toggleActive($user, Auth::user())`, tangkap `InvalidArgumentException`, redirect back
    - Daftarkan routes: `GET /admin/users`, `POST /admin/users/admin`, `PUT /admin/users/{user}`, `PATCH /admin/users/{user}/toggle-active`
    - _Requirements: 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.9_

  - [ ] 19.4 Buat halaman `Admin/Users/Index.jsx`
    - Dua tab (shadcn/ui `<Tabs>`): "Admin" dan "Guest"
    - Tab Admin: tabel admin (nama, email, status, tanggal) + form inline/modal tambah admin baru di atas tabel
    - Tab Guest: tabel guest (nama, email, status, tanggal)
    - Setiap baris memiliki toggle aktif/nonaktif via `router.patch(route('admin.users.toggleActive', user.id))`
    - Tombol edit nama/email via form kecil atau modal
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.7, 13.9_

- [ ] 20. Checkpoint Phase 9 — Pastikan semua tes lulus, tanyakan ke user jika ada pertanyaan.

---

### Phase 10: Pengaturan Platform

- [ ] 21. Implementasi Pengaturan Platform
  - [ ] 21.1 Implementasi `Admin\SettingService`
    - Buat `app/Services/Admin/SettingService.php`
    - Method `update(array $data, ?UploadedFile $logoFile): void`
    - Jika `platform_name` ada: panggil `SettingRepository@set('platform_name', $data['platform_name'])`
    - Jika `logoFile` ada: simpan ke `storage/app/public/logo/`, panggil `SettingRepository@get('platform_logo')` untuk ambil path lama, hapus file lama via `Storage::delete()`, update `platform_logo` di settings
    - _Requirements: 14.2, 14.3_

  - [ ] 21.2 Buat Form Request dan Controller Pengaturan
    - Buat `app/Http/Requests/Admin/UpdateSettingRequest.php`: validasi `platform_name` (required, string, max:100), `logo` (nullable, file, mimes:png,jpg,svg, max:2048)
    - Buat `app/Http/Controllers/Admin/SettingController.php`
    - Method `index()`: ambil `platform_name` dan `platform_logo` via `SettingRepository@getMultiple([...])`, return `Admin/Settings/Index`
    - Method `update(UpdateSettingRequest $request)`: panggil `Admin\SettingService@update()`, redirect back dengan flash
    - Daftarkan routes: `GET /admin/settings`, `PUT /admin/settings`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 21.3 Buat halaman `Admin/Settings/Index.jsx`
    - Form nama platform (input teks dengan value saat ini)
    - Preview logo saat ini (gambar atau placeholder "Belum ada logo")
    - File input upload logo baru dengan info format dan ukuran max
    - Submit via `useForm` dengan `forceFormData: true` ke `route('admin.settings.update')` menggunakan method `PUT`
    - Tampilkan flash success/error
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 22. Final Checkpoint — Pastikan semua tes lulus dan semua halaman dapat diakses. Tanyakan ke user jika ada pertanyaan.

---

## Notes

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk iterasi lebih cepat
- Setiap task mereferensikan requirement untuk traceability
- **Property tests** menggunakan library [Eris](https://github.com/giorgiosironi/eris) (`giorgiosironi/eris: ^0.12`) — install via `composer require --dev giorgiosironi/eris`
- Semua file upload disimpan via `Laravel Storage` di disk `public`; jalankan `php artisan storage:link` jika belum
- Konstanta daftar kecamatan (districts) disimpan sebagai array PHP atau config, dipakai bersama di Controller dan dikirim ke frontend sebagai props
- Semua route admin protected menggunakan middleware `auth` + `admin` (sudah ada)
- Route guest protected (review) menggunakan middleware `auth` saja
- Google OAuth membutuhkan konfigurasi `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` di `.env`

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2", "4.1", "4.2", "4.3", "7.1", "12.1", "14.1"]
    },
    {
      "id": 1,
      "tasks": ["1.3", "2.1", "2.2", "4.4", "7.2", "12.2", "12.3", "14.2"]
    },
    {
      "id": 2,
      "tasks": ["2.3", "2.4", "4.5", "4.6", "4.7", "5.1", "5.2", "7.3", "7.4", "7.5", "14.3", "14.4"]
    },
    {
      "id": 3,
      "tasks": ["5.3", "5.4", "5.5", "8.1", "8.2", "12.4", "12.5", "16.1", "18.1", "19.1", "21.1"]
    },
    {
      "id": 4,
      "tasks": ["5.6", "5.7", "5.8", "5.9", "8.3", "8.4", "10.1", "10.2", "10.3", "14.5", "16.2", "18.2", "19.2", "21.2"]
    },
    {
      "id": 5,
      "tasks": ["10.4", "14.6", "14.7", "14.8", "16.3", "18.3", "19.3", "21.3"]
    },
    {
      "id": 6,
      "tasks": ["19.4"]
    }
  ]
}
```
