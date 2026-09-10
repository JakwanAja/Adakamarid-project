import { Head, useForm, Link } from '@inertiajs/react';

export default function GuestRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('guest.register.post'), {
            onError: () => reset('password', 'password_confirmation'),
        });
    }

    function inputStyle(hasError) {
        return {
            border: `1px solid ${hasError ? '#C0392B' : '#EAE0DC'}`,
            backgroundColor: hasError ? '#FEF2F2' : '#FFFFFF',
            color: '#2D1B18',
        };
    }

    function handleFocus(e, hasError) {
        if (!hasError) {
            e.target.style.borderColor = '#C0392B';
            e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)';
        }
    }

    function handleBlur(e, hasError) {
        if (!hasError) {
            e.target.style.borderColor = '#EAE0DC';
            e.target.style.boxShadow = 'none';
        }
    }

    return (
        <>
            <Head title="Daftar — AdaKamar.id" />
            <div className="min-h-screen flex items-center justify-center px-4 py-8"
                style={{ backgroundColor: '#FBF7F5' }}>
                <div className="w-full max-w-sm">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/">
                            <img src="/image/logo.png" alt="AdaKamar.id"
                                className="h-10 w-auto object-contain mx-auto mb-3" />
                        </Link>
                        <p className="text-sm" style={{ color: '#8C6B63' }}>
                            Buat akun untuk memberikan ulasan kos
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-8"
                        style={{ border: '1px solid #EAE0DC' }}>

                        <h2 className="text-lg font-semibold mb-6" style={{ color: '#2D1B18' }}>
                            Daftar Akun
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5"
                                    style={{ color: '#2D1B18' }}>
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    autoComplete="name"
                                    autoFocus
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nama kamu"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                    style={inputStyle(errors.name)}
                                    onFocus={e => handleFocus(e, errors.name)}
                                    onBlur={e => handleBlur(e, errors.name)}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5"
                                    style={{ color: '#2D1B18' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                    style={inputStyle(errors.email)}
                                    onFocus={e => handleFocus(e, errors.email)}
                                    onBlur={e => handleBlur(e, errors.email)}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5"
                                    style={{ color: '#2D1B18' }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                    style={inputStyle(errors.password)}
                                    onFocus={e => handleFocus(e, errors.password)}
                                    onBlur={e => handleBlur(e, errors.password)}
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5"
                                    style={{ color: '#2D1B18' }}>
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                                    style={inputStyle(errors.password_confirmation)}
                                    onFocus={e => handleFocus(e, errors.password_confirmation)}
                                    onBlur={e => handleBlur(e, errors.password_confirmation)}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs" style={{ color: '#C0392B' }}>
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors mt-2"
                                style={{
                                    backgroundColor: processing ? '#E8857A' : '#C0392B',
                                    color: '#FFFFFF',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#A93226'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#C0392B'; }}
                            >
                                {processing ? 'Memproses...' : 'Buat Akun'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px" style={{ backgroundColor: '#EAE0DC' }} />
                            <span className="text-xs" style={{ color: '#8C6B63' }}>atau</span>
                            <div className="flex-1 h-px" style={{ backgroundColor: '#EAE0DC' }} />
                        </div>

                        {/* Google Register */}
                        <a href={route('guest.auth.google')}
                            className="flex items-center justify-center gap-3 w-full py-2.5 text-sm font-medium rounded-lg transition-colors"
                            style={{
                                border: '1px solid #EAE0DC',
                                color: '#2D1B18',
                                backgroundColor: '#FFFFFF',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Daftar dengan Google
                        </a>
                    </div>

                    {/* Login link */}
                    <p className="mt-5 text-center text-sm" style={{ color: '#8C6B63' }}>
                        Sudah punya akun?{' '}
                        <Link href="/login"
                            style={{ color: '#C0392B', fontWeight: 600 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#A93226'}
                            onMouseLeave={e => e.currentTarget.style.color = '#C0392B'}>
                            Masuk di sini
                        </Link>
                    </p>

                    {/* Back to home */}
                    <p className="mt-3 text-center">
                        <Link href="/"
                            className="text-xs transition-colors"
                            style={{ color: '#8C6B63' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#2D1B18'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8C6B63'}>
                            ← Kembali ke Beranda
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
