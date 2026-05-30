<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RbacService
{
    protected ?User $resolvedUser = null;

    public function user()
    {
        if ($this->resolvedUser !== null) {
            return $this->resolvedUser;
        }

        $user = Auth::user();
        $this->resolvedUser = $user instanceof User ? $user : null;

        return $this->resolvedUser;
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
            function () use ($user) {
                $user->loadMissing(['roles.permissions', 'permissions']);

                $directPermissions = $user->permissions->pluck('name');
                $rolePermissions = $user->roles
                    ->flatMap(fn ($role) => $role->permissions->pluck('name'));

                return $directPermissions
                    ->merge($rolePermissions)
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
            }
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
            function () use ($user) {
                $user->loadMissing('roles');

                return $user->roles
                    ->pluck('name')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
            }
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
