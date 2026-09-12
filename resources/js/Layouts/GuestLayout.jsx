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
        // Hapus hash dari URL tanpa reload
        if (window.location.hash === '#login' || window.location.hash === '#register') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }

    // Buka modal dari URL hash (misal dari link "Login" di halaman detail kos)
    useEffect(() => {
        function checkHash() {
            if (window.location.hash === '#login') {
                setAuthModal({ open: true, mode: 'login' });
            } else if (window.location.hash === '#register') {
                setAuthModal({ open: true, mode: 'register' });
            }
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
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FBF7F5' }}>

            {/* ── Navbar ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white"
                style={{ borderBottom: '1px solid #EAE0DC', boxShadow: '0 1px 4px rgba(45,27,24,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">

                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <img src="/image/logo.png" alt="AdaKamar.id"
                                className="h-8 w-auto object-contain" />
                        </Link>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
                            <div className="flex items-center rounded-lg overflow-hidden"
                                style={{ border: '1.5px solid #EAE0DC', backgroundColor: '#FFFFFF' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    placeholder="Masukan nama lokasi/area/alamat"
                                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                                    style={{ color: '#2D1B18' }}
                                />
                                <button type="submit"
                                    className="px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                                    Cari
                                </button>
                            </div>
                        </form>

                        {/* Nav links + Auth */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Link href="/pusat-bantuan"
                                className="hidden lg:block px-3 py-2 text-sm transition-colors rounded-lg"
                                style={{ color: '#8C6B63' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#2D1B18'; e.currentTarget.style.backgroundColor = '#F5EDE9'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#8C6B63'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                Pusat Bantuan
                            </Link>

                            <Link href="/syarat-ketentuan"
                                className="hidden lg:block px-3 py-2 text-sm transition-colors rounded-lg"
                                style={{ color: '#8C6B63' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#2D1B18'; e.currentTarget.style.backgroundColor = '#F5EDE9'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#8C6B63'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                Syarat dan Ketentuan
                            </Link>

                            <div className="hidden lg:block w-px h-5 mx-1" style={{ backgroundColor: '#EAE0DC' }} />

                            {/* Auth */}
                            {auth?.user ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium" style={{ color: '#2D1B18' }}>
                                        {auth.user.name}
                                    </span>
                                    <Link href="/logout" method="post" as="button"
                                        className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                                        style={{ color: '#8C6B63' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#C0392B'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#8C6B63'}>
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {/* Masuk — buka modal */}
                                    <button
                                        onClick={() => openModal('login')}
                                        className="px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                                        style={{ color: '#2D1B18' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#C0392B'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#2D1B18'}>
                                        Masuk
                                    </button>
                                    {/* Daftar — buka modal */}
                                    <button
                                        onClick={() => openModal('register')}
                                        className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                                        style={{ border: '1.5px solid #C0392B', color: '#C0392B', backgroundColor: 'transparent' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F0'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        Daftar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer style={{ backgroundColor: '#2D1B18' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <img src="/image/logo.png" alt="AdaKamar.id"
                                className="h-8 w-auto object-contain object-left mb-3"
                                style={{ filter: 'brightness(0) invert(1)' }} />
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,237,233,0.55)' }}>
                                Platform iklan kos terkurasi untuk area Yogyakarta. Informasi lengkap, kontak langsung ke pemilik.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-4"
                                style={{ color: 'rgba(245,237,233,0.4)' }}>
                                Layanan
                            </p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'Cari Kos',             href: '/kos' },
                                    { label: 'Pusat Bantuan',        href: '/pusat-bantuan' },
                                    { label: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
                                    { label: 'Waspada Penipuan',     href: '/waspada-penipuan' },
                                ].map(item => (
                                    <li key={item.label}>
                                        <a href={item.href}
                                            className="text-sm transition-colors"
                                            style={{ color: 'rgba(245,237,233,0.6)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#FBF7F5'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,233,0.6)'}>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-4"
                                style={{ color: 'rgba(245,237,233,0.4)' }}>
                                Tentang
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,237,233,0.55)' }}>
                                AdaKamar.id adalah platform iklan kos khusus area Yogyakarta. Seluruh listing dikelola oleh tim kami untuk memastikan informasi yang akurat dan terpercaya.
                            </p>
                        </div>
                    </div>
                    <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs" style={{ color: 'rgba(245,237,233,0.35)' }}>
                                &copy; {new Date().getFullYear()} AdaKamar.id - Let's Place, Let's Ease
                            </p>
                            <div className="flex items-center gap-4">
                                {[
                                    { label: 'Pusat Bantuan',        href: '/pusat-bantuan' },
                                    { label: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
                                    { label: 'Waspada Penipuan',     href: '/waspada-penipuan' },
                                ].map(item => (
                                    <a key={item.label} href={item.href}
                                        className="text-xs transition-colors"
                                        style={{ color: 'rgba(245,237,233,0.35)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,237,233,0.7)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,233,0.35)'}>
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── Auth Modal ─────────────────────────────────── */}
            <AuthModal
                open={authModal.open}
                mode={authModal.mode}
                onClose={closeModal}
            />
        </div>
    );
}
