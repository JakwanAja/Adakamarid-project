<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository
{
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findByGoogleId(string $googleId): ?User
    {
        return User::where('google_id', $googleId)->first();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function existsByEmail(string $email, ?int $excludeId = null): bool
    {
        $query = User::where('email', $email);
        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }
        return $query->exists();
    }

    public function allAdmins(): Collection
    {
        return User::admins()->orderBy('created_at', 'desc')->get();
    }

    public function allGuests(): Collection
    {
        return User::guests()->orderBy('created_at', 'desc')->get();
    }

    public function toggleActive(User $user): bool
    {
        return $user->update(['is_active' => !$user->is_active]);
    }
}
