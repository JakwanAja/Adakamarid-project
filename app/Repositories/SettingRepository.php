<?php

namespace App\Repositories;

use App\Models\Setting;

class SettingRepository
{
    public function get(string $key, mixed $default = null): mixed
    {
        return Setting::get($key, $default);
    }

    public function set(string $key, mixed $value): void
    {
        Setting::set($key, $value);
    }

    public function getMultiple(array $keys): array
    {
        $result = [];
        foreach ($keys as $key) {
            $result[$key] = Setting::get($key);
        }
        return $result;
    }
}
