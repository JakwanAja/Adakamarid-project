import { Link } from '@inertiajs/react';

const TYPE_LABELS = { putra: 'Putra', putri: 'Putri', campur: 'Campur' };
const TYPE_COLORS = {
    putra:  { bg: '#EFF6FF', text: '#1D4ED8' },
    putri:  { bg: '#FDF2F8', text: '#BE185D' },
    campur: { bg: '#F0FDF4', text: '#15803D' },
};

function formatPrice(price) {
    if (!price) return null;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(price);
}

export default function KosCard({ kos }) {
    const primaryPhoto = kos.primary_photo;
    const lowestPrice  = kos.active_prices?.[0];
    const typeColor    = TYPE_COLORS[kos.type] ?? { bg: '#F5F5F5', text: '#666' };

    return (
        <Link href={`/kos/${kos.slug}`}
            className="block bg-white rounded-2xl overflow-hidden transition-all duration-200 group"
            style={{ border: '1px solid #EAE0DC', textDecoration: 'none' }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,27,24,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
            }}
        >
            {/* Foto */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img
                    src={primaryPhoto ? `/storage/${primaryPhoto.path}` : '/image/placeholder_empty.png'}
                    alt={kos.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badge Plus */}
                {kos.is_plus && (
                    <div className="absolute top-2.5 left-2.5">
                        <span className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>
                            Plus
                        </span>
                    </div>
                )}

                {/* Rating overlay */}
                {kos.rating_avg > 0 && (
                    <div className="absolute top-2.5 right-2.5">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(45,27,24,0.75)', color: '#FFFFFF' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="#FCD34D">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {Number(kos.rating_avg).toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3.5">
                <h3 className="text-sm font-semibold truncate mb-1" style={{ color: '#2D1B18' }}>
                    {kos.name}
                </h3>

                <div className="flex items-center gap-1 mb-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs truncate" style={{ color: '#8C6B63' }}>{kos.district}</span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: typeColor.bg, color: typeColor.text }}>
                        {TYPE_LABELS[kos.type] ?? kos.type}
                    </span>
                    {lowestPrice && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                            style={{ backgroundColor: '#F5EDE9', color: '#8C6B63' }}>
                            {lowestPrice.type}
                        </span>
                    )}
                </div>

                {/* Harga */}
                {lowestPrice ? (
                    <p className="text-sm font-bold" style={{ color: '#C0392B' }}>
                        {formatPrice(lowestPrice.price)}
                        <span className="text-xs font-normal ml-1" style={{ color: '#8C6B63' }}>
                            /{lowestPrice.type}
                        </span>
                    </p>
                ) : (
                    <p className="text-xs italic" style={{ color: '#8C6B63' }}>Hubungi pemilik</p>
                )}
            </div>
        </Link>
    );
}
