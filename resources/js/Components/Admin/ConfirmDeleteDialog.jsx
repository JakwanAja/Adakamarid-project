import { useEffect } from 'react';

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, itemName = 'item ini' }) {
    // Tutup saat tekan Escape
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && open) onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Prevent scroll saat dialog terbuka
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onClose}
        >
            {/* Panel — stopPropagation agar klik di dalam tidak menutup */}
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
                style={{ border: '1px solid #E2E8F0' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#FEF2F2' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <h3 className="text-base font-semibold text-center mb-2" style={{ color: '#1E293B' }}>
                        Hapus {itemName}?
                    </h3>
                    <p className="text-sm text-center mb-6" style={{ color: '#64748B' }}>
                        Tindakan ini tidak dapat dibatalkan. Data yang terhapus tidak bisa dipulihkan.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: '#F0F7FF', color: '#1E293B', border: '1px solid #E2E8F0' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0F7FF'}
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
