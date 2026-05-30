<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Services\SecurityMonitoringService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    private const LOGIN_THROTTLE_SECONDS = 300;

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

        $user = User::query()
            ->whereRaw('LOWER(TRIM(login_id)) = ?', [Str::lower($login)])
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

            throw ValidationException::withMessages([
                'login' => 'This account has been deactivated. Please contact the administrator for assistance.',
            ]);
        }

        if (! $user || ! Auth::attempt(['email' => $user->email, 'password' => $password], $this->boolean('remember'))) {
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

            $failedAttempts = $securityMonitoring->recentEventCount('login.failed', [
                'login_identifier' => $login,
                'ip_address' => $this->ip(),
                'device_id' => $this->input('device_id'),
            ]);

            if ($failedAttempts >= 3 && ! $securityMonitoring->recentRiskAlreadyLogged('login.risk_detected', [
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

                if ($failedAttempts >= 8) {
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
            }

            throw ValidationException::withMessages([
                'login' => 'Invalid credentials. Please check your username and password, then try again.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
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

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => 'Too many failed login attempts. Please wait 5 minutes before trying again.',
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
