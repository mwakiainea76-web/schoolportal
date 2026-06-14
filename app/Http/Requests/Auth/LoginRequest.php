<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Services\AuditService;
use App\Services\SecurityMonitoringService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    private const LOGIN_THROTTLE_SECONDS = 300;

    private const LOGIN_ATTEMPT_THRESHOLD = 5;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
            'device_id' => ['nullable', 'string', 'max:191'],
            'location_hint' => ['nullable', 'string', 'max:191'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login = trim($this->string('login')->toString());
        $password = $this->string('password')->toString();
        $securityMonitoring = app(SecurityMonitoringService::class);
        $normalizedLogin = Str::lower($login);

        $user = User::query()
            ->whereRaw('LOWER(TRIM(login_id)) = ?', [$normalizedLogin])
            ->first();

        if ($block = $securityMonitoring->findMatchingActiveBlock($this, $user, $login, $user?->email)) {
            $securityMonitoring->recordEvent(
                'login.blocked',
                $this,
                $user,
                'critical',
                [
                    'block_id' => $block->id,
                    'reason' => $block->reason,
                ],
                $login,
                $user?->email,
            );

            AuditService::log([
                'module' => 'authentication',
                'action' => 'user_lockout',
                'entity' => $user,
                'metadata' => [
                    'reason' => $block->reason,
                    'block_id' => $block->id,
                ],
                'high_risk' => true,
            ]);

            throw ValidationException::withMessages([
                'login' => 'Access from this account or device has been temporarily blocked.',
            ]);
        }

        // Always run a hash check, even for non-existent users, to avoid
        // timing-based account enumeration. A static dummy hash is used
        // when no user is found.
        $hashToCheck = $user?->password ?? config('auth.dummy_hash');
        $passwordValid = Hash::check($password, $hashToCheck);

        if (! $user || ! $passwordValid) {
            RateLimiter::hit($this->throttleKey(), self::LOGIN_THROTTLE_SECONDS);

            $securityMonitoring->recordEvent(
                'login.failed',
                $this,
                $user,
                'warning',
                [],
                $login,
                $user?->email,
            );

            AuditService::log([
                'module' => 'authentication',
                'action' => 'login_failure',
                'entity' => $user,
                'entity_type' => 'user',
                'entity_label' => $user?->login_id ?: $login,
                'metadata' => [],
            ]);

            $failedAttempts = $securityMonitoring->recentEventCount('login.failed', [
                'login_identifier' => $normalizedLogin,
                'ip_address' => $this->ip(),
            ]);

            if ($failedAttempts >= self::LOGIN_ATTEMPT_THRESHOLD && ! $securityMonitoring->recentRiskAlreadyLogged('login.risk_detected', [
                'login_identifier' => $normalizedLogin,
                'ip_address' => $this->ip(),
            ])) {
                $riskEvent = $securityMonitoring->recordEvent(
                    'login.risk_detected',
                    $this,
                    $user,
                    'high',
                    [
                        'failed_attempts_last_15_minutes' => $failedAttempts,
                    ],
                    $login,
                    $user?->email,
                );

                $securityMonitoring->createAutomaticBlock(
                    $this,
                    'Repeated incorrect login attempts detected.',
                    $user,
                    $login,
                    $user?->email,
                    $riskEvent,
                    self::LOGIN_THROTTLE_SECONDS / 60,
                    'critical',
                    [
                        'failed_attempts_last_15_minutes' => $failedAttempts,
                    ],
                );
            }

            throw ValidationException::withMessages([
                'login' => 'Please check your username and password, then try again.',
            ]);
        }

        // Inactive account check happens AFTER credential verification so
        // that an attacker can't use this response to enumerate accounts.
        if (! $user->is_active) {
            $securityMonitoring->recordEvent(
                'login.inactive_account',
                $this,
                $user,
                'warning',
                [],
                $login,
                $user->email,
            );

            AuditService::log([
                'module' => 'authentication',
                'action' => 'login_inactive_account',
                'entity' => $user,
                'metadata' => [],
                'high_risk' => true,
            ]);

            throw ValidationException::withMessages([
                'login' => 'Please check your username and password, then try again.',
            ]);
        }

        $user->loadMissing('roles:id,name');

        Auth::login($user, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), self::LOGIN_ATTEMPT_THRESHOLD)) {
            return;
        }

        app(SecurityMonitoringService::class)->recordEvent(
            'login.rate_limited',
            $this,
            null,
            'warning',
            [
                'throttle_key' => $this->throttleKey(),
            ],
            trim($this->string('login')->toString()),
        );

        AuditService::log([
            'module' => 'authentication',
            'action' => 'user_lockout',
            'entity_type' => 'user',
            'entity_label' => trim($this->string('login')->toString()),
            'metadata' => [
                'throttle_key' => $this->throttleKey(),
            ],
            'high_risk' => true,
        ]);

        event(new Lockout($this));

        throw ValidationException::withMessages([
            'login' => 'Too many failed login attempts. You have been rate limited. Please wait 5 minutes before trying again.',
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     *
     * Keyed only on the normalized login_id and IP address.
     * device_id / location_hint are client-supplied and must NOT be
     * part of the key, or an attacker can bypass throttling by
     * varying them on each request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(
            Str::lower(trim($this->string('login')->toString()))
            .'|'.$this->ip()
        );
    }
}
