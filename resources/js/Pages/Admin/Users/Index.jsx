import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function ToggleSwitch({ checked, onChange }) {
    return (
        <button type="button" onClick={onChange}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
            style={{ backgroundColor: checked ? '#2563EB' : '#D1D5DB' }}>
            <span className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow mt-0.5 transition-transform duration-200"
                style={{ marginLeft: checked ? '18px' : '2px' }} />
        </button>
    );
}

function RoleBadge({ role }) {
    return (
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
                backgroundColor: role === 'admin' ? '#EFF6FF' : '#EFF6FF',
                color: role === 'admin' ? '#2563EB' : '#1D4ED8',
            }}>
            {role === 'admin' ? 'Admin' : 'Guest'}
        </span>
    );
}

function formatDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

function UserRow({ user, currentUserId, onDeleteClick }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name:  user.name,
        email: user.email,
    });

    function handleSave() {
        put(route('admin.users.update', user.id), {
            onSuccess: () => setEditing(false),
            preserveScroll: true,
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setEditing(false);
    }

    function handleToggleActive() {
        router.patch(route('admin.users.toggleActive', user.id), {}, { preserveScroll: true });
    }

    const isSelf = user.id === currentUserId;

    if (editing) {
        return (
            <tr style={{ backgroundColor: '#FFFBF9', borderBottom: '1px solid #E2E8F0' }}>
                <td className="px-4 py-3" colSpan={2}>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input value={data.name} onChange={e => setData('name', e.target.value)}
                                onKeyDown={handleKeyDown} autoFocus placeholder="Nama"
                                className="w-full px-3 py-1.5 text-sm rounded-lg outline-none"
                                style={{ border: '1px solid #2563EB', boxShadow: '0 0 0 2px rgba(192,57,43,0.1)', color: '#1E293B' }} />
                            {errors.name && <p className="text-xs mt-0.5" style={{ color: '#C0392B' }}>{errors.name}</p>}
                        </div>
                        <div className="flex-1">
                            <input value={data.email} onChange={e => setData('email', e.target.value)}
                                onKeyDown={handleKeyDown} placeholder="Email"
                                className="w-full px-3 py-1.5 text-sm rounded-lg outline-none"
                                style={{ border: `1px solid ${errors.email ? '#C0392B' : '#E2E8F0'}`, color: '#1E293B' }} />
                            {errors.email && <p className="text-xs mt-0.5" style={{ color: '#C0392B' }}>{errors.email}</p>}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3" colSpan={3}>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} disabled={processing}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button onClick={() => setEditing(false)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg"
                            style={{ backgroundColor: '#F0F7FF', color: '#64748B' }}>
                            Batal
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr className="group" style={{ borderBottom: '1px solid #E2E8F0' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: '#F0F7FF', color: '#2563EB' }}>
                        {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <p className="text-sm font-medium" style={{ color: '#1E293B' }}>{user.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{user.email}</p>
                    </div>
                    {isSelf && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: '#F0F7FF', color: '#64748B' }}>
                            Kamu
                        </span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <RoleBadge role={user.role} />
            </td>
            <td className="px-4 py-3">
                <ToggleSwitch checked={user.is_active} onChange={handleToggleActive} />
            </td>
            <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                {formatDate(user.created_at)}
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(true)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#64748B' }} title="Edit"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    {!isSelf && (
                        <button onClick={() => onDeleteClick(user)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#64748B' }} title="Hapus"
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

function UserTable({ users, currentUserId, onDeleteClick }) {
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl text-center py-10"
                style={{ border: '1px solid #E2E8F0' }}>
                <p className="text-sm italic" style={{ color: '#64748B' }}>Belum ada data</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                            {['Nama / Email', 'Role', 'Status', 'Terdaftar', 'Aksi'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                                    style={{ color: '#64748B' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <UserRow key={user.id} user={user}
                                currentUserId={currentUserId}
                                onDeleteClick={onDeleteClick} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AddAdminForm() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.users.storeAdmin'), {
            onSuccess: () => { reset(); setOpen(false); },
            preserveScroll: true,
        });
    }

    const inputStyle = (hasErr) => ({
        border: `1px solid ${hasErr ? '#2563EB' : '#E2E8F0'}`,
        backgroundColor: hasErr ? '#FEF2F2' : '#FFFFFF',
        color: '#1E293B',
    });

    if (!open) {
        return (
            <button onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Admin
            </button>
        );
    }

    return (
        <div className="bg-white rounded-xl p-5 mb-4 w-full max-w-2xl"
            style={{ border: '1px solid #E2E8F0' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#1E293B' }}>Tambah Akun Admin Baru</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#1E293B' }}>Nama</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                            placeholder="Nama lengkap"
                            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                            style={inputStyle(errors.name)} />
                        {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#1E293B' }}>Email</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                            placeholder="email@contoh.com"
                            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                            style={inputStyle(errors.email)} />
                        {errors.email && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#1E293B' }}>Password</label>
                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                            placeholder="Min. 8 karakter"
                            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                            style={inputStyle(errors.password)} />
                        {errors.password && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#1E293B' }}>Konfirmasi Password</label>
                        <input type="password" value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password"
                            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                            style={inputStyle(errors.password_confirmation)} />
                        {errors.password_confirmation && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.password_confirmation}</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" disabled={processing}
                        className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
                        style={{ backgroundColor: '#2563EB', color: '#FFFFFF', cursor: processing ? 'not-allowed' : 'pointer' }}
                        onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                        onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#2563EB'; }}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button type="button" onClick={() => { reset(); setOpen(false); }}
                        className="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#F0F7FF', color: '#1E293B' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0F7FF'}>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function UsersIndex({ admins, guests }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('admin');
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleConfirmDelete() {
        router.delete(route('admin.users.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const tabs = [
        { key: 'admin', label: 'Admin', count: admins?.length ?? 0 },
        { key: 'guest', label: 'Guest', count: guests?.length ?? 0 },
    ];

    return (
        <AdminLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />
            <FlashMessage />

            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Manajemen Pengguna</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                        {(admins?.length ?? 0) + (guests?.length ?? 0)} akun terdaftar
                    </p>
                </div>
                {activeTab === 'admin' && <AddAdminForm />}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ backgroundColor: '#F0F7FF' }}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{
                            backgroundColor: activeTab === tab.key ? '#2563EB' : 'transparent',
                            color: activeTab === tab.key ? '#FFFFFF' : '#64748B',
                        }}>
                        {tab.label}
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                                backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                                color: activeTab === tab.key ? '#FFFFFF' : '#64748B',
                            }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <UserTable
                users={activeTab === 'admin' ? (admins ?? []) : (guests ?? [])}
                currentUserId={auth?.user?.id}
                onDeleteClick={setDeleteTarget}
            />

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name ?? 'akun ini'}
            />
        </AdminLayout>
    );
}
