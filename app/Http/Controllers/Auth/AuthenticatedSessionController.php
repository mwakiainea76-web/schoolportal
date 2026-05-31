<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\SecurityMonitoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        protected SecurityMonitoringService $securityMonitoring,
    ) {
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        $this->securityMonitoring->recordEvent(
            'login.succeeded',
            $request,
            $user,
            'info',
            [
                'remember' => $request->boolean('remember'),
            ],
            $user?->login_id,
            $user?->email,
            false,
        );

        return redirect()->intended(route($this->dashboardRouteFor($user), absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function dashboardRouteFor(?User $user): string
    {
        if (! $user) {
            return 'dashboard';
        }

        $user->loadMissing('roles:id,name');
        $roles = $user->roles->pluck('name');

        if ($roles->contains('student')) {
            return 'student.dashboard';
        }

        if ($roles->contains('trainer') && ! $roles->contains('admin') && ! $roles->contains('hod')) {
            return 'trainer.dashboard';
        }

        return 'admin.dashboard';
    }
}
