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
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Hitung berapa filter aktif (untuk badge di tombol)
    const activeFilterCount = [
        filters.type, filters.district, filters.price_type, filters.price_min, filters.price_max
    ].filter(Boolean).length;

    function handleFilterChange(newFilters) {
        setFilters(newFilters);
    }

    function handleApply() {
        if (filters.price_min && filters.price_max) {
            if (parseInt(filters.price_min) > parseInt(filters.price_max)) {
                setPriceError('Harga minimum tidak boleh lebih besar dari harga maksimum.');
                return;
            }
        }
        setPriceError('');
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        router.get(route('kos.index'), params, { preserveState: true, replace: true });
        setDrawerOpen(false);
    }

    function handleReset() {
        const empty = { search: '', type: '', district: '', price_type: '', price_min: '', price_max: '' };
        setFilters(empty);
        setPriceError('');
        router.get(route('kos.index'), {}, { preserveState: true, replace: true });
        setDrawerOpen(false);
    }

    useEffect(() => {
        const hasChange =
            filters.type     !== (initialFilters?.type ?? '') ||
            filters.district !== (initialFilters?.district ?? '') ||
            filters.price_type !== (initialFilters?.price_type ?? '');
        if (hasChange) {
            const params = {};
            Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
            router.get(route('kos.index'), params, { preserveState: true, replace: true });
        }
    }, [filters.type, filters.district, filters.price_type]);

    // Lock body scroll saat drawer terbuka
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const totalKos = kos?.total ?? 0;
    const kosList  = kos?.data ?? [];

    return (
        <GuestLayout>
            <Head title="Cari Kos di Yogyakarta" />

            <div style={{ backgroundColor: '#FBF7F5', minHeight: '100vh' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: '#2D1B18' }}>Kos di Yogyakarta</h1>
                            <p className="text-sm mt-0.5" style={{ color: '#8C6B63' }}>
                                {totalKos > 0 ? `${totalKos} kos ditemukan` : 'Menampilkan semua kos tersedia'}
                            </p>
                        </div>

                        {/* Tombol Filter — hanya muncul di mobile */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl relative"
                            style={{
                                backgroundColor: activeFilterCount > 0 ? '#FEF2F0' : '#FFFFFF',
                                border: `1.5px solid ${activeFilterCount > 0 ? '#C0392B' : '#EAE0DC'}`,
                                color: activeFilterCount > 0 ? '#C0392B' : '#2D1B18',
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Filter
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex gap-6 items-start">

                        {/* ── Sidebar Filter Desktop ── */}
                        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
                            <FilterPanel
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={handleReset}
                                districts={districts}
                            />
                            {(filters.price_min || filters.price_max) && (
                                <button onClick={handleApply}
                                    className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                                    style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                                    Terapkan Filter Harga
                                </button>
                            )}
                            {priceError && <p className="mt-2 text-xs" style={{ color: '#C0392B' }}>{priceError}</p>}
                        </aside>

                        {/* ── Grid Kos ── */}
                        <div className="flex-1 min-w-0">
                            {kosList.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                        {kosList.map(item => <KosCard key={item.id} kos={item} />)}
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
                                        style={{ backgroundColor: '#F5EDE9', color: '#C0392B' }}>
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filter Drawer Mobile ── */}
            {drawerOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />

                    {/* Drawer panel — slide dari kiri */}
                    <div className="relative z-10 w-80 max-w-[90vw] bg-white h-full flex flex-col shadow-2xl">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 shrink-0"
                            style={{ borderBottom: '1px solid #EAE0DC' }}>
                            <h2 className="text-base font-semibold" style={{ color: '#2D1B18' }}>
                                Filter Kos
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: '#FEF2F0', color: '#C0392B' }}>
                                        {activeFilterCount} aktif
                                    </span>
                                )}
                            </h2>
                            <button onClick={() => setDrawerOpen(false)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: '#8C6B63' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter content — scrollable */}
                        <div className="flex-1 overflow-y-auto p-5">
                            <FilterPanel
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={handleReset}
                                districts={districts}
                            />
                            {priceError && <p className="mt-2 text-xs" style={{ color: '#C0392B' }}>{priceError}</p>}
                        </div>

                        {/* Drawer footer — action buttons */}
                        <div className="shrink-0 p-4 flex gap-3" style={{ borderTop: '1px solid #EAE0DC' }}>
                            <button onClick={handleReset}
                                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors"
                                style={{ backgroundColor: '#F5EDE9', color: '#2D1B18', border: '1px solid #EAE0DC' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EAE0DC'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}>
                                Reset
                            </button>
                            <button onClick={handleApply}
                                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                                style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A93226'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C0392B'}>
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}