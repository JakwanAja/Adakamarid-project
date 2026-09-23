import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthModal from '@/Components/Guest/AuthModal';

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [searchValue, setSearchValue] = useState('');
    const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

    function openModal(mode) {
        setAuthModal({ open: true, mode });
    }

    function closeModal() {
        setAuthModal({ open: false, mode: 'login' });
        if (window.location.hash === '#login' || window.location.hash === '#register') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }

    useEffect(() => {
        function checkHash() {
            if (window.location.hash === '#login')    setAuthModal({ open: true, mode: 'login' });
            else if (window.location.hash === '#register') setAuthModal({ open: true, mode: 'register' });
        }
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    function handleSearch(e) {
        e.preventDefault();
        if (!searchValue.trim()) return;
        window.location.href = `/kos?search=${encodeURIComponent(searchValue.trim())}`;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>

            {/* ── Navbar ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white"
                style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Mobile: 2 baris  |  Desktop: 1 baris */}

                    {/* Baris 1 — Logo + Nav links + Auth */}
                    <div className="flex items-center h-14 gap-3">

                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <img src="/image/logo.png" alt="AdaKamar.id"
                                className="h-8 w-auto object-contain" />
                        </Link>

                        {/* Search bar — hanya tampil di desktop di baris ini */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2">
                            <div className="flex items-center w-full rounded-lg overflow-hidden"
                                style={{ border: '1.5px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    placeholder="Masukan nama lokasi/area/alamat"
                                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                                    style={{ color: '#1E293B' }} />
                                <button type="submit"
                                    className="px-4 py-2 text-sm font-semibold transition-colors shrink-0"
                                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                                    Cari
                                </button>
                            </div>
                        </form>

                        {/* Spacer untuk mobile agar auth button ke kanan */}
                        <div className="flex-1 md:hidden" />

                        {/* Nav links desktop */}
                        <div className="hidden lg:flex items-center gap-1 shrink-0">
                            <Link href="/pusat-bantuan"
                                className="px-3 py-2 text-sm transition-colors rounded-lg"
                                style={{ color: '#64748B' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#1E293B'; e.currentTarget.style.backgroundColor = '#F0F7FF'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                Pusat Bantuan
                            </Link>
                            <Link href="/syarat-ketentuan"
                                className="px-3 py-2 text-sm transition-colors rounded-lg"
                                style={{ color: '#64748B' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#1E293B'; e.currentTarget.style.backgroundColor = '#F0F7FF'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                Syarat & Ketentuan
                            </Link>
                            <div className="w-px h-5 mx-1" style={{ backgroundColor: '#E2E8F0' }} />
                        </div>

                        {/* Auth */}
                        {auth?.user ? (
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]" style={{ color: '#1E293B' }}>
                                    {auth.user.name}
                                </span>
                                <Link href="/logout" method="post" as="button"
                                    className="px-3 py-1.5 text-sm rounded-lg transition-colors shrink-0"
                                    style={{ color: '#64748B' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                                    Keluar
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => openModal('login')}
                                className="shrink-0 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors"
                                style={{ border: '1.5px solid #2563EB', color: '#2563EB', backgroundColor: 'transparent', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                Masuk / Daftar
                            </button>
                        )}
                    </div>

                    {/* Baris 2 — Search bar mobile (hanya tampil di bawah md) */}
                    <div className="md:hidden pb-2.5">
                        <form onSubmit={handleSearch}>
                            <div className="flex items-center rounded-lg overflow-hidden"
                                style={{ border: '1.5px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    placeholder="Cari properti di Yogyakarta..."
                                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                                    style={{ color: '#1E293B' }} />
                                <button type="submit"
                                    className="px-4 py-2 text-sm font-semibold transition-colors shrink-0"
                                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer style={{ backgroundColor: '#1E293B' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <img src="/image/logo.png" alt="AdaKamar.id"
                                className="h-8 w-auto object-contain object-left mb-3"
                                style={{ filter: 'brightness(0) invert(1)' }} />
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.60)' }}>
                                Platform listing properti terkurasi untuk area Yogyakarta. Kos, Guesthouse, dan Villa, kontak langsung ke pemilik.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(248,250,252,0.40)' }}>Layanan</p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'Cari Kos',             href: '/kos' },
                                    { label: 'Pusat Bantuan',        href: '/pusat-bantuan' },
                                    { label: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
                                    { label: 'Waspada Penipuan',     href: '/waspada-penipuan' },
                                ].map(item => (
                                    <li key={item.label}>
                                        <a href={item.href} className="text-sm transition-colors"
                                            style={{ color: 'rgba(248,250,252,0.65)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,250,252,0.65)'}>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(248,250,252,0.40)' }}>Tentang</p>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.60)' }}>
                                AdaKamar.id adalah platform listing properti khusus area Yogyakarta. Seluruh listing dikelola oleh tim kami untuk memastikan informasi yang akurat dan terpercaya.
                            </p>
                        </div>
                    </div>
                    <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs" style={{ color: 'rgba(248,250,252,0.35)' }}>
                                &copy; {new Date().getFullYear()} AdaKamar.id - Let&apos;s Place, Let&apos;s Ease
                            </p>
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                {[
                                    { label: 'Pusat Bantuan',        href: '/pusat-bantuan' },
                                    { label: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
                                    { label: 'Waspada Penipuan',     href: '/waspada-penipuan' },
                                ].map(item => (
                                    <a key={item.label} href={item.href} className="text-xs transition-colors"
                                        style={{ color: 'rgba(248,250,252,0.35)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(248,250,252,0.75)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,250,252,0.35)'}>
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <AuthModal open={authModal.open} mode={authModal.mode} onClose={closeModal} />
        </div>
    );
}