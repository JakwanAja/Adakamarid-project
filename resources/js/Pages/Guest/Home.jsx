import GuestLayout from '@/Layouts/GuestLayout';
import KosCard from '@/Components/Guest/KosCard';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ── Shared UI helpers ─────────────────────────────────────────
function ChevronDown() {
    return (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#8C6B63' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

function PriceInput({ value, onChange, placeholder }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="flex items-center flex-1 rounded-lg"
            style={{
                minWidth: '120px',
                border: `1px solid ${focused ? '#C0392B' : '#D1C8C4'}`,
                transition: 'border-color 0.15s',
            }}>
            <span className="pl-3 text-sm shrink-0 select-none" style={{ color: '#8C6B63' }}>Rp</span>
            <input
                type="number" min="0"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
                style={{ padding: '11px 8px', color: '#2D1B18' }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    );
}

// ── Section header helper ─────────────────────────────────────
function SectionHeader({ title, subtitle, href, hrefLabel }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h2 className="text-lg font-bold" style={{ color: '#2D1B18' }}>{title}</h2>
                {subtitle && (
                    <p className="text-sm mt-0.5" style={{ color: '#8C6B63' }}>{subtitle}</p>
                )}
            </div>
            {href && (
                <Link href={href}
                    className="text-sm font-semibold transition-colors"
                    style={{ color: '#C0392B' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                    onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                    {hrefLabel ?? 'Lihat Semua'} &rarr;
                </Link>
            )}
        </div>
    );
}

// ── KosGrid helper ────────────────────────────────────────────
function KosGrid({ items }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(kos => <KosCard key={kos.id} kos={kos} />)}
        </div>
    );
}

// ── NearbySection ─────────────────────────────────────────────
function NearbySection() {
    const [state, setState]        = useState('idle');
    const [nearbyKos, setNearby]   = useState([]);
    const [historyKos, setHistory] = useState([]);
    const [detectedDistrict, setDetectedDistrict] = useState('');
    const requested = useRef(false);

    useEffect(() => {
        const raw = localStorage.getItem('kos_history');
        if (!raw) return;
        try {
            const ids = JSON.parse(raw);
            if (!Array.isArray(ids) || ids.length === 0) return;
            fetch('/api/kos/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({ ids }),
            })
                .then(r => r.json())
                .then(data => setHistory(Array.isArray(data) ? data : []))
                .catch(() => {});
        } catch {}
    }, []);

    function requestLocation() {
        if (requested.current) return;
        requested.current = true;
        if (!navigator.geolocation) { setState('denied'); return; }
        setState('requesting');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState('loading');
                const { latitude, longitude } = pos.coords;
                fetch(`/api/kos/nearby?lat=${latitude}&lng=${longitude}&limit=6`)
                    .then(r => r.json())
                    .then(data => {
                        if (data?.district_detected) setDetectedDistrict(data.district_detected);
                        const kos = Array.isArray(data?.kos) ? data.kos : [];
                        if (kos.length === 0) setState(data?.no_match ? 'no_match' : 'empty');
                        else { setNearby(kos); setState('done'); }
                    })
                    .catch(() => setState('empty'));
            },
            () => setState('denied'),
            { timeout: 10000 }
        );
    }

    const hasHistory = historyKos.length > 0;
    const loadingLabel = state === 'requesting' ? 'Menunggu izin lokasi...' : 'Mendeteksi kecamatan dan mencari kos...';

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                style={{ borderTop: '1px solid #EAE0DC' }}>
                <SectionHeader
                    title="Kos di Sekitarmu"
                    subtitle={state === 'done' ? `Kos di kecamatan ${detectedDistrict}` : 'Izinkan lokasi untuk melihat kos di kecamatanmu'}
                />
                {state === 'idle' && (
                    <div className="rounded-2xl p-8 flex flex-col items-center text-center"
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#F5EDE9' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#C0392B" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium mb-1" style={{ color: '#2D1B18' }}>Temukan kos di kecamatanmu</p>
                        <p className="text-xs mb-5 max-w-xs" style={{ color: '#8C6B63' }}>
                            Aktifkan lokasi untuk melihat kos yang tersedia di kecamatan tempat kamu berada sekarang
                        </p>
                        <button onClick={requestLocation}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Aktifkan Lokasi
                        </button>
                    </div>
                )}
                {['requesting', 'loading'].includes(state) && (
                    <div className="rounded-2xl p-8 flex flex-col items-center text-center"
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                        <div className="w-10 h-10 rounded-full border-2 animate-spin mb-4"
                            style={{ borderColor: '#EAE0DC', borderTopColor: '#C0392B' }} />
                        <p className="text-sm" style={{ color: '#8C6B63' }}>{loadingLabel}</p>
                    </div>
                )}
                {state === 'done' && <KosGrid items={nearbyKos} />}
                {state === 'empty' && (
                    <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                        <p className="text-sm font-medium mb-1" style={{ color: '#2D1B18' }}>Belum ada kos di {detectedDistrict || 'area ini'}</p>
                        <p className="text-xs" style={{ color: '#8C6B63' }}>Coba cari kos di kecamatan lain melalui menu Cari Kos</p>
                    </div>
                )}
                {state === 'no_match' && (
                    <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                        <p className="text-sm font-medium mb-1" style={{ color: '#2D1B18' }}>Lokasimu berada di luar area Yogyakarta</p>
                        <p className="text-xs" style={{ color: '#8C6B63' }}>AdaKamar.id melayani area Kota Yogyakarta, Sleman, dan Bantul</p>
                    </div>
                )}
                {state === 'denied' && null}
            </section>

            {hasHistory && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <SectionHeader title="Terakhir Kamu Lihat" subtitle="Kos yang pernah kamu buka sebelumnya" />
                    <KosGrid items={historyKos} />
                </section>
            )}
        </>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Home({ featuredKos, promotedKos, districts }) {
    const [filterBar, setFilterBar] = useState({
        district: '', type: '', price_type: 'bulanan', price_min: '', price_max: '',
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

    const hasPromoted = promotedKos?.length > 0;

    return (
        <GuestLayout>
            <Head title="Temukan Kos di Yogyakarta" />

            {/* ── Hero pendek + Filter card overlap ─────────
                Struktur identik Mamikos:
                - Hero ~220px, teks di tengah atas
                - Filter card dengan negative margin -36px
                  sehingga memotong batas hero dan konten
            */}
            <div className="relative">

                {/* Hero */}
                <section
                    className="relative flex flex-col items-center justify-center text-center px-4"
                    style={{
                        minHeight: '220px',
                        backgroundImage: 'url(/image/hero.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                >
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(45,27,24,0.62)' }} />
                    <div className="relative z-10 max-w-2xl mx-auto" style={{ paddingBottom: '48px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold leading-snug" style={{ color: '#FFFFFF' }}>
                            Temukan Kos Terbaik di Yogyakarta
                        </h1>
                        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                            Listing pilihan, informasi lengkap, langsung hubungi pemilik
                        </p>
                    </div>
                </section>

                {/* Filter Card — float di atas batas hero */}
                <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6" style={{ marginTop: '-44px' }}>
                    <form onSubmit={handleFilterSubmit}>
                        <div className="bg-white rounded-2xl px-5 py-5"
                            style={{ boxShadow: '0 8px 32px rgba(45,27,24,0.14)', border: '1px solid #EAE0DC' }}>

                            <div className="flex flex-wrap items-center gap-3">

                                {/* Kecamatan */}
                                <div className="relative flex-1" style={{ minWidth: '170px' }}>
                                    <select
                                        value={filterBar.district}
                                        onChange={e => setFilterBar(p => ({ ...p, district: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{
                                            padding: '11px 36px 11px 14px',
                                            border: '1px solid #D1C8C4',
                                            borderRadius: '8px',
                                            color: filterBar.district ? '#2D1B18' : '#8C6B63',
                                            cursor: 'pointer',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C0392B'}
                                        onBlur={e => e.target.style.borderColor = '#D1C8C4'}
                                    >
                                        <option value="">Semua Kota</option>
                                        {districts?.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown />
                                </div>

                                {/* Tipe Kos */}
                                <div className="relative" style={{ minWidth: '130px' }}>
                                    <select
                                        value={filterBar.type}
                                        onChange={e => setFilterBar(p => ({ ...p, type: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{
                                            padding: '11px 36px 11px 14px',
                                            border: '1px solid #D1C8C4',
                                            borderRadius: '8px',
                                            color: filterBar.type ? '#2D1B18' : '#8C6B63',
                                            cursor: 'pointer',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C0392B'}
                                        onBlur={e => e.target.style.borderColor = '#D1C8C4'}
                                    >
                                        <option value="">Semua</option>
                                        <option value="putra">Putra</option>
                                        <option value="putri">Putri</option>
                                        <option value="campur">Campur</option>
                                    </select>
                                    <ChevronDown />
                                </div>

                                {/* Tipe Sewa */}
                                <div className="relative" style={{ minWidth: '130px' }}>
                                    <select
                                        value={filterBar.price_type}
                                        onChange={e => setFilterBar(p => ({ ...p, price_type: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{
                                            padding: '11px 36px 11px 14px',
                                            border: '1px solid #D1C8C4',
                                            borderRadius: '8px',
                                            color: '#2D1B18',
                                            cursor: 'pointer',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C0392B'}
                                        onBlur={e => e.target.style.borderColor = '#D1C8C4'}
                                    >
                                        <option value="">Semua Sewa</option>
                                        <option value="harian">Harian</option>
                                        <option value="bulanan">Bulanan</option>
                                        <option value="tahunan">Tahunan</option>
                                    </select>
                                    <ChevronDown />
                                </div>

                                {/* Harga min */}
                                <PriceInput
                                    value={filterBar.price_min}
                                    onChange={v => setFilterBar(p => ({ ...p, price_min: v }))}
                                    placeholder="0"
                                />

                                <span className="shrink-0 text-sm font-medium select-none" style={{ color: '#8C6B63' }}>–</span>

                                {/* Harga maks */}
                                <PriceInput
                                    value={filterBar.price_max}
                                    onChange={v => setFilterBar(p => ({ ...p, price_max: v }))}
                                    placeholder="15.000.000"
                                />

                                {/* Tombol Set */}
                                <button
                                    type="submit"
                                    className="shrink-0 text-sm font-bold rounded-lg transition-colors"
                                    style={{ padding: '11px 24px', backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}
                                >
                                    Set
                                </button>
                            </div>

                            {priceError && (
                                <p className="text-xs mt-2" style={{ color: '#C0392B' }}>{priceError}</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Spacer antara filter card dan section listing */}
            <div style={{ height: '28px' }} />

            {/* ── Rekomendasi AdaKamar (Promoted) ─────────── */}
            {hasPromoted && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <SectionHeader
                        title="Rekomendasi AdaKamar"
                        href="/kos"
                        hrefLabel="Lihat Semua"
                    />
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Dipilih langsung oleh tim AdaKamar.id
                        </span>
                    </div>
                    <KosGrid items={promotedKos} />
                </section>
            )}

            {/* ── Kos Tersedia ─────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
                style={hasPromoted ? { borderTop: '1px solid #EAE0DC', paddingTop: '32px' } : {}}>
                <SectionHeader
                    title="Kos Tersedia di Yogyakarta"
                    subtitle={featuredKos?.length > 0 ? `${featuredKos.length} kos bisa kamu cek` : 'Listing pilihan, langsung dari pemilik'}
                    href="/kos"
                    hrefLabel="Lihat Semua"
                />
                {featuredKos?.length > 0 ? (
                    <KosGrid items={featuredKos} />
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

            {/* ── Kos di Sekitarmu + Riwayat ───────────────── */}
            <NearbySection />

            {/* ── Artikel ──────────────────────────────────── */}
            <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE0DC' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-xl font-bold mb-5" style={{ color: '#2D1B18' }}>
                        Temukan Kos Idamanmu di AdaKamar.id
                    </h2>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#5C4A45' }}>
                        <p>
                            Kabar baik untuk kamu yang sedang mencari kos di Yogyakarta. <strong style={{ color: '#2D1B18' }}>AdaKamar.id</strong> hadir sebagai platform iklan kos yang menghubungkan calon penyewa langsung dengan pemilik kos terpercaya di area Yogyakarta.
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
                    <div className="mt-7">
                        <a href="/kos"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                            Cari Kos Sekarang &rarr;
                        </a>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}