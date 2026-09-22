// ── Katalog icon fasilitas kos ────────────────────────────────
// Setiap icon adalah komponen SVG dengan className="w-4 h-4"
// Key adalah identifier yang disimpan di DB (kolom icon)

export const FACILITY_ICON_LIST = [
    // ── Kamar ─────────────────────────────────────────────────
    { key: 'ac',            label: 'AC / Air Conditioner' },
    { key: 'fan',           label: 'Kipas Angin' },
    { key: 'bed',           label: 'Kasur / Tempat Tidur' },
    { key: 'wardrobe',      label: 'Lemari Pakaian' },
    { key: 'desk',          label: 'Meja Belajar' },
    { key: 'chair',         label: 'Kursi' },
    { key: 'window',        label: 'Jendela' },
    { key: 'bathroom',      label: 'Kamar Mandi Dalam' },
    { key: 'shower',        label: 'Shower' },
    { key: 'water_heater',  label: 'Water Heater' },
    { key: 'mirror',        label: 'Cermin' },
    // ── Bersama ───────────────────────────────────────────────
    { key: 'wifi',          label: 'WiFi / Internet' },
    { key: 'kitchen',       label: 'Dapur Bersama' },
    { key: 'laundry',       label: 'Laundry / Mesin Cuci' },
    { key: 'parking_motor', label: 'Parkir Motor' },
    { key: 'parking_car',   label: 'Parkir Mobil' },
    { key: 'cctv',          label: 'CCTV / Keamanan' },
    { key: 'pool',          label: 'Kolam Renang' },
    { key: 'gym',           label: 'Gym / Fitness' },
    { key: 'tv',            label: 'TV Bersama' },
    { key: 'fridge',        label: 'Kulkas Bersama' },
    { key: 'dispenser',     label: 'Dispenser / Air Minum' },
    { key: 'trash',         label: 'Tempat Sampah' },
    // ── Sekitar ───────────────────────────────────────────────
    { key: 'minimarket',    label: 'Minimarket' },
    { key: 'mosque',        label: 'Masjid / Mushola' },
    { key: 'hospital',      label: 'Klinik / Rumah Sakit' },
    { key: 'restaurant',    label: 'Warung / Restoran' },
    { key: 'atm',           label: 'ATM / Bank' },
    { key: 'campus',        label: 'Dekat Kampus' },
    { key: 'bus_stop',      label: 'Halte / Trans Jogja' },
    { key: 'market',        label: 'Pasar / Supermarket' },
    { key: 'pet',           label: 'Boleh Hewan Peliharaan' },
    { key: 'no_smoking',    label: 'Bebas Rokok' },
    { key: 'office',        label: 'Kantor / Perkantoran' },
    { key: 'living_room',   label: 'Ruang Tamu' },
    { key: 'security',      label: 'Pembantu / Keamanan' },
];

// ── SVG icon per key ──────────────────────────────────────────
export function FacilityIcon({ iconKey, className = 'w-4 h-4', color = 'currentColor' }) {
    const props = { xmlns: 'http://www.w3.org/2000/svg', className, fill: 'none', viewBox: '0 0 24 24', stroke: color, strokeWidth: 1.8 };

    switch (iconKey) {
        case 'ac':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>;
        case 'fan':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
        case 'bed':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4M3 18v-4h18v4M3 18h18" /></svg>;
        case 'wardrobe':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v16H3V5a2 2 0 012-2zm7 0v18M9 10h.01M15 10h.01" /></svg>;
        case 'desk':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M4 17h16M4 5h16v8H4z" /></svg>;
        case 'chair':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 10V6a3 3 0 016 0v4M6 10h12m-6 4v5M8 19h8" /></svg>;
        case 'window':
            return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3v18" /></svg>;
        case 'bathroom':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 12a8 8 0 018-8m-8 8v6a2 2 0 002 2h12a2 2 0 002-2v-6" /></svg>;
        case 'shower':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0c-3.314 0-6 2.686-6 6H6m6-6c3.314 0 6 2.686 6 6h-.001M6 12H2m4 0v8M9 16h6M18 12h4m-4 0v8" /></svg>;
        case 'water_heater':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2zm5 5a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
        case 'mirror':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a7 7 0 017 7v1H5v-1a7 7 0 017-7zm0 0v18m-3 0h6" /></svg>;
        case 'wifi':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
        case 'kitchen':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11V6a2 2 0 00-2-2H7a2 2 0 00-2 2v5m14 0H5m14 0v7H5v-7M9 11V9m6 2V9m-3 8v-4" /></svg>;
        case 'laundry':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 5a4 4 0 100 8 4 4 0 000-8zm0 0a2 2 0 014 0" /></svg>;
        case 'parking_motor':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17H7m10 0a3 3 0 003-3V9a3 3 0 00-3-3H7a3 3 0 00-3 3v5a3 3 0 003 3m10 0H7m5-9v6" /></svg>;
        case 'parking_car':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 01-2-2v-4l2-5h14l2 5v4a2 2 0 01-2 2h-2m-8 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>;
        case 'cctv':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8h12v8H3z" /></svg>;
        case 'pool':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.5-1 3-1.5 4.5-1.5S10.5 16 12 17s3-.5 4.5-1.5S19 14 21 15M3 13l4-6 5 4 4-6 4 6M3 21h18" /></svg>;
        case 'gym':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4 10h2m12 0h2M7 10v4m10-4v4M9 10h6M9 14h6m-3-4V7m0 7v3" /></svg>;
        case 'tv':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M2 7h20v12a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm20 0l-2-4H4L2 7" /></svg>;
        case 'fridge':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v16H3V5a2 2 0 012-2zm0 7h14M9 8v3M9 14v2" /></svg>;
        case 'dispenser':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m-4 0h8a1 1 0 011 1v3H7V8a1 1 0 011-1zm-4 4v10h10V11m-5 0v6m-2-3h4" /></svg>;
        case 'trash':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
        case 'minimarket':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 5h11" /></svg>;
        case 'mosque':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C9 3 6 6 6 9c0 2 1 3.5 2 5h8c1-1.5 2-3 2-5 0-3-3-6-6-6zm0 0v2M6 14h12v7H6zM9 21v-4h6v4" /></svg>;
        case 'hospital':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zm-7-13v8m-4-4h8" /></svg>;
        case 'restaurant':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5a5 5 0 005 5v9m8-19v5l-3 3m3 2v9" /></svg>;
        case 'atm':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h.01M11 15h2M3 7h18v14H3zM3 7l2-4h14l2 4" /></svg>;
        case 'campus':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9h20L12 3zm-7 6v9h4v-5h6v5h4V9" /></svg>;
        case 'bus_stop':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v11H3zM7 18v2m10-2v2M7 11h.01M17 11h.01M3 7l2-4h14l2 4M9 11h6" /></svg>;
        case 'market':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
        case 'pet':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2 0-4 1.5-4 4s2 4 4 4 4-1.5 4-4-2-4-4-4zm-6 0a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2zM8 5a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" /></svg>;
        case 'no_smoking':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M15 12h3m-9 0h.01" /></svg>;
        case 'office':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
        case 'living_room':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10a4 4 0 014-4h10a4 4 0 014 4v4H3v-4zm0 4v4h18v-4M7 18v2m10-2v2" /></svg>;
        case 'security':
            return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
        default:
            return null;
    }
}