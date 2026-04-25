<?php
namespace App\Services;

use Illuminate\Support\Facades\Auth;

class RbacService
{
    public function user()
    {
        return Auth::user();
    }

    public function permissions(): array
    {
        return $this->user()
            ? $this->user()->getAllPermissions()->pluck('name')->all()
            : [];
    }

    public function roles(): array
    {
        return $this->user()
            ? $this->user()->getRoleNames()->all()
            : [];
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