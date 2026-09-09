import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Listen ke setiap Inertia navigation/request success
        const unsubscribe = router.on('success', (event) => {
            const flash = event.detail?.page?.props?.flash;

            if (flash?.success) {
                setMessage({ type: 'success', text: flash.success });
                setVisible(true);
            } else if (flash?.error) {
                setMessage({ type: 'error', text: flash.error });
                setVisible(true);
            }
        });

        // Cleanup listener saat komponen unmount
        return () => unsubscribe();
    }, []);

    // Auto-dismiss setelah 4 detik
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [visible, message]);

    if (!visible) return null;

    const isSuccess = message.type === 'success';

    return (
        <div
            className="fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm w-full"
            style={{
                backgroundColor: isSuccess ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`,
            }}
        >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                        viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                        viewBox="0 0 24 24" stroke="#C0392B" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>

            {/* Text */}
            <p className="text-sm flex-1" style={{ color: isSuccess ? '#15803D' : '#B91C1C' }}>
                {message.text}
            </p>

            {/* Close button */}
            <button
                onClick={() => setVisible(false)}
                className="shrink-0 ml-1"
                style={{ color: isSuccess ? '#86EFAC' : '#FCA5A5' }}
                aria-label="Tutup"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
