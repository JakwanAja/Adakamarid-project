import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// ── Input helper ──────────────────────────────────────────────
function FormInput({ label, type = 'text', value, onChange, error, placeholder, autoFocus, autoComplete }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1E293B' }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
                style={{
                    border: `1px solid ${error ? '#2563EB' : '#E2E8F0'}`,
                    backgroundColor: error ? '#FEF2F2' : '#FFFFFF',
                    color: '#1E293B',
                }}
                onFocus={e => {
                    if (!error) {
                        e.target.style.borderColor = '#2563EB';
                        e.target.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.1)';
                    }
                }}
                onBlur={e => {
                    if (!error) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.boxShadow = 'none';
                    }
                }}
            />
            {error && <p className="mt-1 text-xs" style={{ color: '#2563EB' }}>{error}</p>}
        </div>
    );
}

// ── Google button ─────────────────────────────────────────────
function GoogleButton({ label }) {
    return (
        <a href={route('guest.auth.google')}
            className="flex items-center justify-center gap-3 w-full py-2.5 text-sm font-medium rounded-lg transition-colors"
            style={{ border: '1px solid #E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F0F7FF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {label}
        </a>
    );
}

// ── Login Form ────────────────────────────────────────────────
function LoginForm({ onSwitchToRegister }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('guest.login.post'), {
            onError: () => reset('password'),
        });
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: '#1E293B' }}>Masuk</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>
                Masuk untuk memberikan ulasan kos
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="nama@email.com"
                    autoFocus
                    autoComplete="email"
                />
                <FormInput
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                />

                <button type="submit" disabled={processing}
                    className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{
                        backgroundColor: processing ? '#E8857A' : '#2563EB',
                        color: '#FFFFFF',
                        cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                    onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#2563EB'; }}>
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                <span className="text-xs" style={{ color: '#64748B' }}>atau</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            </div>

            <GoogleButton label="Lanjutkan dengan Google" />

            <p className="mt-5 text-center text-sm" style={{ color: '#64748B' }}>
                Belum punya akun?{' '}
                <button type="button" onClick={onSwitchToRegister}
                    className="font-semibold transition-colors"
                    style={{ color: '#2563EB' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                    Daftar sekarang
                </button>
            </p>
        </div>
    );
}

// ── Register Form ─────────────────────────────────────────────
function RegisterForm({ onSwitchToLogin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('guest.register.post'), {
            onError: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: '#1E293B' }}>Daftar Akun</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>
                Buat akun untuk memberikan ulasan kos
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
                <FormInput
                    label="Nama Lengkap"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    error={errors.name}
                    placeholder="Nama kamu"
                    autoFocus
                    autoComplete="name"
                />
                <FormInput
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="nama@email.com"
                    autoComplete="email"
                />
                <FormInput
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                />
                <FormInput
                    label="Konfirmasi Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                />

                <button type="submit" disabled={processing}
                    className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors mt-1"
                    style={{
                        backgroundColor: processing ? '#E8857A' : '#2563EB',
                        color: '#FFFFFF',
                        cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                    onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = '#2563EB'; }}>
                    {processing ? 'Memproses...' : 'Buat Akun'}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                <span className="text-xs" style={{ color: '#64748B' }}>atau</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            </div>

            <GoogleButton label="Daftar dengan Google" />

            <p className="mt-5 text-center text-sm" style={{ color: '#64748B' }}>
                Sudah punya akun?{' '}
                <button type="button" onClick={onSwitchToLogin}
                    className="font-semibold transition-colors"
                    style={{ color: '#2563EB' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                    Masuk di sini
                </button>
            </p>
        </div>
    );
}

// ── Auth Modal ────────────────────────────────────────────────
export default function AuthModal({ open, mode = 'login', onClose }) {
    const [activeMode, setActiveMode] = useState(mode);

    // Reset ke mode yang diminta saat modal dibuka
    useEffect(() => {
        if (open) {
            setActiveMode(mode);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open, mode]);

    // Tutup dengan Escape
    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape' && open) onClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(45,27,24,0.5)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col"
                style={{ border: '1px solid #E2E8F0', maxHeight: '92dvh' }}
                onClick={e => e.stopPropagation()}
            >

                {/* Header modal */}
                <div className="flex items-center justify-between px-5 pt-4 pb-0">
                    <img src="/image/logo.png" alt="AdaKamar.id"
                        className="h-7 w-auto object-contain" />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.color = '#1E293B'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 pt-4 pb-8 sm:pb-4 overflow-y-auto flex-1">
                    {activeMode === 'login' ? (
                        <LoginForm
                            onSwitchToRegister={() => setActiveMode('register')}
                        />
                    ) : (
                        <RegisterForm
                            onSwitchToLogin={() => setActiveMode('login')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
