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
        $authPayload = fn () => $rbac->payload();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => function () use ($user, $authPayload) {
                    if (! $user) {
                        return null;
                    }

                    // Load roles first to determine profile source
                    $roles = $authPayload()['roles'];
                    $isStudent = in_array('student', $roles, true);

                    // Load only the relevant profile — no guessing
                    $profile = $isStudent
                        ? $user->loadMissing('student:id,user_id,first_name,last_name,profile_photo')->student
                        : $user->loadMissing('staff:id,user_id,first_name,last_name,profile_photo')->staff;

                    return [
                        'id' => $user->id,
                        'email' => $user->email,
                        'first_name' => $profile?->first_name,
                        'last_name' => $profile?->last_name,
                        'full_name' => $profile
                            ? trim("{$profile->first_name} {$profile->last_name}")
                            : $user->email,
                        'profile_photo' => $profile?->profile_photo,
                        'is_active' => $user->is_active,
                        'is_student' => $isStudent,
                    ];
                },
                'roles' => fn () => $authPayload()['roles'],
                'permissions' => fn () => $authPayload()['permissions'],
            ],

            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
        ],

            'search_term' => $request->session()->get('search_term', ''),
        ]);
    }
}
