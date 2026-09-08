import AdminLayout from '@/Layouts/AdminLayout';
import KosForm from '@/Components/Admin/KosForm';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

// ── Tab nav styling ───────────────────────────────────────────
const TABS = [
    { key: 'info',       label: 'Info Dasar',   icon: '📋' },
    { key: 'prices',     label: 'Harga Sewa',   icon: '💰' },
    { key: 'facilities', label: 'Fasilitas',    icon: '🛠️' },
];

// ── Harga Sewa inline component ───────────────────────────────
const PRICE_TYPES = [
    { key: 'harian',  label: 'Harian',  placeholder: '150000' },
    { key: 'bulanan', label: 'Bulanan', placeholder: '800000' },
    { key: 'tahunan', label: 'Tahunan', placeholder: '8000000' },
];

function ToggleSwitch({ checked, onChange }) {
    return (
        <button type="button" onClick={onChange}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
            style={{ backgroundColor: checked ? '#C0392B' : '#D1D5DB' }}>
            <span className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
                style={{ marginLeft: checked ? '18px' : '2px' }} />
        </button>
    );
}

function PricePickerInline({ priceData, setPriceData }) {
    return (
        <div className="space-y-3">
            <p className="text-sm" style={{ color: '#8C6B63' }}>
                Aktifkan tipe sewa yang tersedia dan isi harganya. Bisa diubah lagi setelah kos dibuat.
            </p>
            {PRICE_TYPES.map(({ key, label, placeholder }) => {
                const active = priceData[key].is_active;
                return (
                    <div key={key} className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                        style={{ border: '1px solid #EAE0DC', backgroundColor: active ? '#FFFFFF' : '#FAFAF9' }}>
                        <ToggleSwitch
                            checked={active}
                            onChange={() => setPriceData(prev => ({
                                ...prev,
                                [key]: { ...prev[key], is_active: !prev[key].is_active }
                            }))}
                        />
                        <span className="text-sm font-semibold w-20 shrink-0" style={{ color: '#2D1B18' }}>{label}</span>
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm shrink-0" style={{ color: '#8C6B63' }}>Rp</span>
                            <input
                                type="number" min="1" max="999999999"
                                value={priceData[key].price}
                                onChange={e => setPriceData(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))}
                                disabled={!active}
                                placeholder={placeholder}
                                className="flex-1 px-3 py-2 text-sm rounded-lg outline-none"
                                style={{
                                    border: '1px solid #EAE0DC',
                                    backgroundColor: active ? '#FFFFFF' : '#F5EDE9',
                                    color: '#2D1B18',
                                    opacity: active ? 1 : 0.5,
                                }}
                                onFocus={e => { if (active) { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}}
                                onBlur={e => { e.target.style.borderColor = '#EAE0DC'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full shrink-0"
                            style={{ backgroundColor: active ? '#F0FDF4' : '#F5F5F5', color: active ? '#16A34A' : '#9CA3AF' }}>
                            {active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Fasilitas inline component ────────────────────────────────
const CATEGORY_LABELS = { kamar: 'Fasilitas Kamar', bersama: 'Fasilitas Bersama', sekitar: 'Fasilitas Sekitar' };
const CATEGORY_COLORS = {
    kamar:   { bg: '#FEF2F0', text: '#C0392B' },
    bersama: { bg: '#FFF7ED', text: '#B45309' },
    sekitar: { bg: '#F0FDF4', text: '#16A34A' },
};

function FacilityPickerInline({ allFacilities, selectedIds, onChange }) {
    const checked = new Set(selectedIds.map(Number));
    function toggle(id) {
        const next = new Set(checked);
        next.has(id) ? next.delete(id) : next.add(id);
        onChange([...next]);
    }
    const hasAny = ['kamar', 'bersama', 'sekitar'].some(c => (allFacilities?.[c] ?? []).length > 0);
    if (!hasAny) return (
        <p className="text-sm italic text-center py-8" style={{ color: '#8C6B63' }}>
            Belum ada fasilitas terdaftar. Tambahkan di Master Fasilitas terlebih dahulu.
        </p>
    );
    return (
        <div className="space-y-4">
            <p className="text-sm" style={{ color: '#8C6B63' }}>Centang fasilitas yang tersedia di kos ini.</p>
            {['kamar', 'bersama', 'sekitar'].map(category => {
                const items = allFacilities?.[category] ?? [];
                if (items.length === 0) return null;
                const colors = CATEGORY_COLORS[category];
                return (
                    <div key={category} className="rounded-xl overflow-hidden" style={{ border: '1px solid #EAE0DC' }}>
                        <div className="px-4 py-2.5 flex items-center gap-2"
                            style={{ backgroundColor: colors.bg, borderBottom: '1px solid #EAE0DC' }}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors.text }} />
                            <span className="text-sm font-semibold" style={{ color: colors.text }}>{CATEGORY_LABELS[category]}</span>
                            <span className="ml-auto text-xs" style={{ color: colors.text }}>
                                {items.filter(f => checked.has(Number(f.id))).length}/{items.length} dipilih
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {items.map(facility => (
                                <label key={facility.id} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox"
                                        checked={checked.has(Number(facility.id))}
                                        onChange={() => toggle(Number(facility.id))}
                                        className="w-4 h-4 rounded" style={{ accentColor: '#C0392B' }} />
                                    <span className="text-sm" style={{ color: '#2D1B18' }}>{facility.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function KosCreate({ facilities }) {
    const [activeTab, setActiveTab] = useState('info');

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

    // Harga state — lokal, dikumpulkan saat submit
    const [priceData, setPriceData] = useState(
        PRICE_TYPES.reduce((acc, { key }) => {
            acc[key] = { price: '', is_active: false };
            return acc;
        }, {})
    );

    // Fasilitas state — lokal, dikumpulkan saat submit
    const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        const prices = PRICE_TYPES.map(({ key }) => ({
            type:      key,
            price:     priceData[key].price || 0,
            is_active: priceData[key].is_active,
        }));

        // Kirim semua data dalam satu request menggunakan FormData
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'boolean') {
                formData.append(key, data[key] ? '1' : '0');
            } else {
                formData.append(key, data[key] ?? '');
            }
        });
        prices.forEach((p, i) => {
            formData.append(`prices[${i}][type]`, p.type);
            formData.append(`prices[${i}][price]`, p.price);
            formData.append(`prices[${i}][is_active]`, p.is_active ? '1' : '0');
        });
        selectedFacilityIds.forEach((id, i) => {
            formData.append(`facility_ids[${i}]`, id);
        });

        post(route('admin.kos.store'), {
            data: formData,
            forceFormData: true,
        });
    }

    // Submit bar — reusable di setiap tab
    function SubmitBar() {
        return (
            <div className="flex items-center gap-3 pt-5 mt-5" style={{ borderTop: '1px solid #EAE0DC' }}>
                <button
                    type="submit"
                    form="kos-create-form"
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
                <Link href={route('admin.kos.index')}
                    className="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: '#F5EDE9', color: '#2D1B18' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}>
                    Batal
                </Link>
                <span className="text-xs ml-auto" style={{ color: '#8C6B63' }}>
                    * Foto kos dapat diupload setelah kos tersimpan
                </span>
            </div>
        );
    }

    return (
        <AdminLayout title="Tambah Kos">
            <Head title="Tambah Kos" />
            <FlashMessage />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#8C6B63' }}>
                <Link href={route('admin.kos.index')} style={{ color: '#C0392B' }} className="hover:underline">
                    Manajemen Kos
                </Link>
                <span>›</span>
                <span style={{ color: '#2D1B18' }}>Tambah Kos</span>
            </div>

            <div className="max-w-3xl">
                {/* Tab navigation */}
                <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ backgroundColor: '#F5EDE9' }}>
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                            style={{
                                backgroundColor: activeTab === tab.key ? '#C0392B' : 'transparent',
                                color: activeTab === tab.key ? '#FFFFFF' : '#8C6B63',
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form wrapper — satu form, semua tab pakai form yang sama */}
                <form id="kos-create-form" onSubmit={handleSubmit}>

                    {/* ── Tab: Info Dasar ── */}
                    {activeTab === 'info' && (
                        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EAE0DC' }}>
                            <h3 className="text-base font-semibold mb-5" style={{ color: '#2D1B18' }}>
                                Informasi Dasar Kos
                            </h3>
                            <KosForm data={data} setData={setData} errors={errors} />
                            <SubmitBar />
                        </div>
                    )}

                    {/* ── Tab: Harga Sewa ── */}
                    {activeTab === 'prices' && (
                        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EAE0DC' }}>
                            <h3 className="text-base font-semibold mb-4" style={{ color: '#2D1B18' }}>
                                Harga Sewa
                            </h3>
                            <PricePickerInline priceData={priceData} setPriceData={setPriceData} />
                            <SubmitBar />
                        </div>
                    )}

                    {/* ── Tab: Fasilitas ── */}
                    {activeTab === 'facilities' && (
                        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EAE0DC' }}>
                            <h3 className="text-base font-semibold mb-4" style={{ color: '#2D1B18' }}>
                                Fasilitas Kos
                            </h3>
                            <FacilityPickerInline
                                allFacilities={facilities}
                                selectedIds={selectedFacilityIds}
                                onChange={setSelectedFacilityIds}
                            />
                            <SubmitBar />
                        </div>
                    )}

                </form>
            </div>
        </AdminLayout>
    );
}
