import { useEffect, useRef } from 'react';

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, itemName = 'item ini' }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [open]);

    function handleBackdropClick(e) {
        if (e.target === dialogRef.current) onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="rounded-2xl shadow-xl p-0 backdrop:bg-black/40 max-w-sm w-full"
            style={{ border: '1px solid #EAE0DC', margin: 'auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', inset: 'unset' }}
        >
            <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#FEF2F2' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#C0392B" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                <h3 className="text-base font-semibold text-center mb-2" style={{ color: '#2D1B18' }}>
                    Hapus {itemName}?
                </h3>
                <p className="text-sm text-center mb-6" style={{ color: '#8C6B63' }}>
                    Tindakan ini tidak dapat dibatalkan. Data yang terhapus tidak bisa dipulihkan.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#F5EDE9', color: '#2D1B18', border: '1px solid #EAE0DC' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                        style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </dialog>
    );
}
