import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

function formatNumber(n) {
    if (n === null || n === undefined) return '0';
    return new Intl.NumberFormat('id-ID').format(n);
}

function StatCard({ label, value, icon, iconBg, iconColor, note }) {
    return (
        <div className="bg-white rounded-xl p-5 flex items-center gap-4"
            style={{ border: '1px solid #E2E8F0' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl"
                style={{ backgroundColor: iconBg, color: iconColor }}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold leading-tight" style={{ color: '#1E293B' }}>
                    {formatNumber(value)}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{label}</p>
                {note && <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{note}</p>}
            </div>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: '#64748B' }}>
            {children}
        </h3>
    );
}

function ProgressBar({ label, value, total, color }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{label}</span>
                <span className="text-sm font-bold" style={{ color: '#1E293B' }}>
                    {formatNumber(value)}
                    <span className="text-xs font-normal ml-1" style={{ color: '#64748B' }}>
                        ({pct}%)
                    </span>
                </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

export default function StatisticsIndex({ stats }) {
    const s = stats ?? {};

    return (
        <AdminLayout title="Statistik Platform">
            <Head title="Statistik Platform" />

            {/* Header */}
            <div className="mb-7">
                <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Statistik Platform</h2>
                <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                    Data real-time dari database platform
                </p>
            </div>

            {/* ── Ringkasan Properti ── */}
            <div className="mb-8">
                <SectionTitle>Ringkasan Properti</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Kos"    value={s.total_kos}   icon="🏘️" iconBg="#F0F7FF"  iconColor="#1E293B" />
                    <StatCard label="Kos Aktif"    value={s.active_kos}  icon="✅" iconBg="#F0FDF4"  iconColor="#16A34A" />
                    <StatCard label="Kos Nonaktif" value={s.inactive_kos} icon="⏸️" iconBg="#F5F5F5" iconColor="#9CA3AF" />
                    <StatCard label="Kos Plus Aktif" value={s.plus_kos}  icon="⭐" iconBg="#FEFBE8"  iconColor="#3B82F6" />
                </div>
            </div>

            {/* ── Properti per Tipe ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                    <SectionTitle>Properti per Tipe</SectionTitle>
                    <ProgressBar label="Putra"  value={s.kos_putra}  total={s.total_kos} color="#1D4ED8" />
                    <ProgressBar label="Putri"  value={s.kos_putri}  total={s.total_kos} color="#BE185D" />
                    <ProgressBar label="Campur" value={s.kos_campur} total={s.total_kos} color="#15803D" />
                </div>

                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0' }}>
                    <SectionTitle>Properti per Status</SectionTitle>
                    <ProgressBar label="Aktif"     value={s.active_kos}   total={s.total_kos} color="#16A34A" />
                    <ProgressBar label="Nonaktif"  value={s.inactive_kos} total={s.total_kos} color="#9CA3AF" />
                    <ProgressBar label="Berlabel Plus" value={s.plus_kos} total={s.total_kos} color="#3B82F6" />
                </div>
            </div>

            {/* ── Ulasan & Pengguna ── */}
            <div className="mb-8">
                <SectionTitle>Ulasan & Pengguna</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Ulasan"
                        value={s.total_reviews}
                        icon="💬"
                        iconBg="#EFF6FF"
                        iconColor="#2563EB"
                    />
                    <StatCard
                        label="Rating Rata-rata"
                        value={s.avg_rating_platform > 0 ? `${s.avg_rating_platform} ★` : '–'}
                        icon="⭐"
                        iconBg="#FEFBE8"
                        iconColor="#3B82F6"
                    />
                    <StatCard
                        label="Akun Guest"
                        value={s.total_guests}
                        icon="👤"
                        iconBg="#EFF6FF"
                        iconColor="#1D4ED8"
                    />
                    <StatCard
                        label="Total Views Kos"
                        value={s.total_views}
                        icon="👁️"
                        iconBg="#F0FDF4"
                        iconColor="#16A34A"
                    />
                </div>
            </div>

        </AdminLayout>
    );
}
