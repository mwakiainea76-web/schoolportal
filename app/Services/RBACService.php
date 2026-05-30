<?php
namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RbacService
{
    public function user()
    {
        return Auth::user();
    }

    public function permissions(): array
    {
        $user = $this->user();

        if (! $user) {
            return [];
        }

        return Cache::remember(
            "rbac.permissions.{$user->id}",
            now()->addMinutes(5),
            fn () => $user->getAllPermissions()->pluck('name')->all()
        );
    }

    public function roles(): array
    {
        $user = $this->user();

        if (! $user) {
            return [];
        }

        return Cache::remember(
            "rbac.roles.{$user->id}",
            now()->addMinutes(5),
            fn () => $user->getRoleNames()->all()
        );
    }

    public function can(string $permission): bool
    {
        return $this->user()?->can($permission) ?? false;
    }

    public function hasRole(string $role): bool
    {
        return $this->user()?->hasRole($role) ?? false;
    }
}
