import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const TYPE_LABELS = { putra: 'Putra', putri: 'Putri', campur: 'Campur', guesthouse: 'Guesthouse', villa: 'Villa' };
const TYPE_COLORS = {
    putra:      { bg: '#EFF6FF', text: '#1D4ED8' },
    putri:      { bg: '#FDF2F8', text: '#BE185D' },
    campur:     { bg: '#F0FDF4', text: '#15803D' },
    guesthouse: { bg: '#F5F3FF', text: '#7C3AED' },
    villa:      { bg: '#FFFBEB', text: '#B45309' },
};

function ToggleSwitch({ checked, onChange }) {
    return (
        <button type="button" role="switch" aria-checked={checked} onClick={onChange}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
            style={{ backgroundColor: checked ? '#2563EB' : '#D1D5DB' }}>
            <span className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
                style={{ marginLeft: checked ? '18px' : '2px' }} />
        </button>
    );
}

// ── KosDetailModal ────────────────────────────────────────────
function KosDetailModal({ kos, onClose }) {
    if (!kos) return null;

    const typeLabel = TYPE_LABELS[kos.type] ?? kos.type;
    const typeColor = TYPE_COLORS[kos.type] ?? { bg: '#F5F5F5', text: '#666' };

    function InfoRow({ label, value }) {
        if (!value) return null;
        return (
            <div className="flex gap-3 py-2.5" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <span className="text-xs font-medium w-36 shrink-0 mt-0.5" style={{ color: '#64748B' }}>{label}</span>
                <span className="text-sm flex-1" style={{ color: '#1E293B' }}>{value}</span>
            </div>
        );
    }

    function StatusBadge({ active, label }) {
        return (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: active ? '#F0FDF4' : '#F5F5F5', color: active ? '#16A34A' : '#9CA3AF' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? '#16A34A' : '#9CA3AF' }} />
                {label}
            </span>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
                style={{ border: '1px solid #E2E8F0' }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-start gap-3 p-5 shrink-0" style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: '#F0F7FF', border: '1px solid #E2E8F0' }}>
                        {kos.primary_photo ? (
                            <img src={`/storage/${kos.primary_photo.path}`} alt={kos.name}
                                className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <h3 className="text-base font-semibold" style={{ color: '#1E293B' }}>{kos.name}</h3>
                            {kos.is_plus && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>Plus</span>
                            )}
                            {kos.is_promoted && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>Rekomendasi</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}>
                                {typeLabel}
                            </span>
                            <StatusBadge active={kos.is_active} label={kos.is_active ? 'Aktif' : 'Nonaktif'} />
                            <span className="text-xs" style={{ color: '#64748B' }}>{kos.district}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors shrink-0"
                        style={{ color: '#64748B' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    <InfoRow label="Alamat" value={kos.address} />
                    <InfoRow label="Kecamatan" value={kos.district} />
                    <InfoRow label="Koordinat" value={kos.latitude && kos.longitude ? `${kos.latitude}, ${kos.longitude}` : null} />
                    <InfoRow label="Kontak" value={kos.contact_name} />
                    <InfoRow label="WhatsApp" value={kos.contact_whatsapp ? `+${kos.contact_whatsapp}` : null} />

                    <div className="mt-4 mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Fasilitas Umum</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'AC', active: kos.has_ac },
                                { label: 'WiFi', active: kos.has_wifi },
                                { label: 'KM Dalam', active: kos.has_private_bathroom },
                            ].map(f => <StatusBadge key={f.label} active={f.active} label={f.label} />)}
                        </div>
                    </div>

                    {/* Statistik grid */}
                    <div className="grid grid-cols-4 gap-2 mt-4 mb-4">
                        {[
                            { label: 'Foto', value: kos.photos_count ?? 0 },
                            { label: 'Ulasan', value: kos.reviews_count ?? kos.review_count ?? 0 },
                            { label: 'Rating', value: kos.rating_avg > 0 ? Number(kos.rating_avg).toFixed(1) : '-' },
                            { label: 'Views', value: kos.views_count ?? 0 },
                        ].map(({ label, value }) => (
                            <div key={label} className="rounded-xl p-3 text-center"
                                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <p className="text-base font-bold" style={{ color: '#1E293B' }}>{value}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {kos.description && (
                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Deskripsi</p>
                            <p className="text-sm leading-relaxed" style={{ color: '#1E293B' }}>{kos.description}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 flex items-center gap-3 shrink-0" style={{ borderTop: '1px solid #E2E8F0' }}>
                    <Link href={route('admin.kos.edit', kos.slug)}
                        className="flex-1 py-2.5 text-sm font-semibold text-center rounded-lg transition-colors"
                        style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                        Edit Kos
                    </Link>
                    <button onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#F0F7FF', color: '#1E293B', border: '1px solid #E2E8F0' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0F7FF'}>
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
    const [viewTarget, setViewTarget]     = useState(null);

    // ── Filter & Sort state ───────────────────────────────────
    const [search, setSearch]       = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy]       = useState('created_at');
    const [sortDir, setSortDir]     = useState('desc');

    function toggleSort(col) {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('desc'); }
    }

    // ── Filtered + sorted list (client-side, data sudah di-pass semua) ─
    const filtered = useMemo(() => {
        let list = [...kosList];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(k =>
                k.name.toLowerCase().includes(q) ||
                k.district.toLowerCase().includes(q)
            );
        }
        if (filterType) list = list.filter(k => k.type === filterType);
        if (filterStatus === 'aktif')    list = list.filter(k => k.is_active);
        if (filterStatus === 'nonaktif') list = list.filter(k => !k.is_active);

        list.sort((a, b) => {
            let va = a[sortBy] ?? 0;
            let vb = b[sortBy] ?? 0;
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    }, [kosList, search, filterType, filterStatus, sortBy, sortDir]);

    function handleToggleActive(kos) {
        router.patch(route('admin.kos.toggleActive', kos.slug), {}, { preserveScroll: true });
    }
    function handleTogglePlus(kos) {
        router.patch(route('admin.kos.togglePlus', kos.slug), {}, { preserveScroll: true });
    }
    function handleTogglePromoted(kos) {
        router.patch(route('admin.kos.togglePromoted', kos.slug), {}, { preserveScroll: true });
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

    function SortIcon({ col }) {
        if (sortBy !== col) return (
            <svg className="w-3 h-3 ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        );
        return (
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d={sortDir === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
        );
    }

    const promotedCount = kosList.filter(k => k.is_promoted).length;

    return (
        <AdminLayout title="Manajemen Kos">
            <Head title="Manajemen Kos" />
            <FlashMessage />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Manajemen Kos</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                        {kosList.length} kos terdaftar
                        {promotedCount > 0 && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                                {promotedCount} Rekomendasi aktif
                            </span>
                        )}
                    </p>
                </div>
                <Link href={route('admin.kos.create')}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kos
                </Link>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3"
                style={{ border: '1px solid #E2E8F0' }}>
                {/* Search */}
                <div className="flex items-center flex-1 min-w-[180px] rounded-lg overflow-hidden"
                    style={{ border: '1px solid #CBD5E1' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama atau kecamatan..."
                        className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                        style={{ color: '#1E293B' }} />
                </div>

                {/* Tipe */}
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    className="outline-none text-sm rounded-lg px-3 py-2"
                    style={{ border: '1px solid #CBD5E1', color: filterType ? '#1E293B' : '#64748B', minWidth: '120px' }}>
                    <option value="">Semua Tipe</option>
                    <option value="putra">Putra</option>
                    <option value="putri">Putri</option>
                    <option value="campur">Campur</option>
                </select>

                {/* Status */}
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="outline-none text-sm rounded-lg px-3 py-2"
                    style={{ border: '1px solid #CBD5E1', color: filterStatus ? '#1E293B' : '#64748B', minWidth: '120px' }}>
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                </select>

                {/* Sort */}
                <select value={`${sortBy}:${sortDir}`}
                    onChange={e => {
                        const [col, dir] = e.target.value.split(':');
                        setSortBy(col); setSortDir(dir);
                    }}
                    className="outline-none text-sm rounded-lg px-3 py-2"
                    style={{ border: '1px solid #CBD5E1', color: '#1E293B', minWidth: '160px' }}>
                    <option value="created_at:desc">Terbaru</option>
                    <option value="created_at:asc">Terlama</option>
                    <option value="views_count:desc">Views Terbanyak</option>
                    <option value="rating_avg:desc">Rating Tertinggi</option>
                    <option value="review_count:desc">Ulasan Terbanyak</option>
                    <option value="name:asc">Nama A-Z</option>
                </select>

                {/* Reset */}
                {(search || filterType || filterStatus || sortBy !== 'created_at') && (
                    <button onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); setSortBy('created_at'); setSortDir('desc'); }}
                        className="text-xs px-3 py-2 rounded-lg transition-colors"
                        style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#2563EB'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
                        Reset
                    </button>
                )}

                <p className="ml-auto text-xs" style={{ color: '#64748B' }}>
                    {filtered.length} hasil
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Tidak ada kos ditemukan</p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>Coba ubah filter pencarian</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                    {[
                                        { label: 'Nama Kos',    col: 'name',         sortable: true },
                                        { label: 'Tipe',        col: null,            sortable: false },
                                        { label: 'Kecamatan',   col: 'district',      sortable: true },
                                        { label: 'Foto',        col: 'photos_count',  sortable: true },
                                        { label: 'Views',       col: 'views_count',   sortable: true },
                                        { label: 'Ulasan',      col: 'review_count',  sortable: true },
                                        { label: 'Rating',      col: 'rating_avg',    sortable: true },
                                        { label: 'Aktif',       col: null,            sortable: false },
                                        { label: 'Plus',        col: null,            sortable: false },
                                        { label: 'Rekomen.',    col: null,            sortable: false },
                                        { label: 'Dibuat',      col: 'created_at',    sortable: true },
                                        { label: 'Aksi',        col: null,            sortable: false },
                                    ].map(h => (
                                        <th key={h.label}
                                            className="px-3 py-3 text-left text-xs font-semibold"
                                            style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {h.sortable ? (
                                                <button onClick={() => toggleSort(h.col)}
                                                    className="flex items-center hover:opacity-80">
                                                    {h.label}
                                                    <SortIcon col={h.col} />
                                                </button>
                                            ) : h.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(kos => (
                                    <tr key={kos.id} style={{ borderBottom: '1px solid #E2E8F0' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>

                                        {/* Nama */}
                                        <td className="px-3 py-3" style={{ minWidth: '160px' }}>
                                            <div className="flex items-center gap-2">
                                                {/* Thumbnail */}
                                                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0"
                                                    style={{ backgroundColor: '#F0F7FF', border: '1px solid #E2E8F0' }}>
                                                    {kos.primary_photo ? (
                                                        <img src={`/storage/${kos.primary_photo.path}`} alt={kos.name}
                                                            className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate max-w-[140px]" style={{ color: '#1E293B' }}>
                                                        {kos.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        {kos.is_plus && (
                                                            <span className="text-xs px-1.5 py-0 rounded font-semibold leading-5"
                                                                style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>Plus</span>
                                                        )}
                                                        {kos.is_promoted && (
                                                            <span className="text-xs" style={{ color: '#1D4ED8' }}>★</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tipe */}
                                        <td className="px-3 py-3">
                                            <span className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{ backgroundColor: TYPE_COLORS[kos.type]?.bg ?? '#F5F5F5', color: TYPE_COLORS[kos.type]?.text ?? '#666' }}>
                                                {TYPE_LABELS[kos.type] ?? kos.type}
                                            </span>
                                        </td>

                                        {/* Kecamatan */}
                                        <td className="px-3 py-3 text-xs" style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {kos.district}
                                        </td>

                                        {/* Foto count */}
                                        <td className="px-3 py-3 text-center">
                                            <span className="text-xs font-medium" style={{ color: (kos.photos_count ?? 0) > 0 ? '#1E293B' : '#D1D5DB' }}>
                                                {kos.photos_count ?? 0}
                                            </span>
                                        </td>

                                        {/* Views */}
                                        <td className="px-3 py-3 text-center">
                                            <span className="text-xs font-medium" style={{ color: '#1E293B' }}>
                                                {(kos.views_count ?? 0).toLocaleString('id-ID')}
                                            </span>
                                        </td>

                                        {/* Ulasan */}
                                        <td className="px-3 py-3 text-center">
                                            <span className="text-xs font-medium" style={{ color: (kos.review_count ?? 0) > 0 ? '#1E293B' : '#D1D5DB' }}>
                                                {kos.review_count ?? 0}
                                            </span>
                                        </td>

                                        {/* Rating */}
                                        <td className="px-3 py-3 text-center">
                                            {(kos.rating_avg ?? 0) > 0 ? (
                                                <span className="inline-flex items-center gap-0.5 text-xs font-semibold"
                                                    style={{ color: '#2563EB' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {Number(kos.rating_avg).toFixed(1)}
                                                </span>
                                            ) : (
                                                <span className="text-xs" style={{ color: '#D1D5DB' }}>-</span>
                                            )}
                                        </td>

                                        {/* Toggle Aktif */}
                                        <td className="px-3 py-3">
                                            <ToggleSwitch checked={kos.is_active} onChange={() => handleToggleActive(kos)} />
                                        </td>

                                        {/* Toggle Plus */}
                                        <td className="px-3 py-3">
                                            <ToggleSwitch checked={kos.is_plus} onChange={() => handleTogglePlus(kos)} />
                                        </td>

                                        {/* Toggle Promoted */}
                                        <td className="px-3 py-3">
                                            <ToggleSwitch checked={kos.is_promoted} onChange={() => handleTogglePromoted(kos)} />
                                        </td>

                                        {/* Tanggal */}
                                        <td className="px-3 py-3 text-xs" style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {formatDate(kos.created_at)}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setViewTarget(kos)}
                                                    className="p-1.5 rounded-lg transition-colors" title="Lihat Detail"
                                                    style={{ color: '#64748B' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <Link href={route('admin.kos.edit', kos.slug)}
                                                    className="p-1.5 rounded-lg transition-colors" title="Edit"
                                                    style={{ color: '#64748B' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button onClick={() => setDeleteTarget(kos)}
                                                    className="p-1.5 rounded-lg transition-colors" title="Hapus"
                                                    style={{ color: '#64748B' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
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

            {viewTarget && <KosDetailModal kos={viewTarget} onClose={() => setViewTarget(null)} />}

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name ?? 'kos ini'}
            />
        </AdminLayout>
    );
}