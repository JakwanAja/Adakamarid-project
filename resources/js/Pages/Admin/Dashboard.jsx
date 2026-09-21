import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const KosIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ReviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export default function AdminDashboard({ stats, recent_kos, recent_reviews }) {
    const statCards = [
        {
            label: 'Kos Aktif',
            value: stats?.active_kos ?? 0,
            icon: <KosIcon />,
            iconBg: '#EFF6FF',
            iconColor: '#2563EB',
        },
        {
            label: 'Kos Plus',
            value: stats?.plus_kos ?? 0,
            icon: <StarIcon />,
            iconBg: '#FEFBE8',
            iconColor: '#3B82F6',
        },
        {
            label: 'Total Ulasan',
            value: stats?.total_reviews ?? 0,
            icon: <ReviewIcon />,
            iconBg: '#F0FDF4',
            iconColor: '#16A34A',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            {/* Greeting */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Selamat datang kembali 👋</h2>
                <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Berikut ringkasan aktivitas platform hari ini.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-xl p-5 flex items-center gap-4"
                        style={{ border: '1px solid #E2E8F0' }}
                    >
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                        >
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-tight" style={{ color: '#1E293B' }}>{card.value}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Recent Kos */}
                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: '#1E293B' }}>Kos Terbaru</h3>
                        <Link
                            href="/admin/kos"
                            className="text-xs font-medium transition-colors"
                            style={{ color: '#2563EB' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}
                        >
                            Lihat semua →
                        </Link>
                    </div>

                    {recent_kos?.length > 0 ? (
                        <ul className="space-y-3">
                            {recent_kos.map((kos, i) => (
                                <li key={kos.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                                            style={{ backgroundColor: '#F0F7FF', color: '#64748B' }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium truncate" style={{ color: '#1E293B' }}>{kos.name}</span>
                                    </div>
                                    <span
                                        className="text-xs ml-3 shrink-0 px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: '#F0F7FF', color: '#64748B' }}
                                    >
                                        {kos.district}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-center py-8 italic" style={{ color: '#64748B' }}>Belum ada data kos</p>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: '#1E293B' }}>Ulasan Terbaru</h3>
                        <Link
                            href="/admin/reviews"
                            className="text-xs font-medium transition-colors"
                            style={{ color: '#2563EB' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}
                        >
                            Lihat semua →
                        </Link>
                    </div>

                    {recent_reviews?.length > 0 ? (
                        <ul className="space-y-3">
                            {recent_reviews.map((review) => (
                                <li key={review.id} className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: '#1E293B' }}>{review.user?.name}</p>
                                        <p className="text-xs truncate mt-0.5" style={{ color: '#64748B' }}>{review.kos?.name}</p>
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0" style={{ color: '#2563EB' }}>
                                        {Array.from({ length: review.rating ?? 0 }).map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-center py-8 italic" style={{ color: '#64748B' }}>Belum ada ulasan</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
