import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
        { name: 'Manajemen Kos', href: '/admin/kos', icon: '🏘️' },
        { name: 'Master Fasilitas', href: '/admin/facilities', icon: '🛠️' },
        { name: 'Ulasan', href: '/admin/reviews', icon: '⭐' },
        { name: 'Pengguna', href: '/admin/users', icon: '👥' },
        { name: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
        { name: 'Statistik', href: '/admin/statistics', icon: '📊' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center h-16 px-6 border-b border-gray-200">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        Adakamar.id
                    </Link>
                </div>

                {/* Nav */}
                <nav className="mt-4 px-3">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 truncate">{auth?.user?.email}</p>
                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        className="mt-1 text-xs text-red-500 hover:text-red-700"
                    >
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 mr-4 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        ☰
                    </button>
                    <h1 className="text-base font-semibold text-gray-800">{title}</h1>
                </header>

                {/* Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
