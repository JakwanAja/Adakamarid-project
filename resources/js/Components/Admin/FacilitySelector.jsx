import { router } from '@inertiajs/react';
import { useState } from 'react';

const CATEGORY_LABELS = {
    kamar:   'Fasilitas Kamar',
    bersama: 'Fasilitas Bersama',
    sekitar: 'Fasilitas Sekitar',
};

const CATEGORY_COLORS = {
    kamar:   { bg: '#EFF6FF', text: '#2563EB' },
    bersama: { bg: '#EFF6FF', text: '#3B82F6' },
    sekitar: { bg: '#F0FDF4', text: '#16A34A' },
};

export default function FacilitySelector({ kos, allFacilities, selectedIds }) {
    const [checked, setChecked] = useState(new Set(selectedIds?.map(Number) ?? []));
    const [saving, setSaving] = useState(false);

    function toggle(id) {
        setChecked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function handleSave() {
        setSaving(true);
        router.put(route('admin.kos.facilities.update', kos.slug), {
            facility_ids: [...checked],
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    const categories = ['kamar', 'bersama', 'sekitar'];
    const hasAny = categories.some(c => (allFacilities[c] ?? []).length > 0);

    if (!hasAny) {
        return (
            <p className="text-sm italic text-center py-8" style={{ color: '#64748B' }}>
                Belum ada fasilitas terdaftar. Tambahkan terlebih dahulu di Master Fasilitas.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {categories.map(category => {
                const items = allFacilities[category] ?? [];
                if (items.length === 0) return null;
                const colors = CATEGORY_COLORS[category];
                return (
                    <div key={category} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                        <div className="px-4 py-2.5 flex items-center gap-2"
                            style={{ backgroundColor: colors.bg, borderBottom: '1px solid #E2E8F0' }}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors.text }} />
                            <span className="text-sm font-semibold" style={{ color: colors.text }}>
                                {CATEGORY_LABELS[category]}
                            </span>
                            <span className="ml-auto text-xs" style={{ color: colors.text }}>
                                {items.filter(f => checked.has(Number(f.id))).length}/{items.length} dipilih
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {items.map(facility => (
                                <label key={facility.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={checked.has(Number(facility.id))}
                                        onChange={() => toggle(Number(facility.id))}
                                        className="w-4 h-4 rounded shrink-0"
                                        style={{ accentColor: '#2563EB' }}
                                    />
                                    <span className="text-sm" style={{ color: '#1E293B' }}>{facility.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="flex items-center justify-between pt-2">
                <p className="text-xs" style={{ color: '#64748B' }}>
                    {checked.size} fasilitas dipilih
                </p>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{
                        backgroundColor: saving ? '#E8857A' : '#2563EB',
                        color: '#FFFFFF',
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#2563EB'; }}
                >
                    {saving ? 'Menyimpan...' : 'Simpan Fasilitas'}
                </button>
            </div>
        </div>
    );
}
