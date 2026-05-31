<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;

class RbacCache
{
    public static function forgetAllUsers(): void
    {
        User::query()
            ->select('id')
            ->chunkById(200, function ($users): void {
                foreach ($users as $user) {
                    Cache::forget("rbac.payload.{$user->id}");
                }
            });
    }

    public static function forgetForUser(?User $user): void
    {
        if (! $user) {
            return;
        }

        Cache::forget("rbac.payload.{$user->id}");
    }

    public static function forgetForRole(Role $role): void
    {
        $role->loadMissing('users:id');

        foreach ($role->users as $user) {
            self::forgetForUser($user);
        }
    }
}
