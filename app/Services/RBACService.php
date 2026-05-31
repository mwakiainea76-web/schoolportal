<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RBACService
{
    protected ?User $resolvedUser = null;
    protected ?array $resolvedPayload = null;

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
        return $this->payload()['permissions'];
    }

    public function roles(): array
    {
        return $this->payload()['roles'];
    }

    public function can(string $permission): bool
    {
        return $this->user()?->can($permission) ?? false;
    }

    public function hasRole(string $role): bool
    {
        return in_array(strtolower($role), array_map('strtolower', $this->roles()), true);
    }

    public function payload(): array
    {
        if ($this->resolvedPayload !== null) {
            return $this->resolvedPayload;
        }

        $user = $this->user();

        if (! $user) {
            return $this->resolvedPayload = [
                'roles' => [],
                'permissions' => [],
            ];
        }

        return $this->resolvedPayload = Cache::remember(
            "rbac.payload.{$user->id}",
            now()->addMinutes(5),
            function () use ($user) {
                $user->loadMissing(['roles.permissions:id,name', 'permissions:id,name']);

                $roles = $user->roles
                    ->pluck('name')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();

                $directPermissions = $user->permissions->pluck('name');
                $rolePermissions = $user->roles
                    ->flatMap(fn ($role) => $role->permissions->pluck('name'));

                $permissions = $directPermissions
                    ->merge($rolePermissions)
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();

                return [
                    'roles' => $roles,
                    'permissions' => $permissions,
                ];
            }
        );
    }
}
