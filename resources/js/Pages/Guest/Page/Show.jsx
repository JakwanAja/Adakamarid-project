import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function PageShow({ page }) {
    return (
        <GuestLayout>
            <Head title={`${page.title} — AdaKamar.id`} />

            <div style={{ backgroundColor: '#FBF7F5', minHeight: '60vh' }}>
                {/* Hero section kecil */}
                <div style={{ backgroundColor: '#2D1B18' }}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                            {page.title}
                        </h1>
                        <p className="text-sm mt-2" style={{ color: 'rgba(245,237,233,0.55)' }}>
                            AdaKamar.id
                        </p>
                    </div>
                </div>

                {/* Konten */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {page.content ? (
                        <div
                            className="bg-white rounded-2xl p-8 prose prose-sm max-w-none"
                            style={{ border: '1px solid #EAE0DC' }}
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center"
                            style={{ border: '1px solid #EAE0DC' }}>
                            <p className="text-base font-medium mb-2" style={{ color: '#2D1B18' }}>
                                Konten belum tersedia
                            </p>
                            <p className="text-sm" style={{ color: '#8C6B63' }}>
                                Halaman ini sedang dalam proses persiapan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
