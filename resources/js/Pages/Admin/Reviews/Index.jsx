import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function StarMini({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-3 h-3" viewBox="0 0 20 20"
                    fill={i <= rating ? '#C0392B' : '#E2E8F0'}
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

function formatDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Badge status moderasi
function StatusBadge({ status }) {
    const map = {
        pending:  { label: 'Menunggu',  bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
        approved: { label: 'Disetujui', bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
        rejected: { label: 'Ditolak',   bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
    };
    const s = map[status] ?? map.pending;
    return (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {s.label}
        </span>
    );
}

export default function AdminReviewsIndex({ reviews, activeStatus, statusCounts }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleApprove(review) {
        router.patch(route('admin.reviews.approve', review.id), {}, { preserveScroll: true });
    }

    function handleReject(review) {
        router.patch(route('admin.reviews.reject', review.id), {}, { preserveScroll: true });
    }

    function handleConfirmDelete() {
        router.delete(route('admin.reviews.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
            preserveScroll: true,
        });
    }

    function handleTabChange(status) {
        router.get(route('admin.reviews.index'), status ? { status } : {}, { preserveScroll: false });
    }

    const tabs = [
        { key: '',         label: 'Semua',     count: statusCounts?.all },
        { key: 'pending',  label: 'Menunggu',  count: statusCounts?.pending },
        { key: 'approved', label: 'Disetujui', count: statusCounts?.approved },
        { key: 'rejected', label: 'Ditolak',   count: statusCounts?.rejected },
    ];

    return (
        <AdminLayout title="Manajemen Ulasan">
            <Head title="Manajemen Ulasan" />
            <FlashMessage />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Manajemen Ulasan</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                        Moderasi ulasan sebelum ditampilkan ke publik
                    </p>
                </div>
                {/* Badge pending mencolok */}
                {(statusCounts?.pending ?? 0) > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                        style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold" style={{ color: '#92400E' }}>
                            {statusCounts.pending} ulasan menunggu moderasi
                        </span>
                    </div>
                )}
            </div>

            {/* Filter tab */}
            <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all"
                        style={{
                            backgroundColor: activeStatus === tab.key ? '#FFFFFF' : 'transparent',
                            color: activeStatus === tab.key ? '#1E293B' : '#64748B',
                            boxShadow: activeStatus === tab.key ? '0 1px 3px rgba(15,23,42,0.1)' : 'none',
                        }}>
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                style={{
                                    backgroundColor: tab.key === 'pending' && tab.count > 0 ? '#FDE68A' : '#E2E8F0',
                                    color: tab.key === 'pending' && tab.count > 0 ? '#92400E' : '#64748B',
                                }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                {reviews?.data?.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Tidak ada ulasan</p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                            {activeStatus === 'pending' ? 'Semua ulasan sudah dimoderasi' : 'Belum ada ulasan'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                    {['Properti', 'Pengguna', 'Rating', 'Komentar', 'Status', 'Tanggal', 'Aksi'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                                            style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reviews?.data?.map(review => (
                                    <tr key={review.id} style={{ borderBottom: '1px solid #E2E8F0' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>

                                        {/* Properti */}
                                        <td className="px-4 py-3" style={{ minWidth: '160px' }}>
                                            {review.kos ? (
                                                <Link href={`/kos/${review.kos.slug}`} target="_blank"
                                                    className="text-sm font-medium transition-colors"
                                                    style={{ color: '#2563EB' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                                                    {review.kos.name}
                                                </Link>
                                            ) : <span className="text-xs italic" style={{ color: '#64748B' }}>Dihapus</span>}
                                        </td>

                                        {/* Pengguna */}
                                        <td className="px-4 py-3 text-sm" style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                                            {review.user?.name ?? '-'}
                                        </td>

                                        {/* Rating */}
                                        <td className="px-4 py-3">
                                            <StarMini rating={review.rating} />
                                        </td>

                                        {/* Komentar */}
                                        <td className="px-4 py-3" style={{ maxWidth: '240px' }}>
                                            {review.comment ? (
                                                <p className="text-xs leading-relaxed line-clamp-2"
                                                    style={{ color: '#475569' }}>
                                                    {review.comment}
                                                </p>
                                            ) : (
                                                <span className="text-xs italic" style={{ color: '#94A3B8' }}>
                                                    Tidak ada komentar
                                                </span>
                                            )}
                                            {review.photos?.length > 0 && (
                                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                                                    {review.photos.length} foto
                                                </p>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <StatusBadge status={review.status} />
                                        </td>

                                        {/* Tanggal */}
                                        <td className="px-4 py-3 text-xs" style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {formatDate(review.created_at)}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {/* Setujui — tampil jika pending atau rejected */}
                                                {review.status !== 'approved' && (
                                                    <button onClick={() => handleApprove(review)}
                                                        className="p-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                                                        title="Setujui"
                                                        style={{ color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DCFCE7'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0FDF4'}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Setujui
                                                    </button>
                                                )}

                                                {/* Tolak — tampil jika pending atau approved */}
                                                {review.status !== 'rejected' && (
                                                    <button onClick={() => handleReject(review)}
                                                        className="p-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                                                        title="Tolak"
                                                        style={{ color: '#991B1B', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Tolak
                                                    </button>
                                                )}

                                                {/* Hapus */}
                                                <button onClick={() => setDeleteTarget(review)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    title="Hapus"
                                                    style={{ color: '#64748B' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#991B1B'; }}
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

            {/* Pagination */}
            {reviews?.links && <Pagination links={reviews.links} />}

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={`ulasan dari ${deleteTarget?.user?.name ?? 'pengguna ini'}`}
            />
        </AdminLayout>
    );
}