import GuestLayout from '@/Layouts/GuestLayout';
import KosCard from '@/Components/Guest/KosCard';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TYPE_LABELS = { putra: 'Putra', putri: 'Putri', campur: 'Campur' };
const TYPE_COLORS = {
    putra:  { bg: '#EFF6FF', text: '#1D4ED8' },
    putri:  { bg: '#FDF2F8', text: '#BE185D' },
    campur: { bg: '#F0FDF4', text: '#15803D' },
};
const PRICE_LABELS    = { harian: 'Hari', bulanan: 'Bulan', tahunan: 'Tahun' };
const CATEGORY_LABELS = {
    kamar:   'Fasilitas Kamar',
    bersama: 'Fasilitas Bersama',
    sekitar: 'Fasilitas Sekitar',
};

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(price);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

// â”€â”€ Star Display (read-only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StarDisplay({ rating, size = 'sm' }) {
    const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={sz}
                    viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#C0392B' : '#EAE0DC'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// â”€â”€ Star Rating (interactive) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"
                        viewBox="0 0 20 20"
                        fill={(hover || value) >= i ? '#C0392B' : '#EAE0DC'}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
            {value > 0 && (
                <span className="text-xs ml-2" style={{ color: '#8C6B63' }}>
                    {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'][value]}
                </span>
            )}
        </div>
    );
}

// â”€â”€ Review Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReviewForm({ kos, existingReview = null }) {
    const isEdit = !!existingReview;
    const fileInputRef = useRef(null);

    const [rating, setRating] = useState(existingReview?.rating ?? 0);
    const [comment, setComment] = useState(existingReview?.comment ?? '');
    const [photos, setPhotos] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    function handlePhotoChange(e) {
        const files = Array.from(e.target.files);
        setPhotos(files);
        const urls = files.map(f => URL.createObjectURL(f));
        setPreviewUrls(urls);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (rating === 0) return;
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment ?? '');

        // Method spoofing untuk PUT â€” tambahkan _method ke FormData
        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        photos.forEach((photo, i) => {
            formData.append(`photos[${i}]`, photo);
        });

        const url = isEdit
            ? route('reviews.update', { kos: kos.slug, review: existingReview.id })
            : route('reviews.store', { kos: kos.slug });

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => {
                if (!isEdit) {
                    setRating(0);
                    setComment('');
                }
                setPhotos([]);
                setPreviewUrls([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Rating */}
            <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D1B18' }}>
                    Rating <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <StarRating value={rating} onChange={setRating} />
                {errors.rating && (
                    <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors.rating}</p>
                )}
            </div>

            {/* Komentar */}
            <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                    Komentar <span className="text-xs font-normal" style={{ color: '#8C6B63' }}>(opsional)</span>
                </label>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Ceritakan pengalamanmu di kos ini..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none resize-none transition-all"
                    style={{
                        border: `1px solid ${errors.comment ? '#C0392B' : '#EAE0DC'}`,
                        backgroundColor: '#FFFFFF',
                        color: '#2D1B18',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = errors.comment ? '#C0392B' : '#EAE0DC'; e.target.style.boxShadow = 'none'; }}
                />
                <div className="flex justify-between mt-1">
                    {errors.comment ? (
                        <p className="text-xs" style={{ color: '#C0392B' }}>{errors.comment}</p>
                    ) : <span />}
                    <span className="text-xs" style={{ color: '#8C6B63' }}>
                        {(comment ?? '').length}/1000
                    </span>
                </div>
            </div>

            {/* Foto */}
            <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                    Foto <span className="text-xs font-normal" style={{ color: '#8C6B63' }}>
                        (opsional, maks 3 foto Â· JPEG/PNG Â· maks 2MB)
                    </span>
                </label>

                {/* Preview foto yang sudah ada (mode edit) */}
                {isEdit && existingReview.photos?.length > 0 && previewUrls.length === 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {existingReview.photos.map(p => (
                            <img key={p.id}
                                src={`/storage/${p.path}`}
                                alt="Foto ulasan"
                                className="w-16 h-16 object-cover rounded-lg"
                                style={{ border: '1px solid #EAE0DC' }}
                                onError={e => { e.currentTarget.src = '/image/placeholder_empty.png'; }}
                            />
                        ))}
                        <p className="text-xs self-center" style={{ color: '#8C6B63' }}>
                            Upload foto baru untuk mengganti
                        </p>
                    </div>
                )}

                {/* Preview foto baru */}
                {previewUrls.length > 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {previewUrls.map((url, i) => (
                            <img key={i} src={url} alt={`Preview ${i + 1}`}
                                className="w-16 h-16 object-cover rounded-lg"
                                style={{ border: '1px solid #C0392B' }}
                            />
                        ))}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handlePhotoChange}
                    className="w-full text-sm"
                    style={{ color: '#2D1B18' }}
                />
                {errors['photos.0'] && (
                    <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors['photos.0']}</p>
                )}
                {errors.photos && typeof errors.photos === 'string' && (
                    <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{errors.photos}</p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={processing || rating === 0}
                className="w-full py-2.5 text-sm font-semibold rounded-xl transition-colors"
                style={{
                    backgroundColor: (processing || rating === 0) ? '#EAE0DC' : '#C0392B',
                    color: (processing || rating === 0) ? '#8C6B63' : '#FFFFFF',
                    cursor: (processing || rating === 0) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!processing && rating > 0) e.currentTarget.style.backgroundColor = '#A93226'; }}
                onMouseLeave={e => { if (!processing && rating > 0) e.currentTarget.style.backgroundColor = '#C0392B'; }}
            >
                {processing ? 'Mengirim...' : isEdit ? 'Perbarui Ulasan' : 'Kirim Ulasan'}
            </button>
        </form>
    );
}

// â”€â”€ Facility Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FacilityBadge({ name }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ backgroundColor: '#F5EDE9', color: '#2D1B18', border: '1px solid #EAE0DC' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: '#C0392B' }} />
            {name}
        </span>
    );
}

// â”€â”€ Info Attribute (AC / WiFi / KM Dalam) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InfoAttr({ label, active, icon }) {
    return (
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
            style={{
                backgroundColor: active ? '#FEF2F0' : '#FAFAF9',
                border: `1px solid ${active ? '#F5C6C0' : '#EAE0DC'}`,
                opacity: active ? 1 : 0.45,
            }}>
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium"
                style={{ color: active ? '#C0392B' : '#8C6B63' }}>
                {label}
            </span>
        </div>
    );
}

// â”€â”€ Mosaic Photo Gallery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotoGallery({ photos }) {
    const sorted = photos ? [...photos].sort((a, b) => a.sort_order - b.sort_order) : [];
    const [activeIdx, setActiveIdx] = useState(0);

    if (sorted.length === 0) {
        return (
            <div className="w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2"
                style={{ aspectRatio: '16/9', backgroundColor: '#F5EDE9', border: '1px solid #EAE0DC' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none"
                    viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm" style={{ color: '#8C6B63' }}>Belum ada foto</span>
            </div>
        );
    }

    // Foto-foto selain yang aktif (untuk kolom kanan, max 4 slot)
    const sidePhotos = sorted.filter((_, i) => i !== activeIdx).slice(0, 4);

    return (
        <div className="grid gap-2 rounded-2xl overflow-hidden"
            style={{ gridTemplateColumns: '2fr 1fr', maxHeight: '420px' }}>

            {/* Foto utama â€” kiri besar */}
            <div className="relative overflow-hidden cursor-pointer" style={{ aspectRatio: '4/3' }}>
                <img
                    src={`/storage/${sorted[activeIdx].path}`}
                    alt="Foto utama"
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = '/image/placeholder_empty.png'; }}
                />
                {/* Counter foto */}
                {sorted.length > 1 && (
                    <div className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ backgroundColor: 'rgba(45,27,24,0.65)', color: '#FFFFFF' }}>
                        {activeIdx + 1} / {sorted.length}
                    </div>
                )}
            </div>

            {/* Grid kecil kanan â€” 4 slot */}
            <div className="grid gap-2" style={{ gridTemplateRows: 'repeat(4, 1fr)' }}>
                {[0, 1, 2, 3].map(i => {
                    const photo = sidePhotos[i];
                    if (!photo) {
                        return (
                            <div key={i} className="rounded-lg"
                                style={{ backgroundColor: '#F5EDE9', border: '1px solid #EAE0DC' }} />
                        );
                    }
                    const realIdx = sorted.findIndex(p => p.id === photo.id);
                    return (
                        <div key={photo.id}
                            onClick={() => setActiveIdx(realIdx)}
                            className="overflow-hidden rounded-lg cursor-pointer transition-opacity hover:opacity-80 relative">
                            <img
                                src={`/storage/${photo.path}`}
                                alt={`Foto ${i + 2}`}
                                className="w-full h-full object-cover"
                                onError={e => { e.currentTarget.src = '/image/placeholder_empty.png'; }}
                            />
                            {/* Overlay "Lihat semua" di slot ke-4 jika ada lebih banyak foto */}
                            {i === 3 && sorted.length > 5 && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                                    style={{ backgroundColor: 'rgba(45,27,24,0.55)' }}>
                                    <span className="text-xs font-bold text-white">
                                        +{sorted.length - 5} foto
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function KosShow({ kos, facilitiesByCategory, similarKos, userReview }) {
    const { auth } = usePage().props;
    const typeColor = TYPE_COLORS[kos.type] ?? { bg: '#F5F5F5', text: '#666' };

    // WhatsApp link
    const waNumber = kos.contact_whatsapp?.replace(/^0+/, '62') ?? '';
    const waMessage = encodeURIComponent(`Halo, saya tertarik dengan ${kos.name} yang saya temukan di AdaKamar.id`);
    const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

    const hasFacilities = Object.values(facilitiesByCategory ?? {}).some(arr => arr.length > 0);
    // Track riwayat kos yang pernah dilihat (disimpan di localStorage)
    useEffect(() => {
        if (!kos?.id) return;
        try {
            const raw = localStorage.getItem('kos_history');
            const history = raw ? JSON.parse(raw) : [];
            const filtered = history.filter(id => id !== kos.id);
            filtered.unshift(kos.id);           // tambah di depan
            const limited = filtered.slice(0, 20); // max 20 entri
            localStorage.setItem('kos_history', JSON.stringify(limited));
        } catch {}
    }, [kos?.id]);


    return (
        <GuestLayout>
            <Head title={`${kos.name} â€” AdaKamar.id`} />

            <div style={{ backgroundColor: '#FBF7F5', minHeight: '100vh' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-5 flex-wrap"
                        style={{ color: '#8C6B63' }}>
                        <Link href="/"
                            style={{ color: '#8C6B63' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#C0392B'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8C6B63'}>
                            Beranda
                        </Link>
                        <span>â€º</span>
                        <Link href="/kos"
                            style={{ color: '#8C6B63' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#C0392B'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8C6B63'}>
                            Cari Kos
                        </Link>
                        <span>â€º</span>
                        <span className="truncate max-w-xs font-medium"
                            style={{ color: '#2D1B18' }}>
                            {kos.name}
                        </span>
                    </nav>

                    {/* â”€â”€ Layout 2 kolom: konten kiri + sidebar kanan â”€â”€ */}
                    <div className="flex gap-6 items-start">

                        {/* â”€â”€ Konten Kiri â”€â”€ */}
                        <div className="flex-1 min-w-0 space-y-5">

                            {/* Galeri Foto */}
                            <PhotoGallery photos={kos.photos} />

                            {/* Judul + Meta */}
                            <div className="bg-white rounded-2xl p-5"
                                style={{ border: '1px solid #EAE0DC' }}>
                                <div className="flex items-start gap-3 flex-wrap mb-3">
                                    <h1 className="text-2xl font-bold flex-1 min-w-0"
                                        style={{ color: '#2D1B18' }}>
                                        {kos.name}
                                    </h1>
                                    {kos.is_plus && (
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 mt-1"
                                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>
                                            Plus
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                        style={{ backgroundColor: typeColor.bg, color: typeColor.text }}>
                                        Kos {TYPE_LABELS[kos.type]}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0"
                                            fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm" style={{ color: '#8C6B63' }}>
                                            {kos.district}, Yogyakarta
                                        </span>
                                    </div>
                                    {kos.rating_avg > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <StarDisplay rating={kos.rating_avg} />
                                            <span className="text-sm font-semibold"
                                                style={{ color: '#2D1B18' }}>
                                                {Number(kos.rating_avg).toFixed(1)}
                                            </span>
                                            <span className="text-xs"
                                                style={{ color: '#8C6B63' }}>
                                                ({kos.review_count} ulasan)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            {kos.description && (
                                <div className="bg-white rounded-2xl p-5"
                                    style={{ border: '1px solid #EAE0DC' }}>
                                    <h2 className="text-base font-semibold mb-3"
                                        style={{ color: '#2D1B18' }}>Deskripsi</h2>
                                    <p className="text-sm leading-relaxed whitespace-pre-line"
                                        style={{ color: '#5C4A45' }}>
                                        {kos.description}
                                    </p>
                                </div>
                            )}

                            {/* Info Umum */}
                            <div className="bg-white rounded-2xl p-5"
                                style={{ border: '1px solid #EAE0DC' }}>
                                <h2 className="text-base font-semibold mb-4"
                                    style={{ color: '#2D1B18' }}>Informasi Umum</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    <InfoAttr label="AC"         active={kos.has_ac}               icon="â„ï¸" />
                                    <InfoAttr label="WiFi"       active={kos.has_wifi}             icon="ðŸ“¶" />
                                    <InfoAttr label="KM Dalam"   active={kos.has_private_bathroom} icon="ðŸš¿" />
                                </div>
                            </div>

                            {/* Fasilitas */}
                            {hasFacilities && (
                                <div className="bg-white rounded-2xl p-5"
                                    style={{ border: '1px solid #EAE0DC' }}>
                                    <h2 className="text-base font-semibold mb-4"
                                        style={{ color: '#2D1B18' }}>Fasilitas</h2>
                                    <div className="space-y-5">
                                        {['kamar', 'bersama', 'sekitar'].map(cat => {
                                            const items = facilitiesByCategory[cat] ?? [];
                                            if (items.length === 0) return null;
                                            return (
                                                <div key={cat}>
                                                    <p className="text-xs font-semibold uppercase tracking-wider mb-2.5"
                                                        style={{ color: '#8C6B63' }}>
                                                        {CATEGORY_LABELS[cat]}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {items.map(f => (
                                                            <FacilityBadge key={f.id} name={f.name} />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Lokasi */}
                            <div className="bg-white rounded-2xl p-5"
                                style={{ border: '1px solid #EAE0DC' }}>
                                <h2 className="text-base font-semibold mb-3"
                                    style={{ color: '#2D1B18' }}>Lokasi</h2>
                                <p className="text-sm mb-4" style={{ color: '#5C4A45' }}>
                                    {kos.address}, {kos.district}, Yogyakarta
                                </p>
                                {kos.latitude && kos.longitude ? (
                                    <div className="rounded-xl overflow-hidden"
                                        style={{ height: '260px', border: '1px solid #EAE0DC' }}>
                                        <iframe
                                            title="Lokasi Kos"
                                            width="100%" height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps?q=${kos.latitude},${kos.longitude}&z=16&output=embed`}
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-xl flex items-center justify-center gap-2"
                                        style={{ height: '100px', backgroundColor: '#F5EDE9', border: '1px solid #EAE0DC' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="text-sm" style={{ color: '#8C6B63' }}>Peta tidak tersedia</span>
                                    </div>
                                )}
                            </div>

                            {/* Peraturan */}
                            {kos.rules && (
                                <div className="bg-white rounded-2xl p-5"
                                    style={{ border: '1px solid #EAE0DC' }}>
                                    <h2 className="text-base font-semibold mb-3"
                                        style={{ color: '#2D1B18' }}>Peraturan Kos</h2>
                                    <p className="text-sm leading-relaxed whitespace-pre-line"
                                        style={{ color: '#5C4A45' }}>
                                        {kos.rules}
                                    </p>
                                </div>
                            )}

                            {/* Ulasan */}
                            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #EAE0DC' }}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-base font-semibold" style={{ color: '#2D1B18' }}>
                                        Ulasan
                                        {kos.review_count > 0 && (
                                            <span className="ml-2 text-sm font-normal" style={{ color: '#8C6B63' }}>
                                                ({kos.review_count})
                                            </span>
                                        )}
                                    </h2>
                                    {kos.rating_avg > 0 && (
                                        <div className="flex items-center gap-2">
                                            <StarDisplay rating={kos.rating_avg} size="md" />
                                            <span className="text-lg font-bold" style={{ color: '#2D1B18' }}>
                                                {Number(kos.rating_avg).toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Form ulasan atau CTA login */}
                                {!auth?.user ? (
                                    <div className="rounded-xl p-4 mb-5 flex items-center gap-3"
                                        style={{ backgroundColor: '#F5EDE9', border: '1px solid #EAE0DC' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0"
                                            fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <p className="text-sm" style={{ color: '#8C6B63' }}>
                                            <a href="#login"
                                                style={{ color: '#C0392B', fontWeight: 600 }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                                                Login
                                            </a>
                                            {' '}untuk memberikan ulasan
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#FAFAF9', border: '1px solid #EAE0DC' }}>
                                        <p className="text-sm font-semibold mb-4" style={{ color: '#2D1B18' }}>
                                            {userReview ? 'âœï¸ Edit Ulasanmu' : 'ðŸ“ Tulis Ulasan'}
                                        </p>
                                        <ReviewForm kos={kos} existingReview={userReview} />
                                    </div>
                                )}

                                {/* Daftar ulasan */}
                                {kos.reviews && kos.reviews.length > 0 ? (
                                    <div className="space-y-5">
                                        {kos.reviews.map((review, idx) => (
                                            <div key={review.id}
                                                className={idx < kos.reviews.length - 1 ? 'pb-5' : ''}
                                                style={idx < kos.reviews.length - 1 ? { borderBottom: '1px solid #EAE0DC' } : {}}>
                                                <div className="flex items-start gap-3 mb-2">
                                                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                                                        style={{ backgroundColor: '#F5EDE9', color: '#C0392B' }}>
                                                        {review.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold" style={{ color: '#2D1B18' }}>
                                                                {review.user?.name ?? 'Pengguna'}
                                                                {/* Badge "Ulasanmu" jika ini ulasan user yang login */}
                                                                {auth?.user && review.user_id === auth.user.id && (
                                                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                                                                        style={{ backgroundColor: '#FEF2F0', color: '#C0392B' }}>
                                                                        Ulasanmu
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <span className="text-xs" style={{ color: '#8C6B63' }}>
                                                                {formatDate(review.created_at)}
                                                            </span>
                                                        </div>
                                                        <StarDisplay rating={review.rating} />
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm leading-relaxed ml-12" style={{ color: '#5C4A45' }}>
                                                        {review.comment}
                                                    </p>
                                                )}
                                                {review.photos && review.photos.length > 0 && (
                                                    <div className="flex gap-2 mt-3 ml-12 flex-wrap">
                                                        {review.photos.map(photo => (
                                                            <img key={photo.id}
                                                                src={`/storage/${photo.path}`}
                                                                alt="Foto ulasan"
                                                                className="w-16 h-16 rounded-lg object-cover"
                                                                style={{ border: '1px solid #EAE0DC' }}
                                                                onError={e => { e.currentTarget.src = '/image/placeholder_empty.png'; }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-center py-6" style={{ color: '#8C6B63' }}>
                                        Belum ada ulasan untuk kos ini
                                    </p>
                                )}
                            </div>

                        </div>{/* end konten kiri */}

                        {/* â”€â”€ Sidebar Kanan â”€â”€ */}
                        <aside className="w-72 shrink-0 sticky top-24 space-y-4">

                            {/* Card Harga + Kontak */}
                            <div className="bg-white rounded-2xl p-5"
                                style={{
                                    border: '1px solid #EAE0DC',
                                    boxShadow: '0 4px 20px rgba(45,27,24,0.09)',
                                }}>

                                {/* Harga */}
                                <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                                    style={{ color: '#8C6B63' }}>
                                    Harga Sewa
                                </p>

                                {kos.active_prices && kos.active_prices.length > 0 ? (
                                    <div className="space-y-2.5 mb-5">
                                        {kos.active_prices.map(price => (
                                            <div key={price.id}
                                                className="flex items-center justify-between py-2"
                                                style={{ borderBottom: '1px solid #EAE0DC' }}>
                                                <span className="text-xs px-2.5 py-1 rounded-full capitalize"
                                                    style={{ backgroundColor: '#F5EDE9', color: '#8C6B63' }}>
                                                    {price.type}
                                                </span>
                                                <span className="text-base font-bold"
                                                    style={{ color: '#C0392B' }}>
                                                    {formatPrice(price.price)}
                                                    <span className="text-xs font-normal ml-1"
                                                        style={{ color: '#8C6B63' }}>
                                                        /{PRICE_LABELS[price.type] ?? price.type}
                                                    </span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm italic mb-5" style={{ color: '#8C6B63' }}>
                                        Hubungi pemilik untuk informasi harga
                                    </p>
                                )}

                                {/* Kontak */}
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                                    style={{ color: '#8C6B63' }}>
                                    Kontak Pemilik
                                </p>
                                <p className="text-sm font-semibold mb-4" style={{ color: '#2D1B18' }}>
                                    {kos.contact_name}
                                </p>

                                {/* Tombol WhatsApp */}
                                {waLink ? (
                                    <a href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold rounded-xl transition-colors"
                                        style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1DA851'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                            viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Hubungi via WhatsApp
                                    </a>
                                ) : (
                                    <p className="text-xs italic text-center" style={{ color: '#8C6B63' }}>
                                        Nomor WhatsApp tidak tersedia
                                    </p>
                                )}
                            </div>

                            {/* Views counter */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white"
                                style={{ border: '1px solid #EAE0DC' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                    fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs" style={{ color: '#8C6B63' }}>
                                    Dilihat {kos.views_count ?? 0} kali
                                </span>
                            </div>

                        </aside>

                    </div>{/* end layout 2 kolom */}

                    {/* â”€â”€ Kos Serupa â”€â”€ */}
                    {similarKos && similarKos.length > 0 && (
                        <section className="mt-10">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold" style={{ color: '#2D1B18' }}>
                                    Kos Serupa di {kos.district}
                                </h2>
                                <Link
                                    href={`/kos?district=${encodeURIComponent(kos.district)}`}
                                    className="text-sm font-semibold transition-colors"
                                    style={{ color: '#C0392B' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                                    Lihat Semua â†’
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {similarKos.map(k => (
                                    <KosCard key={k.id} kos={k} />
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </GuestLayout>
    );
}
