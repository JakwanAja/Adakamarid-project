import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const CATEGORY_LABELS = {
    kamar:   'Fasilitas Kamar',
    bersama: 'Fasilitas Bersama',
    sekitar: 'Fasilitas Sekitar',
};

const CATEGORY_COLORS = {
    kamar:   { bg: '#FEF2F0', text: '#C0392B', dot: '#C0392B' },
    bersama: { bg: '#FFF7ED', text: '#B45309', dot: '#B45309' },
    sekitar: { bg: '#F0FDF4', text: '#16A34A', dot: '#16A34A' },
};

function AddFacilityForm({ category }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: category,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.facilities.store'), {
            onSuccess: () => reset('name'),
            preserveScroll: true,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3"
            style={{ borderTop: '1px solid #EAE0DC', backgroundColor: '#FAFAF9' }}>
            <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder={`Tambah ${CATEGORY_LABELS[category].toLowerCase()}...`}
                className="flex-1 px-3 py-2 text-sm rounded-lg outline-none transition-all"
                style={{
                    border: `1px solid ${errors.name ? '#C0392B' : '#EAE0DC'}`,
                    backgroundColor: '#FFFFFF',
                    color: '#2D1B18',
                }}
                onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = errors.name ? '#C0392B' : '#EAE0DC'; e.target.style.boxShadow = 'none'; }}
            />
            <button
                type="submit"
                disabled={processing || !data.name.trim()}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0"
                style={{
                    backgroundColor: (processing || !data.name.trim()) ? '#EAE0DC' : '#C0392B',
                    color: (processing || !data.name.trim()) ? '#8C6B63' : '#FFFFFF',
                    cursor: (processing || !data.name.trim()) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!processing && data.name.trim()) e.currentTarget.style.backgroundColor = '#A93226'; }}
                onMouseLeave={e => { if (!processing && data.name.trim()) e.currentTarget.style.backgroundColor = '#C0392B'; }}
            >
                + Tambah
            </button>
            {errors.name && (
                <p className="text-xs absolute" style={{ color: '#C0392B' }}>{errors.name}</p>
            )}
        </form>
    );
}

function FacilityRow({ facility, onDeleteClick }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: facility.name,
        category: facility.category,
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
            <tr style={{ backgroundColor: '#FFFBF9' }}>
                <td className="px-4 py-3" colSpan={2}>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full px-3 py-1.5 text-sm rounded-lg outline-none"
                        style={{
                            border: `1px solid ${errors.name ? '#C0392B' : '#C0392B'}`,
                            boxShadow: '0 0 0 3px rgba(192,57,43,0.1)',
                            color: '#2D1B18',
                        }}
                    />
                    {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
                </td>
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: '#F5EDE9', color: '#8C6B63' }}
                        >
                            Batal
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr className="group" style={{ borderTop: '1px solid #EAE0DC' }}>
            <td className="px-4 py-3 text-sm" style={{ color: '#2D1B18' }}>
                {facility.name}
            </td>
            <td className="px-4 py-3 w-20">
                {/* empty — kategori sudah ada di section header */}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Edit */}
                    <button
                        onClick={() => setEditing(true)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#8C6B63' }}
                        title="Edit"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5EDE9'; e.currentTarget.style.color = '#2D1B18'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    {/* Delete */}
                    <button
                        onClick={onDeleteClick}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#8C6B63' }}
                        title="Hapus"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEF2F0'; e.currentTarget.style.color = '#C0392B'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8C6B63'; }}
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

function CategorySection({ category, facilities }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const colors = CATEGORY_COLORS[category];

    function handleConfirmDelete() {
        router.delete(route('admin.facilities.destroy', deleteTarget.id), {
            preserveScroll: true,
        });
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #EAE0DC' }}>
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: colors.bg, borderBottom: '1px solid #EAE0DC' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors.dot }} />
                <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
                    {CATEGORY_LABELS[category]}
                </h3>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: colors.text }}>
                    {facilities.length} item
                </span>
            </div>

            {/* Table */}
            <table className="w-full">
                <tbody>
                    {facilities.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-sm italic" style={{ color: '#8C6B63' }}>
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

            {/* Add form */}
            <AddFacilityForm category={category} />

            {/* Delete dialog */}
            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name ?? 'fasilitas ini'}
            />
        </div>
    );
}

export default function FacilitiesIndex({ facilities }) {
    return (
        <AdminLayout title="Master Fasilitas">
            <Head title="Master Fasilitas" />
            <FlashMessage />

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#2D1B18' }}>Master Fasilitas</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#8C6B63' }}>
                        Kelola daftar fasilitas yang tersedia untuk setiap kos
                    </p>
                </div>
            </div>

            {/* 3 category sections */}
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
