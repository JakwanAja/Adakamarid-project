import AdminLayout from '@/Layouts/AdminLayout';
import KosForm from '@/Components/Admin/KosForm';
import PhotoManager from '@/Components/Admin/PhotoManager';
import PriceManager from '@/Components/Admin/PriceManager';
import FacilitySelector from '@/Components/Admin/FacilitySelector';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

const TABS = [
    { key: 'info',       label: 'Info Dasar' },
    { key: 'photos',     label: 'Foto' },
    { key: 'prices',     label: 'Harga Sewa' },
    { key: 'facilities', label: 'Fasilitas' },
];

export default function KosEdit({ kos, photos, prices, facilities, allFacilities }) {
    const [activeTab, setActiveTab] = useState('info');

    const { data, setData, put, processing, errors } = useForm({
        name:                 kos.name ?? '',
        description:          kos.description ?? '',
        rules:                kos.rules ?? '',
        type:                 kos.type ?? '',
        district:             kos.district ?? '',
        address:              kos.address ?? '',
        latitude:             kos.latitude ?? '',
        longitude:            kos.longitude ?? '',
        contact_name:         kos.contact_name ?? '',
        contact_whatsapp:     kos.contact_whatsapp ?? '',
        has_ac:               !!kos.has_ac,
        has_wifi:             !!kos.has_wifi,
        has_private_bathroom: !!kos.has_private_bathroom,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.kos.update', kos.slug));
    }

    return (
        <AdminLayout title={`Edit Kos`}>
            <Head title={`Edit — ${kos.name}`} />
            <FlashMessage />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#64748B' }}>
                <Link href={route('admin.kos.index')} style={{ color: '#2563EB' }}
                    className="hover:underline">Manajemen Kos</Link>
                <span>›</span>
                <span className="truncate max-w-xs" style={{ color: '#1E293B' }}>{kos.name}</span>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
                style={{ backgroundColor: '#F0F7FF' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{
                            backgroundColor: activeTab === tab.key ? '#2563EB' : 'transparent',
                            color: activeTab === tab.key ? '#FFFFFF' : '#64748B',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="max-w-3xl">

                {/* ── Info Dasar ── */}
                {activeTab === 'info' && (
                    <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                        <form onSubmit={handleSubmit}>
                            <KosForm data={data} setData={setData} errors={errors} />
                            <div className="flex items-center gap-3 mt-8 pt-6"
                                style={{ borderTop: '1px solid #E2E8F0' }}>
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
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <Link
                                    href={route('admin.kos.index')}
                                    className="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors"
                                    style={{ backgroundColor: '#F0F7FF', color: '#1E293B' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0F7FF'}
                                >
                                    Kembali
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Foto ── */}
                {activeTab === 'photos' && (
                    <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                        <h3 className="text-base font-semibold mb-5" style={{ color: '#1E293B' }}>
                            Kelola Foto Kos
                        </h3>
                        <PhotoManager kos={kos} photos={photos} />
                    </div>
                )}

                {/* ── Harga Sewa ── */}
                {activeTab === 'prices' && (
                    <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                        <h3 className="text-base font-semibold mb-1" style={{ color: '#1E293B' }}>
                            Harga Sewa
                        </h3>
                        <p className="text-sm mb-5" style={{ color: '#64748B' }}>
                            Aktifkan tipe sewa yang tersedia dan isi harganya.
                        </p>
                        <PriceManager kos={kos} prices={prices} />
                    </div>
                )}

                {/* ── Fasilitas ── */}
                {activeTab === 'facilities' && (
                    <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
                        <h3 className="text-base font-semibold mb-1" style={{ color: '#1E293B' }}>
                            Fasilitas Kos
                        </h3>
                        <p className="text-sm mb-5" style={{ color: '#64748B' }}>
                            Centang fasilitas yang tersedia di kos ini.
                        </p>
                        <FacilitySelector
                            kos={kos}
                            allFacilities={allFacilities}
                            selectedIds={facilities}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
