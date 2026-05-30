<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SecurityMonitoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function __construct(
        protected SecurityMonitoringService $securityMonitoring,
    ) {
    }

    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'device_id' => 'nullable|string|max:191',
            'location_hint' => 'nullable|string|max:191',
        ]);

        $email = Str::lower(trim((string) $request->input('email')));
        $user = $this->securityMonitoring->resolveUser($email);

        if ($block = $this->securityMonitoring->findMatchingActiveBlock($request, $user, $user?->login_id, $email)) {
            $this->securityMonitoring->recordEvent(
                'password_reset.blocked',
                $request,
                $user,
                'critical',
                [
                    'block_id' => $block->id,
                    'reason' => $block->reason,
                ],
                $user?->login_id,
                $email,
            );

            throw ValidationException::withMessages([
                'email' => ['Password reset is temporarily blocked for this account or device.'],
            ]);
        }

        $throttleKey = Str::transliterate($email.'|'.$request->ip().'|'.trim((string) $request->input('device_id')));

        if (RateLimiter::tooManyAttempts($throttleKey, 4)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            $this->securityMonitoring->recordEvent(
                'password_reset.rate_limited',
                $request,
                $user,
                'warning',
                [
                    'retry_after_seconds' => $seconds,
                ],
                $user?->login_id,
                $email,
            );

            throw ValidationException::withMessages([
                'email' => ["Too many reset attempts. Try again in {$seconds} seconds."],
            ]);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        RateLimiter::hit($throttleKey, 900);

        $this->securityMonitoring->recordEvent(
            $status == Password::RESET_LINK_SENT
                ? 'password_reset.requested'
                : 'password_reset.failed',
            $request,
            $user,
            $status == Password::RESET_LINK_SENT ? 'info' : 'warning',
            [
                'status' => $status,
            ],
            $user?->login_id,
            $email,
        );

        $resetAttempts = $this->securityMonitoring->recentEventCount('password_reset.requested', [
            'email' => $email,
            'ip_address' => $request->ip(),
            'device_id' => $request->input('device_id'),
        ]);

        if ($resetAttempts >= 3 && ! $this->securityMonitoring->recentRiskAlreadyLogged('password_reset.risk_detected', [
            'email' => $email,
            'ip_address' => $request->ip(),
            'device_id' => $request->input('device_id'),
        ])) {
            $event = $this->securityMonitoring->recordEvent(
                'password_reset.risk_detected',
                $request,
                $user,
                'high',
                [
                    'attempts_last_15_minutes' => $resetAttempts,
                ],
                $user?->login_id,
                $email,
            );

            if ($resetAttempts >= 6) {
                $this->securityMonitoring->createAutomaticBlock(
                    $request,
                    'Repeated forgot-password attempts detected.',
                    $user,
                    $user?->login_id,
                    $email,
                    $event,
                    30,
                    'critical',
                    [
                        'attempts_last_15_minutes' => $resetAttempts,
                    ],
                );
            }
        }

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
