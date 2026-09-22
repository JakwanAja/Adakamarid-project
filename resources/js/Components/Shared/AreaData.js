// ── Data Area Populer & Kampus Yogyakarta ─────────────────────
// Opsi B: mapping statis area/kampus → district yang ada di DB
// Filter bekerja dengan query: WHERE district IN (...)

export const POPULAR_AREAS = [
    {
        key:         'babarsari',
        label:       'Babarsari',
        description: 'Atma Jaya 3, UPN 2, dll',
        districts:   ['Depok', 'Depok, Sleman'],
        emoji:       '🏘️',
    },
    {
        key:         'bantul',
        label:       'Bantul',
        description: 'ISI Yogyakarta',
        districts:   ['Bantul', 'Imogiri', 'Banguntapan', 'Banguntapan, Bantul'],
        emoji:       '🏘️',
    },
    {
        key:         'condongcatur',
        label:       'Condongcatur',
        description: 'FE UII, AMIKOM, dll',
        districts:   ['Depok', 'Depok, Sleman'],
        emoji:       '🏘️',
    },
    {
        key:         'gejayan',
        label:       'Gejayan',
        description: 'UNY, Sanata Dharma, Atma Jaya',
        districts:   ['Depok', 'Depok, Sleman', 'Mlati', 'Mlati, Sleman', 'Gondokusuman', 'Gondokusuman, Kota Yogyakarta'],
        emoji:       '🏘️',
    },
    {
        key:         'glagahsari',
        label:       'Glagahsari',
        description: 'UAD, UTY, UST',
        districts:   ['Umbulharjo'],
        emoji:       '🏘️',
    },
    {
        key:         'jakal',
        label:       'Jakal',
        description: 'UGM, area Kaliurang km 1-7',
        districts:   ['Mlati', 'Mlati, Sleman', 'Ngaglik', 'Depok', 'Depok, Sleman'],
        emoji:       '🏘️',
    },
    {
        key:         'jakal_atas',
        label:       'Jakal Atas',
        description: 'UII, area Kaliurang km 8+',
        districts:   ['Ngaglik', 'Ngaglik, Sleman'],
        emoji:       '🏘️',
    },
    {
        key:         'jombor',
        label:       'Jombor',
        description: 'UTY, JCM, dll',
        districts:   ['Mlati', 'Mlati, Sleman'],
        emoji:       '🏘️',
    },
    {
        key:         'ringroad_barat',
        label:       'Ring Road Barat',
        description: 'UMY, UAD',
        districts:   ['Gamping', 'Kasihan', 'Kasihan, Bantul'],
        emoji:       '🏘️',
    },
    {
        key:         'seturan',
        label:       'Seturan',
        description: 'UPN, YKPN, Pakuwon Mall, dll',
        districts:   ['Depok', 'Depok, Sleman'],
        emoji:       '🏘️',
    },
];

export const CAMPUS_LIST = [
    { key: 'amikom',        label: 'AMIKOM',              districts: ['Depok', 'Depok, Sleman'] },
    { key: 'atmajaya_bb',   label: 'Atma Jaya Babarsari', districts: ['Depok', 'Depok, Sleman'] },
    { key: 'atmajaya_mr',   label: 'Atma Jaya Mrican',    districts: ['Gondokusuman', 'Gondokusuman, Kota Yogyakarta', 'Depok', 'Depok, Sleman'] },
    { key: 'isi',           label: 'ISI',                 districts: ['Bantul', 'Banguntapan', 'Banguntapan, Bantul'] },
    { key: 'uad_1',         label: 'UAD Kampus 1',        districts: ['Umbulharjo'] },
    { key: 'uad_234',       label: 'UAD Kampus 2, 3 & 4', districts: ['Banguntapan', 'Banguntapan, Bantul', 'Umbulharjo'] },
    { key: 'ugm',           label: 'UGM',                 districts: ['Depok', 'Depok, Sleman', 'Mlati', 'Mlati, Sleman'] },
    { key: 'uii_fe',        label: 'UII FE',              districts: ['Depok', 'Depok, Sleman'] },
    { key: 'uii_pusat',     label: 'UII Pusat',           districts: ['Ngaglik', 'Ngaglik, Sleman'] },
    { key: 'uin',           label: 'UIN SuKa',            districts: ['Banguntapan', 'Banguntapan, Bantul'] },
    { key: 'umy',           label: 'UMY',                 districts: ['Kasihan', 'Gamping'] },
    { key: 'uny',           label: 'UNY',                 districts: ['Gondokusuman', 'Gondokusuman, Kota Yogyakarta', 'Depok', 'Depok, Sleman'] },
    { key: 'upn',           label: 'UPN',                 districts: ['Depok', 'Depok, Sleman'] },
    { key: 'upy',           label: 'UPY',                 districts: ['Umbulharjo'] },
    { key: 'usd_mrican',    label: 'Sanata Dharma Mrican',   districts: ['Gondokusuman', 'Gondokusuman, Kota Yogyakarta'] },
    { key: 'usd_paingan',   label: 'Sanata Dharma Paingan',  districts: ['Mlati', 'Mlati, Sleman'] },
    { key: 'ust',           label: 'UST',                 districts: ['Umbulharjo'] },
    { key: 'uty',           label: 'UTY Pusat',           districts: ['Mlati', 'Mlati, Sleman'] },
    { key: 'ykpn',          label: 'YKPN',                districts: ['Depok', 'Depok, Sleman'] },
];

/**
 * Konversi key area/kampus ke array district untuk dipakai sebagai query param.
 * Mengembalikan array unik district yang cocok.
 */
export function getDistrictsByAreaKey(key) {
    const area = [...POPULAR_AREAS, ...CAMPUS_LIST].find(a => a.key === key);
    return area ? [...new Set(area.districts)] : [];
}