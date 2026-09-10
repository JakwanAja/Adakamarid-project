<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    /**
     * @throws \InvalidArgumentException jika email sudah terdaftar
     */
    public function createAdmin(array $data): User
    {
        if ($this->userRepository->existsByEmail($data['email'])) {
            throw new \InvalidArgumentException('Email sudah terdaftar.');
        }

        return $this->userRepository->create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'role'      => 'admin',
            'is_active' => true,
        ]);
    }

    /**
     * @throws \InvalidArgumentException jika email dipakai user lain
     */
    public function update(User $user, array $data): User
    {
        if (isset($data['email']) && $this->userRepository->existsByEmail($data['email'], $user->id)) {
            throw new \InvalidArgumentException('Email sudah terdaftar.');
        }

        $updateData = [];
        if (!empty($data['name']))  $updateData['name']  = $data['name'];
        if (!empty($data['email'])) $updateData['email'] = $data['email'];
        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $this->userRepository->update($user, $updateData);
        return $user->fresh();
    }

    /**
     * @throws \InvalidArgumentException jika mencoba nonaktifkan diri sendiri
     */
    public function toggleActive(User $user, User $currentAdmin): void
    {
        if ($user->id === $currentAdmin->id) {
            throw new \InvalidArgumentException('Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }
        $this->userRepository->toggleActive($user);
    }

    /**
     * @throws \InvalidArgumentException jika mencoba hapus diri sendiri
     */
    public function delete(User $user, User $currentAdmin): void
    {
        if ($user->id === $currentAdmin->id) {
            throw new \InvalidArgumentException('Anda tidak dapat menghapus akun Anda sendiri.');
        }
        $user->delete();
    }
}
