import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function SettingsIndex({ settings, pages }) {
    // ── Form pengaturan platform ──────────────────────────────
    const { data, setData, post, processing, errors } = useForm({
        platform_name: settings?.platform_name ?? '',
        logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(settings?.platform_logo ?? null);
    const logoInputRef = useRef(null);

    function handleLogoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    // ── Helpers ───────────────────────────────────────────────
    function formatDate(str) {
        if (!str) return 'Belum pernah diedit';
        return new Date(str).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }

    const inputStyle = (hasErr) => ({
        border: `1px solid ${hasErr ? '#2563EB' : '#E2E8F0'}`,
        backgroundColor: hasErr ? '#FEF2F2' : '#FFFFFF',
        color: '#1E293B',
    });

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan Platform" />
            <FlashMessage />

            <div className="mb-7">
                <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Pengaturan Platform</h2>
                <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Kelola identitas dan konten platform</p>
            </div>

            <div className="max-w-3xl space-y-6">

                {/* ── Identitas Platform ── */}
                <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                    <h3 className="text-base font-semibold mb-5" style={{ color: '#1E293B' }}>
                        Identitas Platform
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Nama Platform */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1E293B' }}>
                                Nama Platform <span style={{ color: '#2563EB' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.platform_name}
                                onChange={e => setData('platform_name', e.target.value)}
                                placeholder="AdaKamar.id"
                                maxLength={100}
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                style={inputStyle(errors.platform_name)}
                                onFocus={e => { if (!errors.platform_name) { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}}
                                onBlur={e => { if (!errors.platform_name) { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}}
                            />
                            {errors.platform_name && (
                                <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors.platform_name}</p>
                            )}
                        </div>

                        {/* Logo */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1E293B' }}>
                                Logo Platform
                                <span className="ml-2 text-xs font-normal" style={{ color: '#64748B' }}>
                                    (PNG, JPG, SVG — maks 2 MB)
                                </span>
                            </label>

                            <div className="flex items-start gap-4">
                                {/* Preview */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#F0F7FF', border: '1px solid #E2E8F0' }}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo preview"
                                            className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                                            viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                        onChange={handleLogoChange}
                                        className="w-full text-sm"
                                        style={{ color: '#1E293B' }}
                                    />
                                    {errors.logo && (
                                        <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors.logo}</p>
                                    )}
                                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                                        Upload file baru untuk mengganti logo yang ada
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                                style={{
                                    backgroundColor: processing ? '#E8857A' : '#2563EB',
                                    color: '#FFFFFF',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#2563EB'; }}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Halaman Konten ── */}
                <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                    <h3 className="text-base font-semibold mb-1" style={{ color: '#1E293B' }}>Halaman Konten</h3>
                    <p className="text-sm mb-5" style={{ color: '#64748B' }}>
                        Kelola konten halaman informasi yang dapat dilihat oleh seluruh pengunjung
                    </p>

                    <div className="space-y-3">
                        {pages?.map(page => (
                            <div key={page.id}
                                className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                                style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>
                                            {page.title}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                backgroundColor: page.is_active ? '#F0FDF4' : '#F5F5F5',
                                                color: page.is_active ? '#16A34A' : '#9CA3AF',
                                            }}>
                                            {page.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: '#64748B' }}>
                                        Terakhir diperbarui: {formatDate(page.updated_at)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    {page.is_active && (
                                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg transition-colors text-xs"
                                            style={{ color: '#64748B' }}
                                            title="Lihat halaman"
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                    <Link href={route('admin.pages.edit', page.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                                        style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Konten
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
