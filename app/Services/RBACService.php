<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RBACService
{
    protected const CACHE_TTL_MINUTES = 60;

    protected const SHARED_NAV_PERMISSIONS = [
        'students.view',
        'students.create',
        'departments.view',
        'exam.bodies.view',
        'certification.levels.view',
        'programs.view',
        'program-versions.view',
        'programs.program-version-mappings.view',
        'units.view',
        'units.program-version-units.view',
        'academic.years.view',
        'academic.sessions.view',
        'billing.ledger.view',
    ];

    protected ?User $resolvedUser = null;
    protected ?array $resolvedPayload = null;
    protected array $resolvedUiPermissions = [];

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
            now()->addMinutes(self::CACHE_TTL_MINUTES),
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

    public function uiPermissions(?string $routeName = null): array
    {
        $cacheKey = $routeName ?? '__global__';

        if (array_key_exists($cacheKey, $this->resolvedUiPermissions)) {
            return $this->resolvedUiPermissions[$cacheKey];
        }

        $permissions = collect($this->payload()['permissions']);
        $allowedPrefixes = $this->routePermissionPrefixes($routeName);

        return $this->resolvedUiPermissions[$cacheKey] = $permissions
            ->filter(function (string $permission) use ($allowedPrefixes) {
                if (in_array($permission, self::SHARED_NAV_PERMISSIONS, true)) {
                    return true;
                }

                foreach ($allowedPrefixes as $prefix) {
                    if ($permission === $prefix || str_starts_with($permission, $prefix.'.')) {
                        return true;
                    }
                }

                return false;
            })
            ->values()
            ->all();
    }

    private function routePermissionPrefixes(?string $routeName): array
    {
        if (! $routeName) {
            return [];
        }

        $segments = explode('.', $routeName);

        if (count($segments) > 1 && in_array(end($segments), [
            'index',
            'create',
            'store',
            'show',
            'edit',
            'update',
            'destroy',
            'search',
        ], true)) {
            array_pop($segments);
        }

        $prefixes = [];

        for ($i = 0; $i < count($segments); $i++) {
            $prefixes[] = implode('.', array_slice($segments, 0, $i + 1));
        }

        return array_values(array_unique(array_filter($prefixes)));
    }
}
