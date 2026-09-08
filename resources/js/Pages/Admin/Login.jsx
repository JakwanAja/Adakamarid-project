import { Head, useForm } from '@inertiajs/react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.login.post'), {
            onError: () => reset('password'),
        });
    }

    return (
        <>
            <Head title="Login Admin" />
            <div className="min-h-screen flex" style={{ backgroundColor: '#FBF7F5' }}>

                {/* ── Left panel (desktop only) ── */}
                <div
                    className="hidden lg:flex lg:w-2/5 xl:w-1/3 flex-col items-center justify-center p-12"
                    style={{ backgroundColor: '#2D1B18' }}
                >
                    {/* House SVG large */}
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
                        <path d="M8 36L36 10L64 36" stroke="#C0392B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 30V60C14 61.1046 14.8954 62 16 62H28V46H44V62H56C57.1046 62 58 61.1046 58 60V30" stroke="#FBF7F5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#FBF7F5' }}>AdaKamar.id</h1>
                    <p className="text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(245,237,233,0.45)' }}>Let's Place, Let's Ease</p>

                    <div className="w-12 h-px mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

                    <p className="text-sm text-center leading-relaxed max-w-xs" style={{ color: 'rgba(245,237,233,0.55)' }}>
                        Platform iklan kos terpercaya untuk area Yogyakarta. Kelola seluruh listing dari satu panel.
                    </p>
                </div>

                {/* ── Right panel / form ── */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-sm">

                        {/* Mobile logo (hanya tampil di mobile) */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center gap-3 mb-2">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 16L16 6L28 16" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 14V26C6 26.5523 6.44772 27 7 27H13V20H19V27H25C25.5523 27 26 26.5523 26 26V14" stroke="#2D1B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xl font-bold" style={{ color: '#2D1B18' }}>AdaKamar.id</span>
                            </div>
                            <p className="text-xs tracking-widest uppercase" style={{ color: '#8C6B63' }}>Admin Panel</p>
                        </div>

                        {/* Card */}
                        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #EAE0DC' }}>
                            <h2 className="text-lg font-semibold mb-1" style={{ color: '#2D1B18' }}>Masuk ke Dashboard</h2>
                            <p className="text-sm mb-6" style={{ color: '#8C6B63' }}>Masukkan email dan password admin Anda</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@adakamar.id"
                                        className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                        style={{
                                            border: `1px solid ${errors.email ? '#C0392B' : '#EAE0DC'}`,
                                            backgroundColor: errors.email ? '#FEF2F2' : '#FFFFFF',
                                            color: '#2D1B18',
                                        }}
                                        onFocus={e => { if (!errors.email) { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.12)'; }}}
                                        onBlur={e => { if (!errors.email) { e.target.style.borderColor = '#EAE0DC'; e.target.style.boxShadow = 'none'; }}}
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#2D1B18' }}>
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                        style={{
                                            border: `1px solid ${errors.password ? '#C0392B' : '#EAE0DC'}`,
                                            backgroundColor: errors.password ? '#FEF2F2' : '#FFFFFF',
                                            color: '#2D1B18',
                                        }}
                                        onFocus={e => { if (!errors.password) { e.target.style.borderColor = '#C0392B'; e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.12)'; }}}
                                        onBlur={e => { if (!errors.password) { e.target.style.borderColor = '#EAE0DC'; e.target.style.boxShadow = 'none'; }}}
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>{errors.password}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors mt-2"
                                    style={{
                                        backgroundColor: processing ? '#E8857A' : '#C0392B',
                                        color: '#FFFFFF',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                    }}
                                    onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#A93226'; }}
                                    onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#C0392B'; }}
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </button>
                            </form>
                        </div>

                        {/* Back link */}
                        <p className="mt-5 text-center text-xs" style={{ color: '#8C6B63' }}>
                            <a href="/" className="hover:underline transition-colors" style={{ color: '#8C6B63' }}>
                                ← Kembali ke AdaKamar.id
                            </a>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
