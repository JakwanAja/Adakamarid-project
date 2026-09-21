const DISTRICTS = [
    'Danurejan', 'Gedongtengen', 'Gondokusuman', 'Gondomanan',
    'Jetis', 'Kotagede', 'Kraton', 'Mantrijeron', 'Mergangsan',
    'Ngampilan', 'Pakualaman', 'Tegalrejo', 'Umbulharjo', 'Wirobrajan',
    'Depok', 'Mlati', 'Gamping', 'Ngaglik', 'Kalasan',
    'Berbah', 'Prambanan', 'Sewon', 'Kasihan', 'Banguntapan',
    'Bantul', 'Imogiri', 'Pajangan',
];

function FormField({ label, error, children, required }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1E293B' }}>
                {label} {required && <span style={{ color: '#2563EB' }}>*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs" style={{ color: '#2563EB' }}>{error}</p>}
        </div>
    );
}

const inputStyle = (hasError) => ({
    border: `1px solid ${hasError ? '#2563EB' : '#E2E8F0'}`,
    backgroundColor: hasError ? '#FEF2F2' : '#FFFFFF',
    color: '#1E293B',
});

const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all";

export default function KosForm({ data, setData, errors }) {
    return (
        <div className="space-y-5">
            {/* Nama & Tipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nama Kos" error={errors.name} required>
                    <input
                        type="text"
                        value={data.name ?? ''}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Kos Pak Budi"
                        className={inputClass}
                        style={inputStyle(errors.name)}
                        maxLength={150}
                    />
                </FormField>
                <FormField label="Tipe Kos" error={errors.type} required>
                    <select
                        value={data.type ?? ''}
                        onChange={e => setData('type', e.target.value)}
                        className={inputClass}
                        style={inputStyle(errors.type)}
                    >
                        <option value="">Pilih tipe</option>
                        <option value="putra">Putra</option>
                        <option value="putri">Putri</option>
                        <option value="campur">Campur</option>
                    </select>
                </FormField>
            </div>

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
                    placeholder="Deskripsi singkat tentang kos..."
                    rows={3}
                    className={inputClass}
                    style={inputStyle(errors.description)}
                />
            </FormField>

            {/* Peraturan */}
            <FormField label="Peraturan Kos" error={errors.rules}>
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
                    <input
                        type="number"
                        step="any"
                        value={data.latitude ?? ''}
                        onChange={e => setData('latitude', e.target.value)}
                        placeholder="-7.7956"
                        className={inputClass}
                        style={inputStyle(errors.latitude)}
                    />
                </FormField>
                <FormField label="Longitude" error={errors.longitude}>
                    <input
                        type="number"
                        step="any"
                        value={data.longitude ?? ''}
                        onChange={e => setData('longitude', e.target.value)}
                        placeholder="110.3695"
                        className={inputClass}
                        style={inputStyle(errors.longitude)}
                    />
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
