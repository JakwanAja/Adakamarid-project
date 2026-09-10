# Requirements Document

## Introduction

Adakamar.id adalah platform iklan properti kos yang berfokus pada area Yogyakarta. Platform ini menghubungkan calon penyewa dengan pemilik kos melalui listing yang dikurasi dan dikelola sepenuhnya oleh admin. Tidak ada proses booking atau pembayaran online; calon penyewa menghubungi pemilik kos langsung via nomor WhatsApp atau telepon yang tercantum di listing.

Platform dibangun di atas Laravel 12 (backend), React + Inertia.js (frontend), MySQL (database), dengan arsitektur Controller → Service → Repository. Halaman publik menggunakan Tailwind CSS dengan referensi visual sewakost.com dan mamikos.com. Dashboard admin menggunakan Flowbite. Komponen utilitas interaktif menggunakan shadcn/ui.

---

## Glossary

- **System**: Aplikasi web Adakamar.id secara keseluruhan.
- **Admin**: Pengguna dengan role `admin` yang mengelola seluruh data platform.
- **Guest**: Pengguna yang belum login atau telah login dengan role `guest`; dapat browsing tanpa login.
- **Kos**: Unit properti indekos yang menjadi listing utama di platform.
- **Listing**: Satu entri kos yang ditampilkan secara publik di platform.
- **Harga_Sewa**: Harga per tipe sewa (harian, bulanan, atau tahunan) yang melekat pada satu Kos.
- **Fasilitas**: Item fasilitas yang dapat dimiliki oleh Kos, dikelompokkan dalam kategori kamar, bersama, atau sekitar.
- **Master_Fasilitas**: Daftar terpusat seluruh Fasilitas yang dikelola Admin.
- **Ulasan**: Entri penilaian dari Guest yang berisi rating bintang, komentar teks, dan foto opsional.
- **Label_Plus**: Penanda visual pada Kos yang menandakan fasilitas unggulan.
- **Pengaturan_Platform**: Data konfigurasi global platform seperti nama dan logo.
- **Repository**: Lapisan yang menangani seluruh query Eloquent tanpa logika bisnis.
- **Service**: Lapisan yang menjalankan logika bisnis dan memanggil Repository.
- **Controller**: Lapisan yang menerima request HTTP dari Inertia dan mengembalikan Inertia page.
- **OAuth**: Protokol autentikasi pihak ketiga; di platform ini digunakan untuk login Google via Laravel Socialite.
- **Slug**: Identifier URL-friendly yang dihasilkan dari nama Kos.
- **Kecamatan**: Satuan wilayah lokasi Kos yang dipilih dari daftar dropdown yang telah ditentukan.

---

## Requirements

---

### Requirement 1: Autentikasi Admin

**User Story:** Sebagai Admin, saya ingin dapat login ke dashboard dengan email dan password yang terverifikasi, agar akses ke panel pengelolaan platform terlindungi dari pengguna tidak berwenang.

#### Acceptance Criteria

1. WHEN Admin mengirimkan form login dengan email valid (format RFC 5321, maksimal 254 karakter) dan password yang cocok, THE System SHALL mengautentikasi Admin, membuat sesi aktif, dan mengarahkan Admin ke halaman dashboard.
2. IF Admin mengirimkan form login dengan email atau password yang tidak valid, THEN THE System SHALL menampilkan pesan kesalahan "Email atau password salah", mempertahankan nilai email yang diinput, dan mengosongkan field password.
3. IF Admin gagal login sebanyak 5 kali dalam 60 detik dari IP yang sama, THEN THE System SHALL mengunci akses login dari IP tersebut selama 60 detik dan menampilkan pesan "Terlalu banyak percobaan login. Coba lagi dalam 60 detik."
4. WHILE Admin belum memiliki sesi aktif, THE System SHALL mengarahkan setiap request ke halaman-halaman terproteksi admin ke halaman login admin.
5. WHEN Admin memilih logout, THE System SHALL menghapus sesi aktif Admin dan mengarahkan Admin ke halaman login admin.
6. IF request ke halaman autentikasi Admin tidak mengandung CSRF token yang valid, THEN THE System SHALL menolak request tersebut dengan HTTP 419.
7. THE System SHALL menyimpan password Admin dalam database sebagai hash non-reversibel; password plaintext tidak boleh tersimpan di database.
8. THE System SHALL membatasi akses ke seluruh route dashboard admin hanya untuk pengguna yang memiliki sesi aktif dan role `admin`.

---

### Requirement 2: Autentikasi Guest

**User Story:** Sebagai Guest, saya ingin dapat mendaftar dan login menggunakan email/password atau akun Google, agar saya dapat mengakses fitur yang memerlukan autentikasi seperti memberi ulasan.

#### Acceptance Criteria

1. WHEN Guest mengirimkan form registrasi dengan nama maksimal 255 karakter, email unik, password antara 8 sampai 72 karakter, dan konfirmasi password yang cocok, THE System SHALL membuat akun baru dengan role `guest` dan mengarahkan Guest ke halaman utama dalam kondisi login.
2. IF Guest mengirimkan form registrasi dengan email yang sudah terdaftar, THEN THE System SHALL menampilkan pesan validasi "Email sudah terdaftar".
3. WHEN Guest mengirimkan form login dengan email dan password yang valid, THE System SHALL mengautentikasi Guest, membuat sesi aktif, dan mengarahkan Guest ke halaman yang dituju sebelumnya atau halaman utama.
4. IF Guest mengirimkan form login dengan kredensial yang tidak valid, THEN THE System SHALL menampilkan pesan kesalahan "Email atau password salah".
5. WHEN Guest memilih login Google, THE System SHALL mengarahkan Guest ke halaman autentikasi Google menggunakan Laravel Socialite.
6. WHEN Google OAuth mengembalikan respons yang mengandung `google_id` dan `email` yang valid, THE System SHALL membuat atau memperbarui akun Guest menggunakan `google_id` dan `email` tersebut, lalu membuat sesi aktif untuk Guest.
7. IF Google OAuth mengembalikan respons error atau tidak mengandung `google_id` maupun `email` yang valid, THEN THE System SHALL mengarahkan Guest kembali ke halaman login dengan pesan error yang mengindikasikan kegagalan autentikasi Google.
8. WHEN Guest memilih logout, THE System SHALL menghapus sesi aktif Guest dan mengarahkan Guest ke halaman utama.
9. THE System SHALL memperbolehkan Guest browsing listing dan halaman detail Kos tanpa sesi aktif.
10. THE System SHALL melindungi seluruh form autentikasi Guest dengan CSRF token Laravel.

---

### Requirement 3: Landing Page

**User Story:** Sebagai Guest, saya ingin melihat halaman utama yang informatif dengan search bar dan pratinjau listing, agar saya dapat memahami platform dan langsung mulai mencari kos yang sesuai.

#### Acceptance Criteria

1. WHEN Guest mengakses halaman utama, THE System SHALL menampilkan hero section yang memuat headline utama platform, deskripsi singkat, dan search bar yang menerima input teks dengan panjang 1 hingga 100 karakter.
2. WHEN Guest mengakses halaman utama, THE System SHALL menampilkan daftar Kos dengan status `is_active = 1`, diurutkan berdasarkan nilai `is_plus = 1` terlebih dahulu kemudian berdasarkan tanggal dibuat terbaru, dengan maksimal 8 listing ditampilkan.
3. WHEN Guest mengakses halaman utama, THE System SHALL menampilkan kategori pencarian cepat yang memuat semua nilai tipe sewa (harian, bulanan, tahunan) dan semua nilai tipe Kos (putra, putri, campur) sebagai pilihan yang dapat diklik.
4. THE System SHALL menampilkan bagian keunggulan platform yang memuat minimal 3 poin differensiator pada halaman utama.
5. THE System SHALL menyediakan tautan navigasi ke halaman daftar listing lengkap dari halaman utama.
6. WHEN Guest mengklik kategori pencarian cepat tipe sewa atau tipe Kos, THE System SHALL mengarahkan Guest ke halaman daftar listing dengan parameter filter tipe sewa atau tipe Kos yang dipilih sudah diterapkan secara otomatis.
7. WHEN Guest mengirimkan input tidak kosong dari search bar hero section, THE System SHALL mengarahkan Guest ke halaman daftar listing dengan parameter pencarian berupa teks yang dimasukkan diterapkan sebagai filter.
8. IF Guest mengirimkan search bar dengan input kosong, THEN THE System SHALL tetap menampilkan halaman utama tanpa melakukan navigasi dan menampilkan pesan indikasi bahwa input pencarian tidak boleh kosong.

---

### Requirement 4: Pencarian dan Filter Kos

**User Story:** Sebagai Guest, saya ingin mencari dan memfilter kos berdasarkan kriteria seperti tipe sewa, lokasi, harga, dan tipe kos, agar saya dapat menemukan kos yang paling sesuai dengan kebutuhan saya.

#### Acceptance Criteria

1. THE System SHALL menampilkan halaman daftar listing yang memuat seluruh Kos dengan status `is_active = 1` secara default tanpa filter aktif.
2. THE System SHALL menyediakan filter tipe sewa dengan pilihan: harian, bulanan, dan tahunan; filter ini menampilkan hanya Kos yang memiliki harga aktif dengan tipe tersebut.
3. THE System SHALL menyediakan filter lokasi berupa dropdown Kecamatan yang berisi daftar kecamatan yang telah ditentukan.
4. THE System SHALL menyediakan filter rentang harga berupa input harga minimum (nilai antara 0 dan 999.999.999) dan harga maksimum (nilai antara 0 dan 999.999.999); jika hanya satu nilai diisi, filter hanya menerapkan batas satu sisi.
5. THE System SHALL menyediakan filter tipe Kos dengan pilihan: putra, putri, dan campur.
6. WHEN Guest menerapkan satu atau lebih filter, THE System SHALL memperbarui hasil listing dalam waktu tidak lebih dari 3 detik tanpa melakukan full page reload, menampilkan hanya Kos yang memenuhi seluruh filter yang aktif.
7. THE System SHALL menampilkan setiap Kos di hasil pencarian dengan: foto utama (atau placeholder jika tidak ada foto utama), nama Kos, Label_Plus (jika berlaku), nama Kecamatan, tipe Kos, dan rating rata-rata diformat 1 angka desimal.
8. IF nilai harga minimum yang diinput lebih besar dari nilai harga maksimum, THEN THE System SHALL menampilkan pesan validasi "Harga minimum tidak boleh lebih besar dari harga maksimum" dan tidak memperbarui hasil listing.
9. IF tidak ada Kos yang memenuhi kriteria filter, THEN THE System SHALL menampilkan pesan "Tidak ada kos yang ditemukan untuk pencarian ini".
10. THE System SHALL mempertahankan nilai filter yang aktif dalam sesi yang sama saat Guest melakukan navigasi dari halaman detail Kos kembali ke halaman daftar listing.

---

### Requirement 5: Halaman Detail Kos

**User Story:** Sebagai Guest, saya ingin melihat informasi lengkap sebuah kos pada halaman detail, agar saya dapat mengevaluasi apakah kos tersebut sesuai sebelum menghubungi pemiliknya.

#### Acceptance Criteria

1. WHEN Guest mengakses URL halaman detail Kos yang valid (berdasarkan `slug`), THE System SHALL menampilkan halaman detail Kos tersebut.
2. IF Guest mengakses URL halaman detail Kos dengan `slug` yang tidak ditemukan atau Kos dengan `is_active = 0`, THEN THE System SHALL mengembalikan halaman 404.
3. THE System SHALL menampilkan galeri foto Kos yang diurutkan berdasarkan `sort_order` secara naik (ASC); jika tidak ada foto dengan `is_primary = 1`, maka foto pertama berdasarkan urutan `sort_order` ditampilkan sebagai foto utama.
4. THE System SHALL menampilkan nama Kos dan Label_Plus di samping nama jika `is_plus = 1`.
5. THE System SHALL menampilkan seluruh Harga_Sewa yang aktif dengan format harga per tipe sewa (harian/bulanan/tahunan); jika tidak ada harga aktif, THE System SHALL menampilkan teks "Hubungi pemilik untuk informasi harga".
6. THE System SHALL menampilkan informasi umum Kos sebagai atribut terpisah: AC (`has_ac`), WiFi (`has_wifi`), dan kamar mandi dalam (`has_private_bathroom`).
7. THE System SHALL menampilkan fasilitas Kos dalam tiga kelompok terpisah: fasilitas kamar, fasilitas bersama, dan fasilitas sekitar.
8. THE System SHALL menampilkan lokasi Kos yang memuat nama Kecamatan, alamat lengkap, dan embed Google Maps menggunakan koordinat latitude dan longitude; IF koordinat latitude atau longitude tidak tersedia, THEN THE System SHALL menampilkan teks "Peta tidak tersedia" sebagai pengganti embed Google Maps.
9. IF field `rules` terisi, THEN THE System SHALL menampilkan peraturan Kos dari field `rules`; IF field `rules` kosong atau null, THEN THE System SHALL tidak menampilkan bagian peraturan.
10. THE System SHALL menampilkan kontak pemilik Kos berupa nama kontak; IF `contact_whatsapp` terisi, THEN THE System SHALL menampilkan tombol WhatsApp yang membuka tautan `https://wa.me/{contact_whatsapp}`.
11. WHEN Guest mengakses halaman detail Kos, THE System SHALL menampilkan seluruh Ulasan terkait diurutkan dari terbaru ke terlama, menampilkan nama reviewer, rating bintang (skala 1–5), komentar, foto Ulasan (jika ada), dan tanggal Ulasan; IF tidak ada Ulasan, THE System SHALL menampilkan teks "Belum ada ulasan untuk kos ini".
12. THE System SHALL menampilkan rekomendasi maksimal 4 Kos lain dengan status aktif dari Kecamatan yang sama, kecuali Kos yang sedang ditampilkan, dalam urutan acak.
13. WHEN Guest mengakses halaman detail Kos, THE System SHALL menambah nilai `views_count` Kos tersebut sebesar 1.
14. THE System SHALL memuat data relasi foto, harga, fasilitas, dan ulasan Kos dalam satu batch query sebelum merender halaman, sehingga tidak terjadi query N+1.

---

### Requirement 6: Ulasan dan Rating

**User Story:** Sebagai Guest yang telah login, saya ingin dapat memberikan, mengedit ulasan dan rating pada kos yang pernah saya tinggali, agar calon penyewa lain dapat membuat keputusan yang lebih baik.

#### Acceptance Criteria

1. WHILE Guest belum memiliki sesi aktif, THE System SHALL menyembunyikan form pengiriman Ulasan dan menampilkan tombol "Login untuk memberi ulasan" pada halaman detail Kos.
2. IF Guest yang telah login belum pernah memberikan Ulasan untuk Kos tersebut, THEN THE System SHALL menampilkan form pengiriman Ulasan baru.
3. IF Guest yang telah login sudah pernah memberikan Ulasan untuk Kos tersebut, THEN THE System SHALL menampilkan form edit Ulasan yang sudah ada (bukan form baru), sehingga setiap Guest hanya dapat memiliki satu Ulasan per Kos.
4. WHEN Guest yang telah login mengirimkan Ulasan baru dengan rating berupa bilangan bulat antara 1 sampai 5, THE System SHALL menyimpan Ulasan ke database.
5. WHEN Guest yang telah login mengirimkan perubahan pada Ulasan yang sudah ada, THE System SHALL memperbarui data Ulasan tersebut di database.
6. WHEN Ulasan berhasil disimpan atau diperbarui, THE System SHALL menampilkan Ulasan tersebut secara publik di halaman detail Kos tanpa moderasi dan memperbarui nilai `rating_avg` dan `review_count` pada data Kos yang bersangkutan.
7. IF Guest yang telah login mengirimkan Ulasan tanpa rating, THEN THE System SHALL menampilkan pesan validasi "Rating wajib diisi".
8. IF Guest mengirimkan komentar teks yang melebihi 1000 karakter, THEN THE System SHALL menampilkan pesan validasi "Komentar maksimal 1000 karakter" dan menolak pengiriman Ulasan.
9. WHERE Guest menyertakan foto dalam Ulasan, THE System SHALL menerima file dengan format JPEG atau PNG, menyimpan foto ke penyimpanan aplikasi, dan menyimpan referensinya ke database.
10. IF Guest mengunggah foto Ulasan dengan ukuran melebihi 2 MB per file, THEN THE System SHALL menampilkan pesan validasi "Ukuran foto maksimal 2 MB per foto" dan menolak pengiriman Ulasan.
11. IF Guest mengunggah lebih dari 3 foto dalam satu Ulasan, THEN THE System SHALL menampilkan pesan validasi "Maksimal 3 foto per ulasan" dan menolak pengiriman Ulasan.
12. THE System SHALL menghitung `rating_avg` Kos sebagai rata-rata aritmetika dari seluruh nilai rating Ulasan untuk Kos tersebut, dibulatkan hingga 2 angka desimal; nilai ini diperbarui setiap kali Ulasan dibuat, diperbarui, atau dihapus.
13. THE System SHALL menampilkan field komentar teks sebagai opsional; Ulasan dapat disubmit hanya dengan rating tanpa komentar.
14. THE System SHALL tidak menyediakan tombol atau fitur hapus Ulasan di sisi Guest; hanya Admin yang dapat menghapus Ulasan.

---

### Requirement 7: Dashboard Admin

**User Story:** Sebagai Admin, saya ingin melihat ringkasan statistik dan aktivitas terkini platform di dashboard, agar saya dapat memantau kondisi platform dengan cepat.

#### Acceptance Criteria

1. WHEN Admin mengakses halaman dashboard, THE System SHALL menampilkan kartu statistik yang memuat: jumlah total Kos aktif, jumlah Kos Plus aktif, dan jumlah total Ulasan.
2. WHEN Admin mengakses halaman dashboard, THE System SHALL menampilkan daftar 5 Kos terbaru yang ditambahkan ke sistem, diurutkan berdasarkan tanggal dibuat secara menurun.
3. WHEN Admin mengakses halaman dashboard, THE System SHALL menampilkan daftar 5 Ulasan terbaru, diurutkan berdasarkan tanggal dibuat secara menurun, beserta nama Kos yang diulas dan nama reviewer.
4. THE System SHALL menampilkan layout dashboard admin dengan sidebar navigasi yang sama (nama menu, ikon, urutan) di seluruh halaman dashboard admin.
5. IF pengguna yang mengakses halaman dashboard tidak memiliki sesi aktif dengan role `admin`, THEN THE System SHALL mengarahkan pengguna tersebut ke halaman login admin.
6. WHILE data sedang dimuat, THE System SHALL menampilkan indikator loading pada area kartu statistik dan daftar aktivitas.

---

### Requirement 8: Manajemen Kos oleh Admin

**User Story:** Sebagai Admin, saya ingin dapat menambah, mengedit, mengaktifkan/menonaktifkan, dan menghapus data kos, agar seluruh listing di platform selalu akurat dan ter-update.

#### Acceptance Criteria

1. WHEN Admin mengirimkan form tambah Kos dengan nama (1–150 karakter), tipe Kos (putra/putri/campur), Kecamatan, alamat, nama kontak, dan nomor WhatsApp (10–13 digit angka) yang valid, THE System SHALL menyimpan data Kos baru, menghasilkan `slug` unik dari nama Kos secara otomatis, dan menampilkan Kos baru di daftar manajemen Kos.
2. THE System SHALL memastikan setiap `slug` Kos bersifat unik; IF `slug` yang dihasilkan sudah ada, THEN THE System SHALL menambahkan sufiks numerik untuk memastikan keunikannya (contoh: `nama-kos-2`).
3. WHEN Admin mengedit data Kos yang ada dan mengirimkan form dengan data yang valid, THE System SHALL memperbarui data Kos dan mencatat waktu pembaruan.
4. WHEN Admin mengunggah foto Kos, THE System SHALL menerima file berformat JPEG, PNG, atau WebP dengan ukuran maksimal 2 MB per file dan maksimal 10 foto per Kos, menyimpan file ke penyimpanan aplikasi, dan mencatat referensinya.
5. WHEN Admin menetapkan satu foto sebagai foto utama, THE System SHALL menandai foto tersebut sebagai foto utama dan menghapus tanda foto utama dari seluruh foto lain milik Kos yang sama.
6. WHEN Admin menghapus foto Kos, THE System SHALL menghapus file foto dari penyimpanan aplikasi.
7. IF penghapusan file foto gagal, THEN THE System SHALL menampilkan pesan error "Foto gagal dihapus, coba lagi" dan mempertahankan record foto tersebut.
8. WHEN Admin mengaktifkan toggle status Kos, THE System SHALL mengubah status aktif Kos tersebut; Kos dengan status tidak aktif tidak akan muncul di halaman publik.
9. WHEN Admin mengaktifkan toggle Label_Plus, THE System SHALL mengubah status Plus Kos tersebut.
10. WHEN Admin mengkonfirmasi penghapusan data Kos, THE System SHALL menghapus Kos beserta seluruh data terkait (foto, harga, fasilitas, ulasan) secara permanen.
11. WHEN Admin mengakses halaman manajemen Kos, THE System SHALL menampilkan daftar seluruh Kos dengan informasi: nama, tipe, Kecamatan, status aktif, status Plus, dan tanggal dibuat.

---

### Requirement 9: Manajemen Harga Sewa oleh Admin

**User Story:** Sebagai Admin, saya ingin mengatur harga per tipe sewa (harian, bulanan, tahunan) untuk setiap kos, agar calon penyewa dapat melihat informasi harga yang akurat dan lengkap.

#### Acceptance Criteria

1. THE System SHALL menyediakan tiga pilihan tipe Harga_Sewa per Kos: harian, bulanan, dan tahunan; masing-masing dapat diaktifkan atau dinonaktifkan secara independen.
2. WHEN Admin memasukkan harga untuk tipe sewa tertentu dan mengaktifkan tipe tersebut, THE System SHALL menyimpan data harga dan menandai tipe sewa tersebut sebagai aktif.
3. WHEN Admin menonaktifkan tipe sewa tertentu, THE System SHALL menandai tipe sewa tersebut sebagai tidak aktif; tipe sewa yang tidak aktif tidak ditampilkan di halaman publik.
4. IF Admin mencoba menyimpan harga dengan nilai kurang dari atau sama dengan 0, atau lebih dari 999.999.999, THEN THE System SHALL menampilkan pesan validasi "Harga harus antara 1 dan 999.999.999".
5. THE System SHALL memperbolehkan Admin mengaktifkan satu, dua, atau ketiga tipe sewa secara bersamaan untuk satu Kos.

---

### Requirement 10: Manajemen Master Fasilitas oleh Admin

**User Story:** Sebagai Admin, saya ingin mengelola daftar master fasilitas beserta kategorinya, agar daftar fasilitas yang tersedia untuk dipilih saat mendaftarkan kos selalu relevan dan terorganisir.

#### Acceptance Criteria

1. WHEN Admin mengirimkan form tambah Fasilitas dengan nama (1–100 karakter) dan kategori yang valid (kamar, bersama, atau sekitar), THE System SHALL menyimpan Fasilitas baru dan menampilkannya dalam daftar Master_Fasilitas.
2. WHEN Admin mengedit nama atau kategori Fasilitas yang ada, THE System SHALL memperbarui data Fasilitas.
3. WHEN Admin mengkonfirmasi penghapusan Fasilitas, THE System SHALL menghapus Fasilitas dari Master_Fasilitas; seluruh Kos yang sebelumnya memiliki fasilitas tersebut tidak lagi menampilkan fasilitas yang dihapus.
4. IF Admin mencoba menyimpan Fasilitas dengan nama kosong atau lebih dari 100 karakter, THEN THE System SHALL menampilkan pesan validasi "Nama fasilitas wajib diisi (maksimal 100 karakter)".
5. IF Admin mencoba menyimpan Fasilitas dengan nama yang sudah ada di Master_Fasilitas, THEN THE System SHALL menampilkan pesan validasi "Nama fasilitas sudah ada".
6. WHEN Admin mengakses halaman manajemen fasilitas, THE System SHALL menampilkan daftar Master_Fasilitas yang dikelompokkan berdasarkan kategori (kamar, bersama, sekitar).

---

### Requirement 11: Pengelolaan Fasilitas Kos oleh Admin

**User Story:** Sebagai Admin, saya ingin mencentang fasilitas yang dimiliki kos dari daftar master fasilitas saat mendaftarkan atau mengedit kos, agar informasi fasilitas setiap listing akurat.

#### Acceptance Criteria

1. WHEN Admin menambah atau mengedit Kos, THE System SHALL menampilkan daftar seluruh Fasilitas aktif dari Master_Fasilitas yang dikelompokkan berdasarkan kategori sebagai daftar checkbox yang dapat dipilih.
2. WHEN Admin menyimpan Kos dengan pilihan fasilitas, THE System SHALL memperbarui relasi fasilitas Kos sehingga hanya Fasilitas yang dicentang yang terkait dengan Kos tersebut; fasilitas yang sebelumnya dipilih tetapi kini tidak dicentang akan dihapus dari relasi, dan fasilitas yang baru dicentang akan ditambahkan; memilih nol fasilitas adalah kondisi valid.
3. WHEN Admin mengedit Kos yang sudah ada, THE System SHALL menampilkan checkbox fasilitas dengan status tercentang sesuai relasi fasilitas yang sudah tersimpan sebelumnya.

---

### Requirement 12: Manajemen Ulasan oleh Admin

**User Story:** Sebagai Admin, saya ingin dapat melihat seluruh ulasan yang masuk dan menghapus ulasan yang tidak sesuai, agar kualitas konten ulasan di platform terjaga.

#### Acceptance Criteria

1. WHEN Admin mengakses halaman manajemen ulasan, THE System SHALL menampilkan daftar seluruh Ulasan diurutkan dari terbaru ke terlama, memuat: nama Kos yang diulas, nama reviewer, nilai rating, cuplikan komentar (maksimal 100 karakter), dan tanggal Ulasan.
2. WHEN Admin mengklik tombol hapus pada sebuah Ulasan, THE System SHALL menampilkan dialog konfirmasi sebelum eksekusi penghapusan.
3. WHEN Admin mengkonfirmasi penghapusan sebuah Ulasan, THE System SHALL menghapus Ulasan beserta seluruh foto terkait, dan memperbarui nilai `rating_avg` dan `review_count` pada Kos yang bersangkutan.
4. IF penghapusan Ulasan gagal, THEN THE System SHALL menampilkan pesan error "Ulasan gagal dihapus, coba lagi" dan membiarkan data Ulasan tidak berubah.

---

### Requirement 13: Manajemen User oleh Admin

**User Story:** Sebagai Admin, saya ingin mengelola akun admin dan akun guest yang terdaftar di platform, agar keamanan dan kualitas pengguna platform dapat dikontrol.

#### Acceptance Criteria

1. WHEN Admin mengakses halaman manajemen user, THE System SHALL menampilkan daftar terpisah antara akun admin dan akun guest, memuat: nama, email, status aktif, dan tanggal registrasi.
2. WHEN Admin mengirimkan form tambah akun Admin baru dengan nama (maksimal 255 karakter), email unik, dan password (8–255 karakter), THE System SHALL membuat akun baru dengan role `admin`, menyimpan password sebagai hash non-reversibel, dan menampilkan pesan konfirmasi keberhasilan.
3. WHEN Admin mengedit data akun Admin lain (nama atau email) dengan data yang valid, THE System SHALL memperbarui data akun.
4. IF Admin mencoba mengedit email akun menjadi email yang sudah digunakan akun lain, THEN THE System SHALL menampilkan pesan validasi "Email sudah terdaftar".
5. WHEN Admin menonaktifkan akun Admin lain atau akun Guest, THE System SHALL mengatur akun tersebut menjadi tidak aktif; akun yang tidak aktif tidak dapat login ke platform.
6. WHILE akun memiliki status tidak aktif, THE System SHALL menolak permintaan login dari akun tersebut dan menampilkan pesan "Akun Anda telah dinonaktifkan".
7. WHEN Admin mengaktifkan kembali akun yang sebelumnya tidak aktif, THE System SHALL mengatur akun tersebut menjadi aktif kembali.
8. IF Admin mencoba membuat akun baru dengan email yang sudah terdaftar, THEN THE System SHALL menampilkan pesan validasi "Email sudah terdaftar".
9. IF Admin mencoba menonaktifkan akun milik dirinya sendiri, THEN THE System SHALL menampilkan pesan error "Anda tidak dapat menonaktifkan akun Anda sendiri" dan tidak mengubah status akun.

---

### Requirement 14: Pengaturan Platform

**User Story:** Sebagai Admin, saya ingin dapat mengubah nama platform dan logo melalui halaman pengaturan, agar identitas visual platform dapat diperbarui tanpa modifikasi kode.

#### Acceptance Criteria

1. WHEN Admin mengakses halaman pengaturan platform, THE System SHALL menampilkan nama platform dan pratinjau logo yang tersimpan saat ini.
2. WHEN Admin mengirimkan form pengaturan dengan nama platform baru (1–100 karakter, tidak boleh kosong), THE System SHALL memperbarui nama platform di database dan menampilkannya di seluruh halaman.
3. WHEN Admin mengunggah file logo baru dengan format PNG, JPG, atau SVG dan ukuran tidak lebih dari 2 MB, THE System SHALL menyimpan file logo baru ke penyimpanan aplikasi, memperbarui referensi logo di database, dan menghapus file logo lama.
4. IF Admin mengunggah file logo dengan format selain PNG, JPG, atau SVG, THEN THE System SHALL menampilkan pesan validasi "Format logo harus PNG, JPG, atau SVG".
5. IF Admin mengunggah file logo dengan ukuran melebihi 2 MB, THEN THE System SHALL menampilkan pesan validasi "Ukuran logo maksimal 2 MB".
6. WHEN halaman publik atau dashboard admin diakses, THE System SHALL menampilkan nama platform dan logo terbaru yang tersimpan di database.

---

### Requirement 15: Arsitektur dan Kualitas Kode

**User Story:** Sebagai Tim Pengembang, saya ingin platform dibangun dengan arsitektur Controller → Service → Repository yang konsisten, agar kode mudah dimaintain, diuji, dan dikembangkan.

#### Acceptance Criteria

1. THE System SHALL memisahkan tanggung jawab kode ke tiga lapisan: Controller (HTTP handling dan Inertia response), Service (logika bisnis), dan Repository (query Eloquent).
2. THE System SHALL memuat data relasi yang dibutuhkan dalam satu batch query pada halaman listing dan halaman detail Kos untuk mencegah query N+1.
3. THE System SHALL menerapkan atribut `loading="lazy"` pada seluruh elemen gambar di halaman listing publik.
4. THE System SHALL menyimpan seluruh file yang diupload pengguna (foto Kos, logo platform, foto Ulasan) menggunakan Laravel Storage.
5. THE System SHALL menerapkan validasi input di sisi server menggunakan Laravel Form Request sebelum meneruskan data ke lapisan Service.
6. THE System SHALL menggunakan Inertia.js sebagai jembatan antara Laravel dan React tanpa membangun REST API terpisah.

---

### Requirement 16: Statistik Platform

**User Story:** Sebagai Admin, saya ingin melihat statistik platform yang lebih lengkap, agar saya dapat memantau pertumbuhan dan kondisi platform secara menyeluruh.

#### Acceptance Criteria

1. WHEN Admin mengakses halaman statistik, THE System SHALL menampilkan: jumlah total Kos, jumlah Kos aktif, jumlah Kos per tipe (putra, putri, campur), jumlah Kos berlabel Plus, dan jumlah total Ulasan; IF salah satu nilai adalah nol, THE System SHALL tetap menampilkan angka 0 (bukan kosong atau tersembunyi).
2. WHEN Admin mengakses halaman statistik, THE System SHALL menghitung dan menampilkan data statistik terkini langsung dari database saat halaman dimuat.
