import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function StarMini({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-3 h-3" viewBox="0 0 20 20"
                    fill={i <= rating ? '#2563EB' : '#E2E8F0'}
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

function formatDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminReviewsIndex({ reviews }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleConfirmDelete() {
        router.delete(route('admin.reviews.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const list = reviews?.data ?? [];

    return (
        <AdminLayout title="Manajemen Ulasan">
            <Head title="Manajemen Ulasan" />
            <FlashMessage />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Manajemen Ulasan</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                        {reviews?.total ?? 0} ulasan terdaftar
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                {list.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: '#F0F7FF' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
                                viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#1E293B' }}>Belum ada ulasan</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                    {['Reviewer', 'Kos', 'Rating', 'Komentar', 'Tanggal', 'Aksi'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                                            style={{ color: '#64748B' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(review => (
                                    <tr key={review.id} style={{ borderBottom: '1px solid #E2E8F0' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                                                {review.user?.name ?? '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {review.kos ? (
                                                <Link href={`/kos/${review.kos.slug}`}
                                                    className="text-sm hover:underline"
                                                    style={{ color: '#2563EB' }}
                                                    target="_blank">
                                                    {review.kos.name}
                                                </Link>
                                            ) : (
                                                <span className="text-sm" style={{ color: '#64748B' }}>-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StarMini rating={review.rating} />
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            {review.comment ? (
                                                <p className="text-sm truncate" style={{ color: '#475569' }}>
                                                    {review.comment.length > 80
                                                        ? review.comment.substring(0, 80) + '...'
                                                        : review.comment}
                                                </p>
                                            ) : (
                                                <span className="text-sm italic" style={{ color: '#64748B' }}>
                                                    Tanpa komentar
                                                </span>
                                            )}
                                            {review.photos?.length > 0 && (
                                                <span className="text-xs block mt-0.5" style={{ color: '#64748B' }}>
                                                    📷 {review.photos.length} foto
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                                            {formatDate(review.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setDeleteTarget(review)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ color: '#64748B' }}
                                                title="Hapus"
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginasi */}
            {reviews?.links && reviews.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 mt-5">
                    {reviews.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                                style={{
                                    backgroundColor: link.active ? '#2563EB' : '#FFFFFF',
                                    color: link.active ? '#FFFFFF' : '#1E293B',
                                    border: `1px solid ${link.active ? '#2563EB' : '#E2E8F0'}`,
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ) : (
                            <span key={i} className="px-3 py-2 text-sm rounded-lg"
                                style={{ color: '#64748B' }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            )}

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={`ulasan dari ${deleteTarget?.user?.name ?? 'pengguna ini'}`}
            />
        </AdminLayout>
    );
}
