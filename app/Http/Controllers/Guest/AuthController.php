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
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    // -- Login -------------------------------------------------

    /** GET /login — redirect ke beranda, modal akan terbuka via hash */
    public function showLogin(): RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }
        return redirect('/#login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

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

        if (Auth::user()->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('home'));
    }

    // -- Register ----------------------------------------------

    /** GET /register — redirect ke beranda, modal akan terbuka via hash */
    public function showRegister(): RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }
        return redirect('/#register');
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

    // -- Logout ------------------------------------------------

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    // -- Google OAuth ------------------------------------------

    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            // Redirect ke beranda dengan hash login agar modal terbuka
            return redirect('/#login');
        }

        $user = $this->userRepository->findByGoogleId($googleUser->getId());

        if (!$user) {
            $user = $this->userRepository->findByEmail($googleUser->getEmail());

            if ($user) {
                $this->userRepository->update($user, [
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                ]);
            } else {
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

        if (!$user->is_active) {
            // Akun nonaktif — redirect ke beranda dengan hash login
            return redirect('/#login');
        }

        Auth::login($user);
        request()->session()->regenerate();

        return redirect()->route('home');
    }
}
