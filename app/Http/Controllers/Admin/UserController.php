<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\Admin\UserService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService    $userService,
        private readonly UserRepository $userRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'admins' => $this->userRepository->allAdmins(),
            'guests' => $this->userRepository->allGuests(),
        ]);
    }

    public function storeAdmin(StoreAdminUserRequest $request)
    {
        try {
            $this->userService->createAdmin($request->validated());
            return back()->with('success', 'Akun admin berhasil dibuat.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $this->userService->update($user, $request->validated());
            return back()->with('success', 'Data akun berhasil diperbarui.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function toggleActive(User $user)
    {
        try {
            $this->userService->toggleActive($user, Auth::user());
            return back()->with('success', 'Status akun berhasil diubah.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->delete($user, Auth::user());
            return back()->with('success', 'Akun berhasil dihapus.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
