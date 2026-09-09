import { router } from '@inertiajs/react';
import { useState } from 'react';

const PRICE_TYPES = [
    { key: 'harian',  label: 'Harian',  placeholder: '150000' },
    { key: 'bulanan', label: 'Bulanan', placeholder: '800000' },
    { key: 'tahunan', label: 'Tahunan', placeholder: '8000000' },
];

function ToggleSwitch({ checked, onChange }) {
    return (
        <button
            type="button"
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

export default function PriceManager({ kos, prices }) {
    const initial = PRICE_TYPES.reduce((acc, { key }) => {
        const existing = prices?.find(p => p.type === key);
        acc[key] = {
            price:     existing?.price ?? '',
            is_active: existing?.is_active ?? false,
        };
        return acc;
    }, {});

    const [priceData, setPriceData] = useState(initial);
    const [saving, setSaving] = useState(false);

    function handleSave() {
        const payload = PRICE_TYPES.map(({ key }) => ({
            type:      key,
            price:     priceData[key].price !== '' ? Number(priceData[key].price) : 0,
            is_active: priceData[key].is_active === true ? 1 : 0,
        }));

        setSaving(true);
        router.put(route('admin.kos.prices.update', kos.slug), { prices: payload }, {
            preserveScroll: true,
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
            onFinish: () => setSaving(false),
        });
    }

    return (
        <div className="space-y-4">
            {PRICE_TYPES.map(({ key, label, placeholder }) => {
                const active = priceData[key].is_active;
                return (
                    <div key={key}
                        className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                        style={{
                            border: `1px solid ${active ? '#EAE0DC' : '#EAE0DC'}`,
                            backgroundColor: active ? '#FFFFFF' : '#FAFAF9',
                        }}
                    >
                        <ToggleSwitch
                            checked={active}
                            onChange={() => setPriceData(prev => ({
                                ...prev,
                                [key]: { ...prev[key], is_active: !prev[key].is_active },
                            }))}
                        />

                        <span className="text-sm font-semibold w-20 shrink-0" style={{ color: '#2D1B18' }}>
                            {label}
                        </span>

                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm shrink-0" style={{ color: '#8C6B63' }}>Rp</span>
                            <input
                                type="number"
                                min="1"
                                max="999999999"
                                value={priceData[key].price}
                                onChange={e => setPriceData(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key], price: e.target.value },
                                }))}
                                disabled={!active}
                                placeholder={placeholder}
                                className="flex-1 px-3 py-2 text-sm rounded-lg outline-none transition-all"
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
                            style={{
                                backgroundColor: active ? '#F0FDF4' : '#F5F5F5',
                                color: active ? '#16A34A' : '#9CA3AF',
                            }}>
                            {active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </div>
                );
            })}

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors mt-2"
                style={{ backgroundColor: saving ? '#E8857A' : '#C0392B', color: '#FFFFFF', cursor: saving ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#A93226'; }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#C0392B'; }}
            >
                {saving ? 'Menyimpan...' : 'Simpan Harga Sewa'}
            </button>
        </div>
    );
}
