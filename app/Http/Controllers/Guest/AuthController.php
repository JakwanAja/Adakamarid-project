<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\LoginRequest;
use App\Http\Requests\Guest\RegisterRequest;
use App\Repositories\UserRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    // ── Login ─────────────────────────────────────────────────

    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }
        return Inertia::render('Guest/Auth/Login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        // Cek apakah akun terdaftar dan aktif
        $user = $this->userRepository->findByEmail($request->email);

        if ($user && !$user->is_active) {
            return back()->withErrors([
                'email' => 'Akun Anda telah dinonaktifkan.',
            ])->withInput($request->only('email'));
        }

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ])->withInput($request->only('email'));
        }

        $request->session()->regenerate();

        // Admin diarahkan ke dashboard, guest ke beranda
        if (Auth::user()->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('home'));
    }

    // ── Register ──────────────────────────────────────────────

    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }
        return Inertia::render('Guest/Auth/Register');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = $this->userRepository->create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'guest',
            'is_active' => true,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }

    // ── Logout ────────────────────────────────────────────────

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    // ── Google OAuth ──────────────────────────────────────────

    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('guest.login')
                ->withErrors(['email' => 'Autentikasi Google gagal. Silakan coba lagi.']);
        }

        // Cari berdasarkan google_id dulu
        $user = $this->userRepository->findByGoogleId($googleUser->getId());

        if (!$user) {
            // Cari berdasarkan email (user sudah punya akun tapi belum link Google)
            $user = $this->userRepository->findByEmail($googleUser->getEmail());

            if ($user) {
                // Link akun yang ada dengan Google
                $this->userRepository->update($user, [
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                ]);
            } else {
                // Buat akun baru via Google
                $user = $this->userRepository->create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'password'  => null,
                    'role'      => 'guest',
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                    'is_active' => true,
                ]);
            }
        }

        // Cek apakah akun aktif
        if (!$user->is_active) {
            return redirect()->route('guest.login')
                ->withErrors(['email' => 'Akun Anda telah dinonaktifkan.']);
        }

        Auth::login($user);
        request()->session()->regenerate();

        return redirect()->route('home');
    }
}
