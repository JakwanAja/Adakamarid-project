import AdminLayout from '@/Layouts/AdminLayout';
import KosForm from '@/Components/Admin/KosForm';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, Link } from '@inertiajs/react';

export default function KosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name:                 '',
        description:          '',
        rules:                '',
        type:                 '',
        district:             '',
        address:              '',
        latitude:             '',
        longitude:            '',
        contact_name:         '',
        contact_whatsapp:     '',
        has_ac:               false,
        has_wifi:             false,
        has_private_bathroom: false,
        is_plus:              false,
        is_active:            true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.kos.store'));
    }

    return (
        <AdminLayout title="Tambah Kos">
            <Head title="Tambah Kos" />
            <FlashMessage />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#8C6B63' }}>
                <Link href={route('admin.kos.index')} style={{ color: '#C0392B' }}
                    className="hover:underline">
                    Manajemen Kos
                </Link>
                <span>›</span>
                <span style={{ color: '#2D1B18' }}>Tambah Kos</span>
            </div>

            {/* Info banner */}
            <div className="max-w-3xl mb-5 px-4 py-3 rounded-xl flex items-start gap-3"
                style={{ backgroundColor: '#FEF2F0', border: '1px solid #F5C6C0' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" fill="none"
                    viewBox="0 0 24 24" stroke="#C0392B" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm" style={{ color: '#2D1B18' }}>
                    Isi informasi dasar kos terlebih dahulu. Setelah disimpan, kamu akan diarahkan ke halaman edit untuk menambahkan <strong>foto</strong>, <strong>harga sewa</strong>, dan <strong>fasilitas</strong>.
                </p>
            </div>

            <div className="max-w-3xl">
                <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EAE0DC' }}>
                    <h2 className="text-base font-semibold mb-5" style={{ color: '#2D1B18' }}>
                        Informasi Kos
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <KosForm data={data} setData={setData} errors={errors} />

                        <div className="flex items-center gap-3 mt-8 pt-6"
                            style={{ borderTop: '1px solid #EAE0DC' }}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                                style={{
                                    backgroundColor: processing ? '#E8857A' : '#C0392B',
                                    color: '#FFFFFF',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#A93226'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#C0392B'; }}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Kos'}
                            </button>
                            <Link
                                href={route('admin.kos.index')}
                                className="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors"
                                style={{ backgroundColor: '#F5EDE9', color: '#2D1B18' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
