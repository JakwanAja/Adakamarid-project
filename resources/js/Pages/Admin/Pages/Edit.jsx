import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, Link } from '@inertiajs/react';

export default function PageEdit({ page }) {
    const { data, setData, put, processing, errors } = useForm({
        title:     page.title ?? '',
        content:   page.content ?? '',
        is_active: page.is_active ?? true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.pages.update', page.id), {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout title="Edit Halaman">
            <Head title={`Edit — ${page.title}`} />
            <FlashMessage />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#8C6B63' }}>
                <Link href={route('admin.settings.index')} style={{ color: '#C0392B' }}
                    className="hover:underline">
                    Pengaturan
                </Link>
                <span>›</span>
                <span style={{ color: '#2D1B18' }}>{page.title}</span>
            </div>

            <div className="max-w-3xl">
                <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EAE0DC' }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold" style={{ color: '#2D1B18' }}>
                            Edit: {page.title}
                        </h2>
                        {/* Link preview */}
                        {page.is_active && (
                            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs transition-colors"
                                style={{ color: '#C0392B' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                                onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                                Lihat halaman publik
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                                Judul <span style={{ color: '#C0392B' }}>*</span>
                            </label>
                            <input type="text" value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none"
                                style={{
                                    border: `1px solid ${errors.title ? '#C0392B' : '#EAE0DC'}`,
                                    backgroundColor: errors.title ? '#FEF2F2' : '#FFFFFF',
                                    color: '#2D1B18',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = errors.title ? '#C0392B' : '#EAE0DC'; e.target.style.boxShadow = 'none'; }}
                            />
                            {errors.title && <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors.title}</p>}
                        </div>

                        {/* Konten */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                                Konten
                                <span className="ml-2 text-xs font-normal" style={{ color: '#8C6B63' }}>
                                    (Mendukung HTML sederhana)
                                </span>
                            </label>
                            <textarea
                                value={data.content ?? ''}
                                onChange={e => setData('content', e.target.value)}
                                rows={16}
                                placeholder="Tulis konten halaman di sini..."
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none resize-y font-mono"
                                style={{
                                    border: '1px solid #EAE0DC',
                                    backgroundColor: '#FAFAF9',
                                    color: '#2D1B18',
                                    lineHeight: '1.7',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = '#EAE0DC'; e.target.style.boxShadow = 'none'; }}
                            />
                            <p className="text-xs mt-1" style={{ color: '#8C6B63' }}>
                                Tip: Gunakan tag HTML seperti &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; untuk memformat konten.
                            </p>
                        </div>

                        {/* Status Aktif */}
                        <div className="flex items-center gap-3">
                            <button type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
                                style={{ backgroundColor: data.is_active ? '#C0392B' : '#D1D5DB' }}>
                                <span className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow mt-0.5 transition-transform duration-200"
                                    style={{ marginLeft: data.is_active ? '18px' : '2px' }} />
                            </button>
                            <span className="text-sm" style={{ color: '#2D1B18' }}>
                                Halaman {data.is_active ? 'aktif' : 'nonaktif'}
                                {!data.is_active && (
                                    <span className="ml-1 text-xs" style={{ color: '#8C6B63' }}>
                                        (tidak dapat diakses publik)
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #EAE0DC' }}>
                            <button type="submit" disabled={processing}
                                className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                                style={{
                                    backgroundColor: processing ? '#E8857A' : '#C0392B',
                                    color: '#FFFFFF',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#A93226'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#C0392B'; }}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                            <Link href={route('admin.settings.index')}
                                className="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors"
                                style={{ backgroundColor: '#F5EDE9', color: '#2D1B18' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}>
                                Kembali
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
