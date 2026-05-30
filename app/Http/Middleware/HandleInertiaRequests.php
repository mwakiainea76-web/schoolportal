<?php

namespace App\Http\Middleware;

use App\Services\RBACService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Root view
     */
    protected $rootView = 'app';

    /**
     * Determine asset version
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared props for all Inertia pages
     */
    public function share(Request $request): array
    {
        $rbac = app(RBACService::class);
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => $user
                    ? [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'email' => $user->email,
                    ]
                    : null,
                'roles' => fn () => $rbac->roles(),
                'permissions' => fn () => $rbac->permissions(),
            ],

            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],

            'search_term' => $request->session()->get('search_term', ''),
        ]);
    }
}
