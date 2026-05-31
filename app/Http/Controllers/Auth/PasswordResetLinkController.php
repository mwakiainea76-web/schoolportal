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
    private const PASSWORD_RESET_THROTTLE_SECONDS = 900;
    private const PASSWORD_RESET_BLOCK_THRESHOLD = 5;

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

        if (RateLimiter::tooManyAttempts($throttleKey, self::PASSWORD_RESET_BLOCK_THRESHOLD)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $riskContext = [
                'retry_after_seconds' => $seconds,
                'attempts_threshold' => self::PASSWORD_RESET_BLOCK_THRESHOLD,
            ];

            $event = $this->securityMonitoring->recordEvent(
                'password_reset.rate_limited',
                $request,
                $user,
                'critical',
                $riskContext,
                $user?->login_id,
                $email,
            );

            $this->securityMonitoring->createAutomaticBlock(
                $request,
                'Password reset attempt threshold exceeded.',
                $user,
                $user?->login_id,
                $email,
                $event,
                30,
                'critical',
                $riskContext,
            );

            throw ValidationException::withMessages([
                'email' => ['Attempt exceeded. Visit admin for password reset.'],
            ]);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        RateLimiter::hit($throttleKey, self::PASSWORD_RESET_THROTTLE_SECONDS);

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

        if ($resetAttempts >= self::PASSWORD_RESET_BLOCK_THRESHOLD && ! $this->securityMonitoring->recentRiskAlreadyLogged('password_reset.risk_detected', [
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

            throw ValidationException::withMessages([
                'email' => ['Attempt exceeded. Visit admin for password reset.'],
            ]);
        }

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
