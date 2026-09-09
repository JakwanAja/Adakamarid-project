import GuestLayout from '@/Layouts/GuestLayout';
import KosCard from '@/Components/Guest/KosCard';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({ featuredKos, districts }) {
    const [filterBar, setFilterBar] = useState({
        district:   '',
        type:       '',
        price_type: 'bulanan',
        price_min:  '',
        price_max:  '',
    });

    const [priceError, setPriceError] = useState('');

    function handleFilterSubmit(e) {
        e.preventDefault();

        if (filterBar.price_min && filterBar.price_max) {
            if (parseInt(filterBar.price_min) > parseInt(filterBar.price_max)) {
                setPriceError('Harga min tidak boleh lebih besar dari harga maks');
                return;
            }
        }
        setPriceError('');

        const params = {};
        Object.entries(filterBar).forEach(([k, v]) => { if (v) params[k] = v; });
        router.get(route('kos.index'), params);
    }

    return (
        <GuestLayout>
            <Head title="Temukan Kos di Yogyakarta" />

            {/* ── Hero Section — hanya teks + background foto ── */}
            <section
                className="relative flex flex-col items-center justify-center text-center px-4"
                style={{
                    minHeight: '340px',
                    backgroundImage: 'url(/image/hero.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(45,27,24,0.60)' }} />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
                        Temukan Kos Terbaik<br />di Yogyakarta
                    </h1>
                    <p className="text-base mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Listing terkurasi, informasi lengkap, langsung hubungi pemilik
                    </p>
                </div>
            </section>

            {/* ── Filter Bar floating — menabrak batas hero ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-9 relative z-20 mb-4">
                <form onSubmit={handleFilterSubmit}>
                    <div className="bg-white rounded-2xl overflow-hidden"
                        style={{ boxShadow: '0 8px 32px rgba(45,27,24,0.15)', border: '1px solid #EAE0DC' }}>

                        {/* Satu baris filter — persis seperti mamikos */}
                        <div className="flex items-stretch divide-x" style={{ divideColor: '#EAE0DC' }}>

                            {/* Semua Kecamatan */}
                            <div className="flex-1 min-w-0">
                                <select
                                    value={filterBar.district}
                                    onChange={e => setFilterBar(p => ({ ...p, district: e.target.value }))}
                                    className="w-full h-full outline-none appearance-none bg-white"
                                    style={{
                                        padding: '14px 16px',
                                        fontSize: '14px',
                                        color: filterBar.district ? '#2D1B18' : '#8C6B63',
                                        borderRight: '1px solid #EAE0DC',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="">Semua Kecamatan</option>
                                    {districts?.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            {/* Tipe Kos */}
                            <div className="flex-shrink-0">
                                <select
                                    value={filterBar.type}
                                    onChange={e => setFilterBar(p => ({ ...p, type: e.target.value }))}
                                    className="h-full outline-none appearance-none bg-white"
                                    style={{
                                        padding: '14px 16px',
                                        fontSize: '14px',
                                        color: filterBar.type ? '#2D1B18' : '#8C6B63',
                                        borderRight: '1px solid #EAE0DC',
                                        cursor: 'pointer',
                                        minWidth: '130px',
                                    }}
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="putra">Putra</option>
                                    <option value="putri">Putri</option>
                                    <option value="campur">Campur</option>
                                </select>
                            </div>

                            {/* Tipe Sewa */}
                            <div className="flex-shrink-0">
                                <select
                                    value={filterBar.price_type}
                                    onChange={e => setFilterBar(p => ({ ...p, price_type: e.target.value }))}
                                    className="h-full outline-none appearance-none bg-white"
                                    style={{
                                        padding: '14px 16px',
                                        fontSize: '14px',
                                        color: '#2D1B18',
                                        borderRight: '1px solid #EAE0DC',
                                        cursor: 'pointer',
                                        minWidth: '120px',
                                    }}
                                >
                                    <option value="">Semua Sewa</option>
                                    <option value="harian">Harian</option>
                                    <option value="bulanan">Bulanan</option>
                                    <option value="tahunan">Tahunan</option>
                                </select>
                            </div>

                            {/* Harga Min */}
                            <div className="flex-shrink-0 flex items-center"
                                style={{ borderRight: '1px solid #EAE0DC' }}>
                                <span className="pl-3 text-sm shrink-0" style={{ color: '#8C6B63' }}>Rp</span>
                                <input
                                    type="number" min="0"
                                    value={filterBar.price_min}
                                    onChange={e => setFilterBar(p => ({ ...p, price_min: e.target.value }))}
                                    placeholder="0"
                                    className="outline-none bg-white text-sm"
                                    style={{
                                        padding: '14px 8px',
                                        color: '#2D1B18',
                                        width: '90px',
                                    }}
                                />
                            </div>

                            {/* Dash separator */}
                            <div className="flex items-center px-2" style={{ color: '#8C6B63', fontSize: '14px' }}>
                                —
                            </div>

                            {/* Harga Maks */}
                            <div className="flex-shrink-0 flex items-center"
                                style={{ borderRight: '1px solid #EAE0DC' }}>
                                <span className="pl-3 text-sm shrink-0" style={{ color: '#8C6B63' }}>Rp</span>
                                <input
                                    type="number" min="0"
                                    value={filterBar.price_max}
                                    onChange={e => setFilterBar(p => ({ ...p, price_max: e.target.value }))}
                                    placeholder="15.000.000"
                                    className="outline-none bg-white text-sm"
                                    style={{
                                        padding: '14px 8px',
                                        color: '#2D1B18',
                                        width: '110px',
                                    }}
                                />
                            </div>

                            {/* Tombol Cari */}
                            <div className="flex-shrink-0">
                                <button type="submit"
                                    className="h-full px-6 text-sm font-bold transition-colors"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF', minWidth: '80px' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                                    Cari
                                </button>
                            </div>
                        </div>

                        {/* Error validasi harga */}
                        {priceError && (
                            <div className="px-4 pb-3">
                                <p className="text-xs" style={{ color: '#C0392B' }}>{priceError}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* ── Kos Tersedia ─────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: '#2D1B18' }}>Kos Tersedia di Yogyakarta</h2>
                        <p className="text-sm mt-0.5" style={{ color: '#8C6B63' }}>
                            {featuredKos?.length > 0
                                ? `${featuredKos.length} kos terkurasi`
                                : 'Listing terkurasi, langsung dari pemilik'}
                        </p>
                    </div>
                    <Link href="/kos"
                        className="text-sm font-semibold transition-colors"
                        style={{ color: '#C0392B' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                        onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                        Lihat Semua →
                    </Link>
                </div>

                {featuredKos?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {featuredKos.map(kos => (
                            <KosCard key={kos.id} kos={kos} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-2xl"
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: '#F5EDE9' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#2D1B18' }}>Belum ada kos tersedia</p>
                        <p className="text-xs mt-1" style={{ color: '#8C6B63' }}>Tambahkan data kos melalui panel admin</p>
                    </div>
                )}
            </section>

            {/* ── Section Artikel ─────────────────────────────── */}
            <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE0DC' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-xl font-bold mb-5" style={{ color: '#2D1B18' }}>
                        Temukan Kos Idamanmu di AdaKamar.id
                    </h2>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#5C4A45' }}>
                        <p>
                            Kabar baik untuk kamu yang sedang mencari kos di Yogyakarta. <strong style={{ color: '#2D1B18' }}>AdaKamar.id</strong> hadir sebagai platform iklan kos terkurasi yang menghubungkan calon penyewa langsung dengan pemilik kos terpercaya di area Yogyakarta.
                        </p>
                        <p>
                            AdaKamar.id berkomitmen memberi kemudahan dalam menemukan kos yang sesuai kebutuhan. Semua listing yang tersedia di AdaKamar.id adalah kos yang telah <strong style={{ color: '#2D1B18' }}>bermitra resmi</strong> dan bukan listing sembarangan. Kamu bisa menelusuri informasi lengkap setiap kos, mulai dari foto, fasilitas, harga per tipe sewa, lokasi, hingga kontak pemilik, semuanya dalam satu halaman.
                        </p>
                        <p>
                            Tidak ada proses booking atau pembayaran online yang rumit. Setelah menemukan kos yang cocok, kamu cukup <strong style={{ color: '#2D1B18' }}>menghubungi pemilik kos langsung</strong> melalui nomor WhatsApp yang tercantum di listing. Prosesnya simpel, transparan, dan tanpa perantara.
                        </p>
                        <p>
                            Manfaatkan fitur pencarian dan filter AdaKamar.id untuk menyaring kos berdasarkan kecamatan, tipe kos (putra/putri/campur), tipe sewa (harian/bulanan/tahunan), dan rentang harga. Temukan kos idamanmu di Yogyakarta dengan mudah, langsung dari genggaman.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-7">
                        <a href="/kos"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                            Cari Kos Sekarang →
                        </a>
                    </div>
                </div>
            </section>

        </GuestLayout>
    );
}
