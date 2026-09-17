<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KosSeeder extends Seeder
{
    public function run(): void
    {
        $kos = [
            [
                'name'                => 'Kos Putri Melati Seturan',
                'type'                => 'putri',
                'district'            => 'Depok, Sleman',
                'address'             => 'Jl. Seturan Raya No. 12, Seturan, Depok, Sleman',
                'latitude'            => -7.7692,
                'longitude'           => 110.4103,
                'description'         => 'Kos putri nyaman di kawasan Seturan yang strategis, dekat dengan berbagai kampus ternama Yogyakarta. Lingkungan tenang dengan penghuni yang kebanyakan mahasiswi.',
                'rules'               => "Tamu lawan jenis dilarang masuk kamar.\nJam malam maksimal pukul 22.00 WIB.\nDilarang membawa hewan peliharaan.\nDilarang memasak di dalam kamar.\nKebersihan kamar dan area bersama dijaga bersama.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Bu Sari',
                'contact_whatsapp'    => '6281234560001',
                'is_plus'             => false,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Putra Griya Condong',
                'type'                => 'putra',
                'district'            => 'Depok, Sleman',
                'address'             => 'Jl. Ring Road Utara No. 45, Condongcatur, Depok, Sleman',
                'latitude'            => -7.7523,
                'longitude'           => 110.3971,
                'description'         => 'Kos putra di kawasan Condongcatur, sangat dekat dengan kampus UPN Veteran dan AMIKOM. Tersedia parkir motor luas dan akses mudah ke Ring Road Utara.',
                'rules'               => "Jam malam pukul 23.00 WIB.\nDilarang membawa tamu menginap.\nMenjaga kebersihan dan ketenangan bersama.\nPembayaran sewa paling lambat tanggal 5 setiap bulan.",
                'has_ac'              => false,
                'has_wifi'            => true,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Pak Hendra',
                'contact_whatsapp'    => '6281234560002',
                'is_plus'             => false,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Pogung Residence',
                'type'                => 'campur',
                'district'            => 'Mlati, Sleman',
                'address'             => 'Jl. Pogung Rejo No. 8, Pogung, Mlati, Sleman',
                'latitude'            => -7.7641,
                'longitude'           => 110.3714,
                'description'         => 'Kos campur modern di Pogung, lokasi favorit mahasiswa UGM terutama Fakultas Teknik. Bangunan baru 3 lantai dengan kamar yang luas dan bersih.',
                'rules'               => "Tamu berkunjung maksimal pukul 21.00 WIB.\nDilarang merokok di dalam kamar.\nSampah dibuang pada tempatnya.\nWajib lapor ke pengelola jika ada tamu menginap.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> true,
                'contact_name'        => 'Bu Dewi',
                'contact_whatsapp'    => '6281234560003',
                'is_plus'             => true,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Baciro Indah',
                'type'                => 'putri',
                'district'            => 'Gondokusuman, Kota Yogyakarta',
                'address'             => 'Jl. Baciro Baru No. 21, Baciro, Gondokusuman, Yogyakarta',
                'latitude'            => -7.7972,
                'longitude'           => 110.3822,
                'description'         => 'Kos putri di area Baciro yang tenang, dekat Stasiun Lempuyangan dan pusat kota Yogyakarta. Cocok untuk karyawan dan mahasiswi yang menginginkan akses mudah ke transportasi.',
                'rules'               => "Khusus penghuni putri.\nTamu laki-laki tidak diperkenankan masuk area kos.\nJam kunjungan tamu pukul 08.00-21.00 WIB.\nDilarang membawa atau mengonsumsi minuman beralkohol.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> true,
                'contact_name'        => 'Bu Ratna',
                'contact_whatsapp'    => '6281234560004',
                'is_plus'             => true,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Demangan Elegan',
                'type'                => 'campur',
                'district'            => 'Gondokusuman, Kota Yogyakarta',
                'address'             => 'Jl. Demangan Baru No. 17, Demangan, Gondokusuman, Yogyakarta',
                'latitude'            => -7.7806,
                'longitude'           => 110.3797,
                'description'         => 'Kos campur di kawasan Demangan yang prestisius. Dekat dengan UGM, RS Panti Rapih, dan berbagai fasilitas kota. Lingkungan tenang dan aman dengan CCTV 24 jam.',
                'rules'               => "Tamu berkunjung maksimal pukul 22.00 WIB.\nDilarang mengadakan keramaian atau pesta.\nParkir kendaraan sesuai tempat yang ditentukan.\nDilarang merokok di area bersama.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> true,
                'contact_name'        => 'Pak Agus',
                'contact_whatsapp'    => '6281234560005',
                'is_plus'             => true,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Kaliurang Asri',
                'type'                => 'putra',
                'district'            => 'Ngaglik, Sleman',
                'address'             => 'Jl. Kaliurang KM 14 No. 9, Sardonoharjo, Ngaglik, Sleman',
                'latitude'            => -7.6851,
                'longitude'           => 110.4122,
                'description'         => 'Kos putra dengan suasana sejuk di kawasan Kaliurang, dekat kampus UII. Udara segar kaki Gunung Merapi menjadi keunggulan utama.',
                'rules'               => "Jam malam pukul 22.00 WIB.\nDilarang membawa tamu lawan jenis ke kamar.\nMenjaga kebersihan bersama.\nDilarang membawa kendaraan roda empat ke dalam area.",
                'has_ac'              => false,
                'has_wifi'            => true,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Pak Joko',
                'contact_whatsapp'    => '6281234560006',
                'is_plus'             => false,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Prawirotaman Heritage',
                'type'                => 'campur',
                'district'            => 'Mergangsan, Kota Yogyakarta',
                'address'             => 'Jl. Prawirotaman II No. 33, Brontokusuman, Mergangsan, Yogyakarta',
                'latitude'            => -7.8153,
                'longitude'           => 110.3624,
                'description'         => 'Kos campur bergaya heritage di kawasan seni Prawirotaman. Dekat gallery seni, restoran internasional, dan 15 menit jalan kaki ke Malioboro.',
                'rules'               => "Tamu berkunjung pukul 08.00-22.00 WIB.\nMenghormati privasi penghuni lain.\nDilarang merokok di dalam kamar.\nHewan peliharaan tidak diperbolehkan.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> true,
                'contact_name'        => 'Bu Wulan',
                'contact_whatsapp'    => '6281234560007',
                'is_plus'             => true,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Janti Maju',
                'type'                => 'campur',
                'district'            => 'Banguntapan, Bantul',
                'address'             => 'Jl. Janti No. 27, Wonocatur, Banguntapan, Bantul',
                'latitude'            => -7.8012,
                'longitude'           => 110.4133,
                'description'         => 'Kos campur strategis di area Janti, dekat pintu tol Janti dan ring road selatan. Mudah akses ke berbagai arah dan dekat pusat perbelanjaan.',
                'rules'               => "Jam malam pukul 23.00 WIB.\nTamu menginap wajib lapor dan membayar biaya tambahan.\nDilarang membuat kebisingan setelah pukul 22.00 WIB.\nPembayaran sewa maksimal tanggal 10.",
                'has_ac'              => false,
                'has_wifi'            => true,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Pak Budi',
                'contact_whatsapp'    => '6281234560008',
                'is_plus'             => false,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Jetis Nyaman',
                'type'                => 'putri',
                'district'            => 'Jetis, Kota Yogyakarta',
                'address'             => 'Jl. AM Sangaji No. 14, Cokrodiningratan, Jetis, Yogyakarta',
                'latitude'            => -7.7889,
                'longitude'           => 110.3658,
                'description'         => 'Kos putri eksklusif di kawasan Jetis, dekat RS Bethesda, Tugu Yogyakarta, dan kampus STTL. Lingkungan sangat aman dan tenang.',
                'rules'               => "Khusus penghuni perempuan.\nJam kunjungan tamu 09.00-21.00 WIB.\nDilarang membawa tamu laki-laki masuk area kos.\nWajib melapor ke penjaga jika pulang larut malam.",
                'has_ac'              => true,
                'has_wifi'            => true,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Bu Erna',
                'contact_whatsapp'    => '6281234560009',
                'is_plus'             => false,
                'is_active'           => true,
            ],
            [
                'name'                => 'Kos Godean Sejahtera',
                'type'                => 'putra',
                'district'            => 'Godean, Sleman',
                'address'             => 'Jl. Godean KM 7 No. 5, Sidoarum, Godean, Sleman',
                'latitude'            => -7.7817,
                'longitude'           => 110.3134,
                'description'         => 'Kos putra di area Godean barat Yogyakarta, cocok untuk mahasiswa UMY dan karyawan kawasan industri sekitar. Harga terjangkau dengan parkir luas.',
                'rules'               => "Jam malam pukul 22.00 WIB.\nDilarang membawa tamu menginap tanpa izin.\nMenjaga kebersihan kamar mandi bersama.\nPembayaran sewa paling lambat tanggal 5 setiap bulan.",
                'has_ac'              => false,
                'has_wifi'            => false,
                'has_private_bathroom'=> false,
                'contact_name'        => 'Pak Slamet',
                'contact_whatsapp'    => '6281234560010',
                'is_plus'             => false,
                'is_active'           => true,
            ],
        ];

        $now = now();

        foreach ($kos as $item) {
            $item['slug']         = \App\Models\Kos::generateUniqueSlug($item['name']);
            $item['rating_avg']   = 0.00;
            $item['review_count'] = 0;
            $item['views_count']  = 0;
            $item['created_at']   = $now;
            $item['updated_at']   = $now;

            DB::table('kos')->insert($item);
        }

        $this->command->info('10 data kos berhasil di-seed.');
    }
}