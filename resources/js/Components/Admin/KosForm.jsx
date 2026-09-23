const DISTRICTS = [
    'Danurejan', 'Gedongtengen', 'Gondokusuman', 'Gondomanan',
    'Jetis', 'Kotagede', 'Kraton', 'Mantrijeron', 'Mergangsan',
    'Ngampilan', 'Pakualaman', 'Tegalrejo', 'Umbulharjo', 'Wirobrajan',
    'Depok', 'Mlati', 'Gamping', 'Ngaglik', 'Kalasan',
    'Berbah', 'Prambanan', 'Sewon', 'Kasihan', 'Banguntapan',
    'Bantul', 'Imogiri', 'Pajangan',
];

const PROPERTY_TYPES = [
    { value: 'putra',      label: 'Kos Putra' },
    { value: 'putri',      label: 'Kos Putri' },
    { value: 'campur',     label: 'Kos Campur' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'villa',      label: 'Villa' },
];

function FormField({ label, error, children, required, hint }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1E293B' }}>
                {label} {required && <span style={{ color: '#2563EB' }}>*</span>}
                {hint && <span className="ml-1.5 text-xs font-normal" style={{ color: '#64748B' }}>{hint}</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>{error}</p>}
        </div>
    );
}

const inputStyle = (hasError) => ({
    border: `1px solid ${hasError ? '#C0392B' : '#E2E8F0'}`,
    backgroundColor: hasError ? '#FEF2F2' : '#FFFFFF',
    color: '#1E293B',
});

const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all";

export default function KosForm({ data, setData, errors }) {
    const isGuesthouse = data.type === 'guesthouse';
    const isKos = ['putra', 'putri', 'campur'].includes(data.type);

    return (
        <div className="space-y-5">
            {/* Nama & Tipe Properti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nama Properti" error={errors.name} required>
                    <input
                        type="text"
                        value={data.name ?? ''}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Kos Pak Budi / Guesthouse Melati..."
                        className={inputClass}
                        style={inputStyle(errors.name)}
                        maxLength={150}
                    />
                </FormField>
                <FormField label="Tipe Properti" error={errors.type} required>
                    <select
                        value={data.type ?? ''}
                        onChange={e => {
                            setData('type', e.target.value);
                            // Reset rooms_available jika pindah dari guesthouse
                            if (e.target.value !== 'guesthouse') {
                                setData('rooms_available', '');
                            }
                        }}
                        className={inputClass}
                        style={inputStyle(errors.type)}
                    >
                        <option value="">Pilih tipe</option>
                        {PROPERTY_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </FormField>
            </div>

            {/* Jumlah Kamar — hanya tampil untuk Guesthouse */}
            {isGuesthouse && (
                <FormField
                    label="Jumlah Kamar Tersedia"
                    error={errors.rooms_available}
                    hint="(khusus Guesthouse)"
                    required
                >
                    <input
                        type="number"
                        min="1"
                        max="999"
                        value={data.rooms_available ?? ''}
                        onChange={e => setData('rooms_available', e.target.value)}
                        placeholder="Contoh: 5"
                        className={inputClass}
                        style={inputStyle(errors.rooms_available)}
                    />
                    <p className="mt-1 text-xs" style={{ color: '#64748B' }}>
                        Masukkan total kamar yang tersedia untuk disewa saat ini
                    </p>
                </FormField>
            )}

            {/* Kecamatan & Alamat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Kecamatan" error={errors.district} required>
                    <select
                        value={data.district ?? ''}
                        onChange={e => setData('district', e.target.value)}
                        className={inputClass}
                        style={inputStyle(errors.district)}
                    >
                        <option value="">Pilih kecamatan</option>
                        {DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Alamat Lengkap" error={errors.address} required>
                    <input
                        type="text"
                        value={data.address ?? ''}
                        onChange={e => setData('address', e.target.value)}
                        placeholder="Jl. Kaliurang No. 12..."
                        className={inputClass}
                        style={inputStyle(errors.address)}
                    />
                </FormField>
            </div>

            {/* Deskripsi */}
            <FormField label="Deskripsi" error={errors.description}>
                <textarea
                    value={data.description ?? ''}
                    onChange={e => setData('description', e.target.value)}
                    placeholder="Deskripsi singkat tentang properti..."
                    rows={3}
                    className={inputClass}
                    style={inputStyle(errors.description)}
                />
            </FormField>

            {/* Peraturan */}
            <FormField label="Peraturan" error={errors.rules}>
                <textarea
                    value={data.rules ?? ''}
                    onChange={e => setData('rules', e.target.value)}
                    placeholder="Contoh: Tidak boleh bawa tamu menginap..."
                    rows={3}
                    className={inputClass}
                    style={inputStyle(errors.rules)}
                />
            </FormField>

            {/* Kontak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nama Kontak Pemilik" error={errors.contact_name} required>
                    <input
                        type="text"
                        value={data.contact_name ?? ''}
                        onChange={e => setData('contact_name', e.target.value)}
                        placeholder="Pak Budi"
                        className={inputClass}
                        style={inputStyle(errors.contact_name)}
                    />
                </FormField>
                <FormField label="Nomor WhatsApp" error={errors.contact_whatsapp} required>
                    <input
                        type="text"
                        value={data.contact_whatsapp ?? ''}
                        onChange={e => setData('contact_whatsapp', e.target.value)}
                        placeholder="08123456789"
                        className={inputClass}
                        style={inputStyle(errors.contact_whatsapp)}
                        maxLength={13}
                    />
                </FormField>
            </div>

            {/* Koordinat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Latitude" error={errors.latitude}>
                    <input type="number" step="any" value={data.latitude ?? ''}
                        onChange={e => setData('latitude', e.target.value)}
                        placeholder="-7.7956" className={inputClass} style={inputStyle(errors.latitude)} />
                </FormField>
                <FormField label="Longitude" error={errors.longitude}>
                    <input type="number" step="any" value={data.longitude ?? ''}
                        onChange={e => setData('longitude', e.target.value)}
                        placeholder="110.3695" className={inputClass} style={inputStyle(errors.longitude)} />
                </FormField>
            </div>

            {/* Fasilitas Umum */}
            <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#1E293B' }}>
                    Fasilitas Umum
                </label>
                <div className="flex flex-wrap gap-4">
                    {[
                        { key: 'has_ac',               label: 'AC' },
                        { key: 'has_wifi',              label: 'WiFi' },
                        { key: 'has_private_bathroom',  label: 'Kamar Mandi Dalam' },
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!data[key]}
                                onChange={e => setData(key, e.target.checked)}
                                className="w-4 h-4 rounded"
                                style={{ accentColor: '#2563EB' }}
                            />
                            <span className="text-sm" style={{ color: '#1E293B' }}>{label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}