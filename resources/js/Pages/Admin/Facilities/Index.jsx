import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { FacilityIcon, FACILITY_ICON_LIST } from '@/Components/Shared/FacilityIcons';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const CATEGORY_LABELS = {
    kamar:   'Fasilitas Kamar',
    bersama: 'Fasilitas Bersama',
    sekitar: 'Fasilitas Sekitar',
};

const CATEGORY_COLORS = {
    kamar:   { bg: '#EFF6FF', text: '#2563EB', dot: '#2563EB' },
    bersama: { bg: '#EFF6FF', text: '#3B82F6', dot: '#3B82F6' },
    sekitar: { bg: '#F0FDF4', text: '#16A34A', dot: '#16A34A' },
};

// ── Icon Picker ───────────────────────────────────────────────
function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const selected = FACILITY_ICON_LIST.find(i => i.key === value);

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-full"
                style={{
                    border: `1px solid ${open ? '#2563EB' : '#E2E8F0'}`,
                    backgroundColor: '#FFFFFF',
                    color: value ? '#1E293B' : '#64748B',
                    boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
                }}
            >
                {value ? (
                    <>
                        <FacilityIcon iconKey={value} className="w-4 h-4 shrink-0" color="#2563EB" />
                        <span className="flex-1 text-left text-xs">{selected?.label ?? value}</span>
                    </>
                ) : (
                    <span className="flex-1 text-left text-xs">Pilih icon (opsional)</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
            </button>

            {/* Dropdown grid */}
            {open && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl overflow-y-auto"
                    style={{ border: '1px solid #E2E8F0', width: '280px', maxHeight: '280px' }}>
                    {/* Hapus pilihan */}
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs transition-colors"
                        style={{ color: '#64748B', borderBottom: '1px solid #E2E8F0' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Tanpa icon
                    </button>
                    {/* Grid icon */}
                    <div className="grid grid-cols-5 gap-1 p-2">
                        {FACILITY_ICON_LIST.map(item => (
                            <button
                                key={item.key}
                                type="button"
                                title={item.label}
                                onClick={() => { onChange(item.key); setOpen(false); }}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                                style={{
                                    backgroundColor: value === item.key ? '#EFF6FF' : 'transparent',
                                    border: value === item.key ? '1px solid #BFDBFE' : '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (value !== item.key) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                                onMouseLeave={e => { if (value !== item.key) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                <FacilityIcon
                                    iconKey={item.key}
                                    className="w-5 h-5"
                                    color={value === item.key ? '#2563EB' : '#64748B'}
                                />
                                <span className="text-[9px] leading-tight text-center truncate w-full"
                                    style={{ color: value === item.key ? '#2563EB' : '#94A3B8' }}>
                                    {item.label.split(' ')[0]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Add Form ──────────────────────────────────────────────────
function AddFacilityForm({ category }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: category,
        icon: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.facilities.store'), {
            onSuccess: () => reset('name', 'icon'),
            preserveScroll: true,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 py-3 space-y-2.5"
            style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div className="flex items-start gap-2">
                {/* Input nama */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder={`Nama ${CATEGORY_LABELS[category].toLowerCase()}...`}
                        className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                        style={{
                            border: `1px solid ${errors.name ? '#C0392B' : '#E2E8F0'}`,
                            backgroundColor: '#FFFFFF',
                            color: '#1E293B',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = errors.name ? '#C0392B' : '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    />
                    {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
                </div>
                {/* Tombol tambah */}
                <button
                    type="submit"
                    disabled={processing || !data.name.trim()}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0"
                    style={{
                        backgroundColor: (processing || !data.name.trim()) ? '#E2E8F0' : '#2563EB',
                        color: (processing || !data.name.trim()) ? '#64748B' : '#FFFFFF',
                        cursor: (processing || !data.name.trim()) ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!processing && data.name.trim()) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                    onMouseLeave={e => { if (!processing && data.name.trim()) e.currentTarget.style.backgroundColor = '#2563EB'; }}
                >
                    + Tambah
                </button>
            </div>
            {/* Icon picker */}
            <IconPicker value={data.icon} onChange={v => setData('icon', v)} />
        </form>
    );
}

// ── Facility Row ──────────────────────────────────────────────
function FacilityRow({ facility, onDeleteClick }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name:     facility.name,
        category: facility.category,
        icon:     facility.icon ?? '',
    });

    function handleSave() {
        put(route('admin.facilities.update', facility.id), {
            onSuccess: () => setEditing(false),
            preserveScroll: true,
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setEditing(false);
    }

    if (editing) {
        return (
            <tr style={{ backgroundColor: '#F8FAFC' }}>
                <td className="px-4 py-3" colSpan={2}>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full px-3 py-1.5 text-sm rounded-lg outline-none"
                            style={{
                                border: `1px solid ${errors.name ? '#C0392B' : '#2563EB'}`,
                                boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
                                color: '#1E293B',
                            }}
                        />
                        {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
                        <IconPicker value={data.icon} onChange={v => setData('icon', v)} />
                    </div>
                </td>
                <td className="px-4 py-3 text-right align-top">
                    <div className="flex items-center justify-end gap-2 mt-1">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg"
                            style={{ backgroundColor: '#F0F7FF', color: '#64748B' }}
                        >
                            Batal
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr className="group" style={{ borderTop: '1px solid #E2E8F0' }}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                    {/* Icon preview */}
                    {facility.icon ? (
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                            <FacilityIcon iconKey={facility.icon} className="w-4 h-4" color="#2563EB" />
                        </span>
                    ) : (
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#CBD5E1' }} />
                        </span>
                    )}
                    <span className="text-sm" style={{ color: '#1E293B' }}>{facility.name}</span>
                </div>
            </td>
            <td className="px-4 py-3 w-20" />
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setEditing(true)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#64748B' }}
                        title="Edit"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDeleteClick}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#64748B' }}
                        title="Hapus"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Category Section ──────────────────────────────────────────
function CategorySection({ category, facilities }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const colors = CATEGORY_COLORS[category];

    function handleConfirmDelete() {
        router.delete(route('admin.facilities.destroy', deleteTarget.id), {
            preserveScroll: true,
        });
        setDeleteTarget(null);
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3"
                style={{ backgroundColor: colors.bg, borderBottom: '1px solid #E2E8F0' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors.dot }} />
                <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
                    {CATEGORY_LABELS[category]}
                </h3>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: colors.text }}>
                    {facilities.length} item
                </span>
            </div>

            <table className="w-full">
                <tbody>
                    {facilities.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-sm italic"
                                style={{ color: '#64748B' }}>
                                Belum ada fasilitas dalam kategori ini
                            </td>
                        </tr>
                    ) : (
                        facilities.map(facility => (
                            <FacilityRow
                                key={facility.id}
                                facility={facility}
                                onDeleteClick={() => setDeleteTarget(facility)}
                            />
                        ))
                    )}
                </tbody>
            </table>

            <AddFacilityForm category={category} />

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name ?? 'fasilitas ini'}
            />
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FacilitiesIndex({ facilities }) {
    return (
        <AdminLayout title="Master Fasilitas">
            <Head title="Master Fasilitas" />
            <FlashMessage />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Master Fasilitas</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                        Kelola daftar fasilitas dan pilih icon untuk setiap fasilitas
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                {['kamar', 'bersama', 'sekitar'].map(category => (
                    <CategorySection
                        key={category}
                        category={category}
                        facilities={facilities[category] ?? []}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}