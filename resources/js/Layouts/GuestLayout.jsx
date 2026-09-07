import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { auth, appName } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            {appName ?? 'Adakamar.id'}
                        </Link>

                        {/* Nav links */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/kos" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                Cari Kos
                            </Link>
                            <Link href="/tentang" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                Tentang
                            </Link>
                        </nav>

                        {/* Auth */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">{auth.user.name}</span>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-sm text-gray-500 hover:text-red-500"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-bold text-lg">{appName ?? 'Adakamar.id'}</p>
                            <p className="text-sm mt-1">Platform iklan kos terpercaya area Yogyakarta</p>
                        </div>
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Adakamar.id
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
