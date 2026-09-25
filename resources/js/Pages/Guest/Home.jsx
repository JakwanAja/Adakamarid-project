import GuestLayout from '@/Layouts/GuestLayout';
import KosCard from '@/Components/Guest/KosCard';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { POPULAR_AREAS, CAMPUS_LIST } from '@/Components/Shared/AreaData';

function ChevronDown() {
    return (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }}>
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
            style={{ minWidth: '120px', border: `1px solid ${focused ? '#2563EB' : '#CBD5E1'}`, transition: 'border-color 0.15s' }}>
            <span className="pl-3 text-sm shrink-0 select-none" style={{ color: '#64748B' }}>Rp</span>
            <input type="number" min="0" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
                style={{ padding: '11px 8px', color: '#1E293B' }}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        </div>
    );
}

function SectionHeader({ title, subtitle, href, hrefLabel }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>{title}</h2>
                {subtitle && <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{subtitle}</p>}
            </div>
            {href && (
                <Link href={href} className="text-sm font-semibold transition-colors" style={{ color: '#2563EB' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                    {hrefLabel ?? 'Lihat Semua'} &rarr;
                </Link>
            )}
        </div>
    );
}

// ── HistorySection ────────────────────────────────────────────
function HistorySection() {
    const [historyKos, setHistoryKos] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('kos_history');
            if (!raw) { setLoaded(true); return; }
            const ids = JSON.parse(raw);
            if (!Array.isArray(ids) || ids.length === 0) { setLoaded(true); return; }
            const xsrf = decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');
            fetch('/api/kos/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-XSRF-TOKEN': xsrf },
                body: JSON.stringify({ ids }),
            })
                .then(r => r.ok ? r.json() : [])
                .then(data => setHistoryKos(Array.isArray(data) ? data : []))
                .catch(() => {})
                .finally(() => setLoaded(true));
        } catch { setLoaded(true); }
    }, []);

    if (!loaded || historyKos.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10"
            style={{ borderTop: '1px solid #E2E8F0', paddingTop: '32px' }}>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Terakhir Kamu Lihat</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Lanjutkan pencarian properti yang sudah kamu buka</p>
                </div>
                <button onClick={() => { localStorage.removeItem('kos_history'); setHistoryKos([]); }}
                    className="text-xs transition-colors px-3 py-1.5 rounded-lg"
                    style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#2563EB'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
                    Hapus Riwayat
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {historyKos.map(kos => <KosCard key={kos.id} kos={kos} />)}
            </div>
        </section>
    );
}

// ── AreaSidebar — Kampus (atas) + Area Populer (bawah), tanpa tab toggle ─
function AreaSidebar() {
    function handleAreaClick(item) {
        const districts = item.districts.join(',');
        window.location.href = `/kos?districts=${encodeURIComponent(districts)}&area_label=${encodeURIComponent(item.label)}`;
    }

    const ItemBtn = ({ onClick, icon, children }) => (
        <button onClick={onClick}
            className="w-full flex items-center gap-2 px-4 py-1.5 text-left transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            {icon}
            {children}
        </button>
    );

    return (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>

            {/* ── Kampus ── */}
            <div style={{ borderBottom: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9h20L12 3zm-7 6v9h4v-5h6v5h4V9" />
                    </svg>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2563EB', letterSpacing: '0.07em' }}>Kampus</p>
                </div>
                <div className="py-1.5 max-h-48 overflow-y-auto">
                    {CAMPUS_LIST.map(campus => (
                        <ItemBtn key={campus.key} onClick={() => handleAreaClick(campus)}
                            icon={<span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#CBD5E1' }} />}>
                            <span className="text-xs truncate" style={{ color: '#334155' }}>{campus.label}</span>
                        </ItemBtn>
                    ))}
                </div>
            </div>

            {/* ── Area Populer ── */}
            <div style={{ marginTop: '8px', borderTop: '2px solid #E2E8F0' }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2563EB', letterSpacing: '0.07em' }}>Area Populer</p>
                </div>
                <div className="py-1.5">
                    {POPULAR_AREAS.map(area => (
                        <ItemBtn key={area.key} onClick={() => handleAreaClick(area)}
                            icon={<span className="w-1 h-1 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: '#CBD5E1' }} />}>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold leading-tight" style={{ color: '#334155' }}>{area.label}</p>
                                <p className="text-xs truncate leading-tight" style={{ color: '#94A3B8' }}>{area.description}</p>
                            </div>
                        </ItemBtn>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-3 pb-3 pt-1.5" style={{ borderTop: '1px solid #E2E8F0' }}>
                <a href="/kos"
                    className="block text-center text-xs font-semibold py-2 rounded-xl transition-colors"
                    style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                    Lihat semua properti &rarr;
                </a>
            </div>
        </div>
    );
}

// ── HowToSection ──────────────────────────────────────────────
const HOW_TO_STEPS = [
    { number: '01', title: 'Temukan Properti yang Cocok', desc: 'Gunakan fitur pencarian dan filter untuk menemukan properti yang sesuai lokasi, tipe, dan budget kamu.', bubble: 'Kamu: "Saya tertarik dengan properti ini, apakah masih tersedia?"', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { number: '02', title: 'Cek Info & Fasilitas', desc: 'Lihat foto, fasilitas, harga sewa, lokasi di peta, dan ulasan dari penghuni sebelumnya.', bubble: 'Kamu: "Ada berapa kamar tersisa dan kapan bisa survey?"', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { number: '03', title: 'Hubungi Pemilik via WhatsApp', desc: 'Klik tombol WhatsApp di halaman detail properti. Negosiasi dan konfirmasi ketersediaan langsung dengan pemilik.', bubble: 'Pemilik: "Masih tersedia, Kak. Silakan survey kapan saja."', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { number: '04', title: 'Pindah & Tinggal Nyaman', desc: 'Setelah deal dengan pemilik, lakukan pembayaran langsung dan nikmati properti barumu di Yogyakarta.', bubble: 'Pemilik: "Deal! Silakan transfer DP ke rekening berikut..."', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
];

function HowToSection() {
    return (
        <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                        style={{ backgroundColor: '#EFF6FF', color: '#2563EB', letterSpacing: '0.12em' }}>Cara Pesan</span>
                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3" style={{ color: '#1E293B' }}>
                        Cari properti cuma 4 langkah,<br className="hidden sm:block" /> semua lewat WhatsApp
                    </h2>
                    <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: '#64748B' }}>
                        Gak perlu ribet, tinggal pilih properti yang sudah terdaftar di AdaKamar.id dan hubungi langsung pemiliknya.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {HOW_TO_STEPS.map((step, idx) => (
                        <div key={step.number} className="relative flex flex-col gap-4">
                            <div className="absolute -top-3 -right-1 text-6xl font-black select-none pointer-events-none"
                                style={{ color: '#F0F7FF', lineHeight: 1, zIndex: 0 }}>{step.number}</div>
                            <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
                                {step.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: '#1E293B' }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>{step.desc}</p>
                                <div className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed italic"
                                    style={{ backgroundColor: '#F0F7FF', color: '#64748B', border: '1px solid #E2E8F0' }}>{step.bubble}</div>
                            </div>
                            {idx < HOW_TO_STEPS.length - 1 && (
                                <div className="hidden lg:flex absolute top-5 -right-5 z-20 items-center justify-center w-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#CBD5E1" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Home({ featuredKos, promotedKos, totalKos, districts }) {
    const [filterBar, setFilterBar] = useState({
        district: '', type: '', price_type: '', price_min: '', price_max: '',
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
            <Head title="Temukan Properti di Yogyakarta" />

            {/* ── Hero + Filter ─────────────────────────────── */}
            <div className="relative">
                <section className="relative flex flex-col items-center justify-center text-center px-4"
                    style={{ minHeight: '220px', backgroundImage: 'url(/image/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(15,23,42,0.62)' }} />
                    <div className="relative z-10 max-w-2xl mx-auto" style={{ paddingBottom: '48px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold leading-snug" style={{ color: '#FFFFFF' }}>
                            Cari Kamar Jadi Gampang, Semua di Adakamar.
                        </h1>
                    </div>
                </section>
                <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6" style={{ marginTop: '-44px' }}>
                    <form onSubmit={handleFilterSubmit}>
                        <div className="bg-white rounded-2xl px-5 py-5"
                            style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.12)', border: '1px solid #E2E8F0' }}>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1" style={{ minWidth: '170px' }}>
                                    <select value={filterBar.district} onChange={e => setFilterBar(p => ({ ...p, district: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{ padding: '11px 36px 11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', color: filterBar.district ? '#1E293B' : '#64748B', cursor: 'pointer' }}
                                        onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#CBD5E1'}>
                                        <option value="">Semua Kecamatan</option>
                                        {districts?.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown />
                                </div>
                                <div className="relative" style={{ minWidth: '130px' }}>
                                    <select value={filterBar.type} onChange={e => setFilterBar(p => ({ ...p, type: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{ padding: '11px 36px 11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', color: filterBar.type ? '#1E293B' : '#64748B', cursor: 'pointer' }}
                                        onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#CBD5E1'}>
                                        <option value="">Semua Tipe</option>
                                        <option value="putra">Kos Putra</option>
                                        <option value="putri">Kos Putri</option>
                                        <option value="campur">Kos Campur</option>
                                        <option value="guesthouse">Guesthouse</option>
                                        <option value="villa">Villa</option>
                                    </select>
                                    <ChevronDown />
                                </div>
                                <div className="relative" style={{ minWidth: '130px' }}>
                                    <select value={filterBar.price_type} onChange={e => setFilterBar(p => ({ ...p, price_type: e.target.value }))}
                                        className="w-full outline-none appearance-none bg-white text-sm"
                                        style={{ padding: '11px 36px 11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#1E293B', cursor: 'pointer' }}
                                        onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#CBD5E1'}>
                                        <option value="">Semua Sewa</option>
                                        <option value="harian">Harian</option>
                                        <option value="bulanan">Bulanan</option>
                                        <option value="tahunan">Tahunan</option>
                                    </select>
                                    <ChevronDown />
                                </div>
                                <PriceInput value={filterBar.price_min} onChange={v => setFilterBar(p => ({ ...p, price_min: v }))} placeholder="0" />
                                <span className="shrink-0 text-sm font-medium select-none" style={{ color: '#64748B' }}>-</span>
                                <PriceInput value={filterBar.price_max} onChange={v => setFilterBar(p => ({ ...p, price_max: v }))} placeholder="15.000.000" />
                                <button type="submit" className="shrink-0 text-sm font-bold rounded-lg transition-colors"
                                    style={{ padding: '11px 24px', backgroundColor: '#2563EB', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                                    Set
                                </button>
                            </div>
                            {priceError && <p className="text-xs mt-2" style={{ color: '#C0392B' }}>{priceError}</p>}
                        </div>
                    </form>
                </div>
            </div>

            <div style={{ height: '28px' }} />

            {/*
                ── Rekomendasi AdaKamar + Sidebar ────────────────
                Desktop: listing 3 kolom (flex-1) | sidebar area (w-72)
                Mobile:  listing full width, sidebar turun ke bawah
            */}
            {hasPromoted && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* Listing rekomendasi — 3 kolom desktop */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Rekomendasi AdaKamar</h2>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                        style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Dipilih langsung oleh tim AdaKamar.id
                                    </span>
                                </div>
                                <Link href="/kos" className="text-sm font-semibold transition-colors shrink-0 ml-2"
                                    style={{ color: '#2563EB' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                                    Lihat Semua &rarr;
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {promotedKos.map(kos => <KosCard key={kos.id} kos={kos} />)}
                            </div>
                        </div>

                        {/* Sidebar Lokasi — sticky */}
                        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
                            <AreaSidebar />
                        </aside>

                    </div>
                </section>
            )}

            {/* ── Properti Tersedia — full width ─────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
                style={hasPromoted ? { borderTop: '1px solid #E2E8F0', paddingTop: '32px' } : {}}>
                <SectionHeader
                    title="Properti Tersedia di Yogyakarta"
                    subtitle={totalKos > 0 ? `${totalKos} properti tersedia di Yogyakarta` : 'Kos, Guesthouse, Villa pilihan di Yogyakarta'}
                    href="/kos"
                    hrefLabel="Lihat Semua"
                />
                {featuredKos?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {featuredKos.map(kos => <KosCard key={kos.id} kos={kos} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F0F7FF' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Belum ada properti tersedia</p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>Tambahkan data properti melalui panel admin</p>
                    </div>
                )}
            </section>

            {/* ── Terakhir Kamu Lihat ───────────────────────── */}
            <HistorySection />

            {/* ── Cara Pesan ───────────────────────────────── */}
            <HowToSection />

        </GuestLayout>
    );
}