import GuestLayout from '@/Layouts/GuestLayout';
import KosCard from '@/Components/Guest/KosCard';
import FilterPanel from '@/Components/Guest/FilterPanel';
import Pagination from '@/Components/Shared/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function KosIndex({ kos, filters: initialFilters, districts, errors }) {
    const [filters, setFilters] = useState({
        search:     initialFilters?.search ?? '',
        type:       initialFilters?.type ?? '',
        district:   initialFilters?.district ?? '',
        price_type: initialFilters?.price_type ?? '',
        price_min:  initialFilters?.price_min ?? '',
        price_max:  initialFilters?.price_max ?? '',
    });

    const [priceError, setPriceError] = useState('');

    function handleFilterChange(newFilters) {
        setFilters(newFilters);
    }

    function handleApply() {
        // Validasi client-side
        if (filters.price_min && filters.price_max) {
            if (parseInt(filters.price_min) > parseInt(filters.price_max)) {
                setPriceError('Harga minimum tidak boleh lebih besar dari harga maksimum.');
                return;
            }
        }
        setPriceError('');

        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });

        router.get(route('kos.index'), params, {
            preserveState: true,
            replace: true,
        });
    }

    function handleReset() {
        const empty = { search: '', type: '', district: '', price_type: '', price_min: '', price_max: '' };
        setFilters(empty);
        setPriceError('');
        router.get(route('kos.index'), {}, { preserveState: true, replace: true });
    }

    // Auto-apply saat filter radio/select berubah (bukan price input)
    useEffect(() => {
        const hasChange =
            filters.type !== (initialFilters?.type ?? '') ||
            filters.district !== (initialFilters?.district ?? '') ||
            filters.price_type !== (initialFilters?.price_type ?? '');

        if (hasChange) {
            const params = {};
            Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
            router.get(route('kos.index'), params, { preserveState: true, replace: true });
        }
    }, [filters.type, filters.district, filters.price_type]);

    const totalKos = kos?.total ?? 0;
    const kosList  = kos?.data ?? [];

    return (
        <GuestLayout>
            <Head title="Cari Kos di Yogyakarta" />

            <div style={{ backgroundColor: '#FBF7F5', minHeight: '100vh' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold" style={{ color: '#2D1B18' }}>Kos di Yogyakarta</h1>
                        <p className="text-sm mt-1" style={{ color: '#8C6B63' }}>
                            {totalKos > 0 ? `${totalKos} kos ditemukan` : 'Menampilkan semua kos tersedia'}
                        </p>
                    </div>

                    <div className="flex gap-6 items-start">

                        {/* ── Sidebar Filter ── */}
                        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
                            <FilterPanel
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={handleReset}
                                districts={districts}
                            />
                            {/* Apply button untuk harga */}
                            {(filters.price_min || filters.price_max) && (
                                <button onClick={handleApply}
                                    className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                                    Terapkan Filter Harga
                                </button>
                            )}
                            {priceError && (
                                <p className="mt-2 text-xs" style={{ color: '#C0392B' }}>{priceError}</p>
                            )}
                            {errors?.price && (
                                <p className="mt-2 text-xs" style={{ color: '#C0392B' }}>{errors.price}</p>
                            )}
                        </aside>

                        {/* ── Grid Kos ── */}
                        <div className="flex-1 min-w-0">
                            {kosList.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {kosList.map(item => (
                                            <KosCard key={item.id} kos={item} />
                                        ))}
                                    </div>
                                    {kos?.links && <Pagination links={kos.links} />}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE0DC' }}>
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                        style={{ backgroundColor: '#F5EDE9' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#8C6B63" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold mb-1" style={{ color: '#2D1B18' }}>Tidak ada kos yang ditemukan</p>
                                    <p className="text-xs mb-4" style={{ color: '#8C6B63' }}>Coba ubah atau reset filter pencarian</p>
                                    <button onClick={handleReset}
                                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                                        style={{ backgroundColor: '#F5EDE9', color: '#C0392B' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}>
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
