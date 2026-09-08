import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const TYPE_LABELS = { putra: 'Putra', putri: 'Putri', campur: 'Campur' };
const TYPE_COLORS = {
    putra:  { bg: '#EFF6FF', text: '#1D4ED8' },
    putri:  { bg: '#FDF2F8', text: '#BE185D' },
    campur: { bg: '#F0FDF4', text: '#15803D' },
};

function ToggleSwitch({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={onChange}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
            style={{ backgroundColor: checked ? '#C0392B' : '#D1D5DB' }}
        >
            <span
                className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
                style={{ marginLeft: checked ? '18px' : '2px' }}
            />
        </button>
    );
}

// ── KosDetailModal ────────────────────────────────────────────
function KosDetailModal({ kos, onClose }) {
    // Escape key handler
    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    if (!kos) return null;

    const typeLabel = { putra: 'Putra', putri: 'Putri', campur: 'Campur' }[kos.type] ?? kos.type;
    const typeColor = {
        putra:  { bg: '#EFF6FF', text: '#1D4ED8' },
        putri:  { bg: '#FDF2F8', text: '#BE185D' },
        campur: { bg: '#F0FDF4', text: '#15803D' },
    }[kos.type] ?? { bg: '#F5F5F5', text: '#666' };

    function InfoRow({ label, value }) {
        if (!value) return null;
        return (
            <div className="flex gap-3 py-2.5" style={{ borderBottom: '1px solid #EAE0DC' }}>
                <span className="text-xs font-medium w-36 shrink-0 mt-0.5" style={{ color: '#8C6B63' }}>{label}</span>
                <span className="text-sm flex-1" style={{ color: '#2D1B18' }}>{value}</span>
            </div>
        );
    }

    function Badge({ active, label }) {
        return (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                style={{
                    backgroundColor: active ? '#F0FDF4' : '#F5F5F5',
                    color: active ? '#16A34A' : '#9CA3AF',
                }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: active ? '#16A34A' : '#9CA3AF' }} />
                {label}
            </span>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
                style={{ border: '1px solid #EAE0DC' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start gap-3 p-5 shrink-0" style={{ borderBottom: '1px solid #EAE0DC' }}>
                    {/* Foto utama */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: '#F5EDE9', border: '1px solid #EAE0DC' }}>
                        {kos.primary_photo ? (
                            <img src={`/storage/${kos.primary_photo.path}`} alt={kos.name}
                                className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold truncate" style={{ color: '#2D1B18' }}>
                                {kos.name}
                            </h3>
                            {kos.is_plus && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                                    style={{ backgroundColor: '#FEF2F0', color: '#C0392B' }}>Plus</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}>
                                {typeLabel}
                            </span>
                            <Badge active={kos.is_active} label={kos.is_active ? 'Aktif' : 'Nonaktif'} />
                            <span className="text-xs" style={{ color: '#8C6B63' }}>{kos.district}</span>
                        </div>
                    </div>

                    {/* Close button */}
                    <button onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors shrink-0"
                        style={{ color: '#8C6B63' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5EDE9'; e.currentTarget.style.color = '#2D1B18'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Informasi umum */}
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8C6B63' }}>
                            Informasi Umum
                        </p>
                        <InfoRow label="Alamat" value={kos.address} />
                        <InfoRow label="Kecamatan" value={kos.district} />
                        <InfoRow label="Koordinat" value={kos.latitude && kos.longitude ? `${kos.latitude}, ${kos.longitude}` : null} />
                        <InfoRow label="Kontak" value={kos.contact_name} />
                        <InfoRow label="WhatsApp" value={kos.contact_whatsapp ? `+62${kos.contact_whatsapp.replace(/^0/, '')}` : null} />
                    </div>

                    {/* Fasilitas umum */}
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8C6B63' }}>
                            Fasilitas Umum
                        </p>
                        <div className="flex flex-wrap gap-2 py-2">
                            <Badge active={kos.has_ac} label="AC" />
                            <Badge active={kos.has_wifi} label="WiFi" />
                            <Badge active={kos.has_private_bathroom} label="Kamar Mandi Dalam" />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    {kos.description && (
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8C6B63' }}>
                                Deskripsi
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: '#2D1B18' }}>{kos.description}</p>
                        </div>
                    )}

                    {/* Peraturan */}
                    {kos.rules && (
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8C6B63' }}>
                                Peraturan
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: '#2D1B18' }}>{kos.rules}</p>
                        </div>
                    )}

                    {/* Statistik */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                            { label: 'Rating', value: kos.rating_avg > 0 ? `${kos.rating_avg} ★` : '-' },
                            { label: 'Ulasan', value: kos.review_count ?? 0 },
                            { label: 'Dilihat', value: kos.views_count ?? 0 },
                        ].map(({ label, value }) => (
                            <div key={label} className="rounded-xl p-3 text-center"
                                style={{ backgroundColor: '#FAFAF9', border: '1px solid #EAE0DC' }}>
                                <p className="text-lg font-bold" style={{ color: '#2D1B18' }}>{value}</p>
                                <p className="text-xs" style={{ color: '#8C6B63' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Catatan untuk data yang belum di-load */}
                    <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: '#F5EDE9', color: '#8C6B63' }}>
                        💡 Untuk melihat foto, harga sewa, dan daftar fasilitas lengkap, buka halaman Edit kos ini.
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex items-center gap-3 shrink-0" style={{ borderTop: '1px solid #EAE0DC' }}>
                    <Link
                        href={route('admin.kos.edit', kos.slug)}
                        className="flex-1 py-2.5 text-sm font-semibold text-center rounded-lg transition-colors"
                        style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}
                    >
                        Edit Kos
                    </Link>
                    <button onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#F5EDE9', color: '#2D1B18', border: '1px solid #EAE0DC' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function KosIndex({ kosList }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);

    function handleToggleActive(kos) {
        router.patch(route('admin.kos.toggleActive', kos.slug), {}, {
            preserveScroll: true,
        });
    }

    function handleTogglePlus(kos) {
        router.patch(route('admin.kos.togglePlus', kos.slug), {}, {
            preserveScroll: true,
        });
    }

    function handleConfirmDelete() {
        router.delete(route('admin.kos.destroy', deleteTarget.slug), {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    }

    return (
        <AdminLayout title="Manajemen Kos">
            <Head title="Manajemen Kos" />
            <FlashMessage />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#2D1B18' }}>Manajemen Kos</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#8C6B63' }}>
                        {kosList.length} kos terdaftar
                    </p>
                </div>
                <Link
                    href={route('admin.kos.create')}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kos
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #EAE0DC' }}>
                {kosList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: '#F5EDE9' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#2D1B18' }}>Belum ada kos</p>
                        <p className="text-xs mt-1" style={{ color: '#8C6B63' }}>Tambah kos pertama untuk mulai</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #EAE0DC', backgroundColor: '#FAFAF9' }}>
                                    {['Nama Kos', 'Tipe', 'Kecamatan', 'Aktif', 'Plus', 'Dibuat', 'Aksi'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                                            style={{ color: '#8C6B63' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {kosList.map((kos) => (
                                    <tr key={kos.id} className="group" style={{ borderBottom: '1px solid #EAE0DC' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF9'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        {/* Nama */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium" style={{ color: '#2D1B18' }}>
                                                    {kos.name}
                                                </span>
                                                {kos.is_plus && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                                        style={{ backgroundColor: '#FEF2F0', color: '#C0392B' }}>
                                                        Plus
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {/* Tipe */}
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{
                                                    backgroundColor: TYPE_COLORS[kos.type]?.bg ?? '#F5F5F5',
                                                    color: TYPE_COLORS[kos.type]?.text ?? '#666',
                                                }}>
                                                {TYPE_LABELS[kos.type] ?? kos.type}
                                            </span>
                                        </td>
                                        {/* Kecamatan */}
                                        <td className="px-4 py-3 text-sm" style={{ color: '#8C6B63' }}>
                                            {kos.district}
                                        </td>
                                        {/* Toggle Aktif */}
                                        <td className="px-4 py-3">
                                            <ToggleSwitch
                                                checked={kos.is_active}
                                                onChange={() => handleToggleActive(kos)}
                                            />
                                        </td>
                                        {/* Toggle Plus */}
                                        <td className="px-4 py-3">
                                            <ToggleSwitch
                                                checked={kos.is_plus}
                                                onChange={() => handleTogglePlus(kos)}
                                            />
                                        </td>
                                        {/* Tanggal */}
                                        <td className="px-4 py-3 text-xs" style={{ color: '#8C6B63' }}>
                                            {formatDate(kos.created_at)}
                                        </td>
                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {/* Tombol View */}
                                                <button
                                                    onClick={() => setViewTarget(kos)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    style={{ color: '#8C6B63' }}
                                                    title="Lihat Detail"
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5EDE9'; e.currentTarget.style.color = '#2D1B18'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                {/* Tombol Edit */}
                                                <Link
                                                    href={route('admin.kos.edit', kos.slug)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    style={{ color: '#8C6B63' }}
                                                    title="Edit"
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5EDE9'; e.currentTarget.style.color = '#2D1B18'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                {/* Tombol Hapus */}
                                                <button
                                                    onClick={() => setDeleteTarget(kos)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    style={{ color: '#8C6B63' }}
                                                    title="Hapus"
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEF2F0'; e.currentTarget.style.color = '#C0392B'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* KosDetailModal */}
            {viewTarget && (
                <KosDetailModal kos={viewTarget} onClose={() => setViewTarget(null)} />
            )}

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name ?? 'kos ini'}
            />
        </AdminLayout>
    );
}
