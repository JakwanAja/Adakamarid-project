import ImageWithFallback from '@/Components/Shared/ImageWithFallback';
import ConfirmDeleteDialog from '@/Components/Admin/ConfirmDeleteDialog';
import { useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function PhotoManager({ kos, photos }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({ photo: null });

    function handleUpload(e) {
        e.preventDefault();
        if (!data.photo) return;
        post(route('admin.kos.photos.store', kos.slug), {
            forceFormData: true,
            onSuccess: () => { reset(); if (fileInputRef.current) fileInputRef.current.value = ''; },
            preserveScroll: true,
        });
    }

    function handleSetPrimary(photo) {
        router.patch(route('admin.kos.photos.setPrimary', { kos: kos.slug, photo: photo.id }), {}, {
            preserveScroll: true,
        });
    }

    function handleConfirmDelete() {
        router.delete(route('admin.kos.photos.destroy', { kos: kos.slug, photo: deleteTarget.id }), {
            preserveScroll: true,
        });
    }

    return (
        <div className="space-y-6">
            {/* Upload form */}
            <div className="p-4 rounded-xl" style={{ border: '1px dashed #EAE0DC', backgroundColor: '#FAFAF9' }}>
                <p className="text-sm font-medium mb-3" style={{ color: '#2D1B18' }}>Upload Foto Baru</p>
                <form onSubmit={handleUpload} className="flex items-center gap-3 flex-wrap">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={e => setData('photo', e.target.files[0])}
                        className="flex-1 text-sm min-w-0"
                        style={{ color: '#2D1B18' }}
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.photo}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0"
                        style={{
                            backgroundColor: (processing || !data.photo) ? '#EAE0DC' : '#C0392B',
                            color: (processing || !data.photo) ? '#8C6B63' : '#FFFFFF',
                            cursor: (processing || !data.photo) ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (!processing && data.photo) e.currentTarget.style.backgroundColor = '#A93226'; }}
                        onMouseLeave={e => { if (!processing && data.photo) e.currentTarget.style.backgroundColor = '#C0392B'; }}
                    >
                        {processing ? 'Mengunggah...' : 'Upload'}
                    </button>
                </form>
                {errors.photo && <p className="mt-2 text-xs" style={{ color: '#C0392B' }}>{errors.photo}</p>}
                <p className="text-xs mt-2" style={{ color: '#8C6B63' }}>
                    Maksimal 10 foto • Format JPEG, PNG, WebP • Maks 2 MB per foto
                </p>
            </div>

            {/* Photo grid */}
            {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos.map(photo => (
                        <div
                            key={photo.id}
                            className="relative rounded-xl overflow-hidden group"
                            style={{
                                border: photo.is_primary ? '2px solid #C0392B' : '1px solid #EAE0DC',
                                aspectRatio: '4/3',
                            }}
                        >
                            <ImageWithFallback
                                src={`/storage/${photo.path}`}
                                alt="Foto kos"
                                className="w-full h-full"
                            />
                            {photo.is_primary && (
                                <div className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>
                                    Utama
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                                {!photo.is_primary && (
                                    <button
                                        onClick={() => handleSetPrimary(photo)}
                                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-white"
                                        style={{ color: '#2D1B18' }}
                                    >
                                        Set Utama
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteTarget(photo)}
                                    className="p-1.5 rounded-lg"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm italic text-center py-10" style={{ color: '#8C6B63' }}>
                    Belum ada foto. Upload foto pertama di atas.
                </p>
            )}

            <ConfirmDeleteDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName="foto ini"
            />
        </div>
    );
}
