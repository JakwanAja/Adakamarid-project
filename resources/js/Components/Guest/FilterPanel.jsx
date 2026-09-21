const TYPE_OPTIONS = [
    { value: 'putra',  label: 'Kos Putra' },
    { value: 'putri',  label: 'Kos Putri' },
    { value: 'campur', label: 'Kos Campur' },
];

const PRICE_OPTIONS = [
    { value: 'harian',  label: 'Harian' },
    { value: 'bulanan', label: 'Bulanan' },
    { value: 'tahunan', label: 'Tahunan' },
];

function FilterSection({ title, children }) {
    return (
        <div className="pb-5 mb-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>{title}</p>
            {children}
        </div>
    );
}

function RadioOption({ name, value, checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer py-1 group">
            <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
                className="w-4 h-4" style={{ accentColor: '#2563EB' }} />
            <span className="text-sm" style={{ color: checked ? '#1E293B' : '#64748B', fontWeight: checked ? 600 : 400 }}>
                {label}
            </span>
        </label>
    );
}

export default function FilterPanel({ filters, onFilterChange, onReset, districts }) {
    function handleChange(key, value) {
        onFilterChange({ ...filters, [key]: value });
    }

    const hasActiveFilter = Object.values(filters).some(v => v !== '');

    return (
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold" style={{ color: '#1E293B' }}>Filter</h3>
                {hasActiveFilter && (
                    <button onClick={onReset}
                        className="text-xs font-medium transition-colors"
                        style={{ color: '#2563EB' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                        Reset
                    </button>
                )}
            </div>

            {/* Kecamatan */}
            <FilterSection title="Kecamatan">
                <select
                    value={filters.district ?? ''}
                    onChange={e => handleChange('district', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
                    style={{ border: '1px solid #E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF' }}
                >
                    <option value="">Semua Kecamatan</option>
                    {districts?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </FilterSection>

            {/* Tipe Kos */}
            <FilterSection title="Tipe Kos">
                <RadioOption name="type" value="" checked={!filters.type} onChange={() => handleChange('type', '')} label="Semua" />
                {TYPE_OPTIONS.map(opt => (
                    <RadioOption key={opt.value} name="type" value={opt.value}
                        checked={filters.type === opt.value}
                        onChange={() => handleChange('type', opt.value)}
                        label={opt.label} />
                ))}
            </FilterSection>

            {/* Tipe Sewa */}
            <FilterSection title="Tipe Sewa">
                <RadioOption name="price_type" value="" checked={!filters.price_type} onChange={() => handleChange('price_type', '')} label="Semua" />
                {PRICE_OPTIONS.map(opt => (
                    <RadioOption key={opt.value} name="price_type" value={opt.value}
                        checked={filters.price_type === opt.value}
                        onChange={() => handleChange('price_type', opt.value)}
                        label={opt.label} />
                ))}
            </FilterSection>

            {/* Rentang Harga */}
            <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Rentang Harga</p>
                <div className="space-y-2">
                    <input type="number" min="0" placeholder="Harga minimum"
                        value={filters.price_min ?? ''}
                        onChange={e => handleChange('price_min', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
                        style={{ border: '1px solid #E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF' }}
                        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    />
                    <input type="number" min="0" placeholder="Harga maksimum"
                        value={filters.price_max ?? ''}
                        onChange={e => handleChange('price_max', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
                        style={{ border: '1px solid #E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF' }}
                        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>
            </div>
        </div>
    );
}
