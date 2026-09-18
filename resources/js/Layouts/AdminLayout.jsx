import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    dashboard: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    kos: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    facility: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    review: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
    users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    settings: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    statistics: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    logout: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
    menu: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    ),
    chevronRight: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    ),
};

// Nav groups — memisahkan menu berdasarkan fungsi
const navGroups = [
    {
        label: 'Utama',
        items: [
            { name: 'Dashboard',      href: '/admin/dashboard',   icon: icons.dashboard },
        ],
    },
    {
        label: 'Konten',
        items: [
            { name: 'Manajemen Kos',  href: '/admin/kos',         icon: icons.kos },
            { name: 'Fasilitas',      href: '/admin/facilities',   icon: icons.facility },
        ],
    },
    {
        label: 'Komunitas',
        items: [
            { name: 'Ulasan',         href: '/admin/reviews',      icon: icons.review },
            { name: 'Pengguna',       href: '/admin/users',        icon: icons.users },
        ],
    },
    {
        label: 'Sistem',
        items: [
            { name: 'Statistik',      href: '/admin/statistics',   icon: icons.statistics },
            { name: 'Pengaturan',     href: '/admin/settings',     icon: icons.settings },
        ],
    },
];

// Single nav item dengan left-accent style untuk item aktif
function NavItem({ item, active }) {
    return (
        <Link
            href={item.href}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
            style={{
                backgroundColor: active ? 'rgba(192,57,43,0.15)' : 'transparent',
                color: active ? '#FFFFFF' : 'rgba(245,237,233,0.65)',
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = '#F5EDE9';
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(245,237,233,0.65)';
                }
            }}
        >
            {/* Left accent bar untuk item aktif */}
            {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ backgroundColor: '#C0392B' }} />
            )}
            <span className="shrink-0" style={{ color: active ? '#F87171' : 'inherit' }}>
                {item.icon}
            </span>
            <span className="font-medium flex-1">{item.name}</span>
            {active && (
                <span style={{ color: 'rgba(248,113,113,0.5)' }}>{icons.chevronRight}</span>
            )}
        </Link>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (href) => currentUrl.startsWith(href);

    // Nama halaman aktif untuk topbar
    const activePageName = navGroups.flatMap(g => g.items).find(i => isActive(i.href))?.name ?? title;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F0EE' }}>

            {/* ── Sidebar ───────────────────────────────── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                style={{ backgroundColor: '#1E110F' }}
            >
                {/* Logo area */}
                <div className="flex items-center h-14 px-4 shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src="/image/logo.png" alt="AdaKamar.id"
                        className="h-8 w-auto object-contain object-left"
                        style={{ filter: 'brightness(0) invert(1)' }} />
                    <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(192,57,43,0.3)', color: '#F87171' }}>
                        Admin
                    </span>
                </div>

                {/* Nav dengan grouping */}
                <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest"
                                style={{ color: 'rgba(245,237,233,0.25)', letterSpacing: '0.08em' }}>
                                {group.label}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map(item => (
                                    <NavItem key={item.href} item={item} active={isActive(item.href)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* User card */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: '#C0392B', color: '#fff' }}>
                            {auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate leading-tight"
                                style={{ color: '#F5EDE9' }}>
                                {auth?.user?.name ?? 'Admin'}
                            </p>
                            <p className="text-xs truncate leading-tight"
                                style={{ color: 'rgba(245,237,233,0.38)' }}>
                                {auth?.user?.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/logout" method="post" as="button"
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors"
                        style={{ color: 'rgba(245,237,233,0.45)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(192,57,43,0.15)'; e.currentTarget.style.color = '#F87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(245,237,233,0.45)'; }}
                    >
                        {icons.logout}
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Main Content ──────────────────────────── */}
            <div className="lg:pl-60 flex flex-col min-h-screen">

                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6"
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid #EAE0DC',
                        boxShadow: '0 1px 3px rgba(45,27,24,0.05)',
                    }}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)}
                            className="p-1.5 rounded-lg lg:hidden transition-colors"
                            style={{ color: '#8C6B63' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            {icons.menu}
                        </button>
                        <h1 className="text-sm font-semibold" style={{ color: '#2D1B18' }}>
                            {activePageName}
                        </h1>
                    </div>

                    {/* Link ke public site */}
                    <a href="/" target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg"
                        style={{ color: '#8C6B63', border: '1px solid #EAE0DC' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#C0392B'; e.currentTarget.style.borderColor = '#C0392B'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#8C6B63'; e.currentTarget.style.borderColor = '#EAE0DC'; }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat Website
                    </a>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}