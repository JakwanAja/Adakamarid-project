import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

const pageContentStyles = `
    .page-content h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #2D1B18;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        line-height: 1.3;
    }
    .page-content h2 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2D1B18;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #EAE0DC;
        line-height: 1.35;
    }
    .page-content h3 {
        font-size: 1.05rem;
        font-weight: 600;
        color: #2D1B18;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }
    .page-content p {
        font-size: 0.9rem;
        color: #3D2820;
        line-height: 1.8;
        margin-bottom: 1rem;
    }
    .page-content ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }
    .page-content ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }
    .page-content li {
        font-size: 0.9rem;
        color: #3D2820;
        line-height: 1.8;
        margin-bottom: 0.3rem;
    }
    .page-content strong, .page-content b {
        font-weight: 700;
        color: #2D1B18;
    }
    .page-content a {
        color: #C0392B;
        text-decoration: underline;
    }
    .page-content a:hover {
        color: #A93226;
    }
    .page-content blockquote {
        border-left: 3px solid #C0392B;
        padding-left: 1rem;
        margin: 1.5rem 0;
        color: #8C6B63;
        font-style: italic;
    }
    .page-content hr {
        border: none;
        border-top: 1px solid #EAE0DC;
        margin: 2rem 0;
    }
    .page-content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
    .page-content th, .page-content td {
        padding: 0.5rem 0.75rem;
        border: 1px solid #EAE0DC;
        text-align: left;
    }
    .page-content th {
        background-color: #F5EDE9;
        font-weight: 600;
        color: #2D1B18;
    }
`;

export default function PageShow({ page }) {
    return (
        <GuestLayout>
            <Head title={`${page.title} — AdaKamar.id`} />

            {/* Inject CSS prose styles */}
            <style dangerouslySetInnerHTML={{ __html: pageContentStyles }} />

            <div style={{ backgroundColor: '#FBF7F5', minHeight: '60vh' }}>
                {/* Hero section */}
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
                            className="page-content bg-white rounded-2xl p-8"
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
