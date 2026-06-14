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
            ->where('email', $login)
            ->orWhere('login_id', $login)
            ->first();

        if (! $user) {
            $user = User::query()
                ->whereRaw('LOWER(TRIM(email)) = ?', [$normalizedLogin])
                ->orWhereRaw('LOWER(TRIM(login_id)) = ?', [$normalizedLogin])
                ->first();
        }

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
                    'login' => $login,
                ],
                'high_risk' => true,
            ]);

            throw ValidationException::withMessages([
                'login' => 'Access from this account or device has been temporarily blocked.',
            ]);
        }

        if ($user && ! $user->is_active) {
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
                'metadata' => [
                    'login' => $login,
                ],
                'high_risk' => true,
            ]);

            throw ValidationException::withMessages([
                'login' => 'Your account is locked. Contact administrator.',
            ]);
        }

        if (! $user || ! Hash::check($password, $user->password)) {
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
                'entity_label' => $user?->email ?: $login,
                'metadata' => [
                    'login' => $login,
                ],
            ]);

            $failedAttempts = $securityMonitoring->recentEventCount('login.failed', [
                'login_identifier' => $login,
                'ip_address' => $this->ip(),
                'device_id' => $this->input('device_id'),
            ]);

            if ($failedAttempts >= self::LOGIN_ATTEMPT_THRESHOLD && ! $securityMonitoring->recentRiskAlreadyLogged('login.risk_detected', [
                'login_identifier' => $login,
                'ip_address' => $this->ip(),
                'device_id' => $this->input('device_id'),
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
                    30,
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

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => 'Too many failed login attempts. You have been rate limited. Please wait 5 minutes before trying again.',
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(
            Str::lower($this->string('login'))
            .'|'.$this->ip()
            .'|'.trim((string) $this->input('device_id'))
            .'|'.trim((string) $this->input('location_hint'))
        );
    }
}
