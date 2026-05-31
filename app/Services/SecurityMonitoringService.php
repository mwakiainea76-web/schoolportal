<?php

namespace App\Services;

use App\Models\SecurityBlock;
use App\Models\SecurityEvent;
use App\Models\User;
use App\Support\RequestLogContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SecurityMonitoringService
{
    public function contextFromRequest(Request $request): array
    {
        return [
            'ip_address' => $this->normalize($request->ip(), 45),
            'device_id' => $this->normalize($request->input('device_id', $request->header('X-Device-Id')), 191),
            'location_hint' => $this->normalize($request->input('location_hint', $request->header('X-Location-Hint')), 191),
            'user_agent' => $this->normalize($request->userAgent(), 2000),
            'route_name' => $request->route()?->getName(),
        ];
    }

    public function recordEvent(
        string $eventType,
        Request $request,
        ?User $user = null,
        string $riskLevel = 'info',
        array $context = [],
        ?string $loginIdentifier = null,
        ?string $email = null,
        bool $writeLog = true,
    ): SecurityEvent {
        $requestContext = $this->contextFromRequest($request);

        $event = SecurityEvent::create([
            'user_id' => $user?->id,
            'event_type' => $eventType,
            'risk_level' => $riskLevel,
            'login_identifier' => $this->normalize($loginIdentifier, 191),
            'email' => $this->normalize($email, 191),
            'ip_address' => $requestContext['ip_address'],
            'device_id' => $requestContext['device_id'],
            'location_hint' => $requestContext['location_hint'],
            'route_name' => $requestContext['route_name'],
            'user_agent' => $requestContext['user_agent'],
            'context' => $context,
            'occurred_at' => now(),
        ]);

        $logContext = RequestLogContext::request($request, [
            'level' => strtoupper($this->logLevel($riskLevel)),
            'event' => $eventType,
            'message' => $this->messageForEvent($eventType, $riskLevel),
            'event_id' => $event->id,
            'user_id' => $user?->id,
            'login_identifier' => $loginIdentifier,
            'email' => $email,
            'device_id' => $requestContext['device_id'],
            'location_hint' => $requestContext['location_hint'],
            'route_name' => $requestContext['route_name'],
            'risk_level' => $riskLevel,
            'status' => 'recorded',
            'context' => $context,
        ]);

        if ($writeLog) {
            Log::channel('security')->log($this->logLevel($riskLevel), $eventType, $logContext);
        }

        return $event;
    }

    public function findMatchingActiveBlock(
        Request $request,
        ?User $user = null,
        ?string $loginIdentifier = null,
        ?string $email = null,
    ): ?SecurityBlock {
        $context = $this->contextFromRequest($request);
        $loginIdentifier = $this->normalize($loginIdentifier, 191);
        $email = $this->normalize($email, 191);

        $blocks = SecurityBlock::query()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')
                    ->orWhere('ends_at', '>', now());
            })
            ->where(function ($query) use ($user, $loginIdentifier, $email, $context) {
                if ($user) {
                    $query->orWhere('user_id', $user->id);
                }

                if ($loginIdentifier) {
                    $query->orWhere('login_identifier', $loginIdentifier);
                }

                if ($email) {
                    $query->orWhere('email', $email);
                }

                if ($context['ip_address']) {
                    $query->orWhere('ip_address', $context['ip_address']);
                }

                if ($context['device_id']) {
                    $query->orWhere('device_id', $context['device_id']);
                }

                if ($context['location_hint']) {
                    $query->orWhere('location_hint', $context['location_hint']);
                }
            })
            ->latest('id')
            ->get();

        return $blocks
            ->filter(fn (SecurityBlock $block) => $this->blockMatches($block, $user, $loginIdentifier, $email, $context))
            ->sortByDesc(fn (SecurityBlock $block) => $this->specificityScore($block))
            ->first();
    }

    public function createAutomaticBlock(
        Request $request,
        string $reason,
        ?User $user = null,
        ?string $loginIdentifier = null,
        ?string $email = null,
        ?SecurityEvent $trigger = null,
        int $minutes = 30,
        string $riskLevel = 'critical',
        array $extraContext = [],
    ): ?SecurityBlock {
        if ($existing = $this->findMatchingActiveBlock($request, $user, $loginIdentifier, $email)) {
            return $existing;
        }

        $context = $this->contextFromRequest($request);

        if (! $user && ! $loginIdentifier && ! $email && ! $context['device_id'] && ! $context['ip_address']) {
            return null;
        }

        return SecurityBlock::create([
            'user_id' => $user?->id,
            'triggered_by_event_id' => $trigger?->id,
            'login_identifier' => $this->normalize($loginIdentifier, 191),
            'email' => $this->normalize($email, 191),
            'ip_address' => $context['ip_address'],
            'device_id' => $context['device_id'],
            'location_hint' => $context['location_hint'],
            'reason' => $reason,
            'risk_level' => $riskLevel,
            'starts_at' => now(),
            'ends_at' => now()->addMinutes($minutes),
            'context' => $extraContext,
        ]);
    }

    public function recentEventCount(
        string $eventType,
        array $attributes,
        int $minutes = 15,
    ): int {
        return SecurityEvent::query()
            ->where('event_type', $eventType)
            ->where('occurred_at', '>=', now()->subMinutes($minutes))
            ->where(function ($query) use ($attributes) {
                foreach ($attributes as $column => $value) {
                    if ($value !== null && $value !== '') {
                        $query->orWhere($column, $value);
                    }
                }
            })
            ->count();
    }

    public function recentRiskAlreadyLogged(string $eventType, array $attributes, int $minutes = 15): bool
    {
        return SecurityEvent::query()
            ->where('event_type', $eventType)
            ->where('occurred_at', '>=', now()->subMinutes($minutes))
            ->where(function ($query) use ($attributes) {
                foreach ($attributes as $column => $value) {
                    if ($value !== null && $value !== '') {
                        $query->orWhere($column, $value);
                    }
                }
            })
            ->exists();
    }

    public function resolveUser(?string $value): ?User
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        return User::query()
            ->whereRaw('LOWER(TRIM(email)) = ?', [Str::lower($value)])
            ->orWhereRaw('LOWER(TRIM(login_id)) = ?', [Str::lower($value)])
            ->first();
    }

    protected function blockMatches(
        SecurityBlock $block,
        ?User $user,
        ?string $loginIdentifier,
        ?string $email,
        array $context,
    ): bool {
        return (! $block->user_id || $block->user_id === $user?->id)
            && (! $block->login_identifier || $block->login_identifier === $loginIdentifier)
            && (! $block->email || $block->email === $email)
            && (! $block->ip_address || $block->ip_address === $context['ip_address'])
            && (! $block->device_id || $block->device_id === $context['device_id'])
            && (! $block->location_hint || $block->location_hint === $context['location_hint']);
    }

    protected function specificityScore(SecurityBlock $block): int
    {
        return collect([
            $block->user_id,
            $block->login_identifier,
            $block->email,
            $block->ip_address,
            $block->device_id,
            $block->location_hint,
        ])->filter()->count();
    }

    protected function normalize(mixed $value, int $limit): ?string
    {
        $value = trim((string) ($value ?? ''));

        return $value === '' ? null : Str::limit($value, $limit, '');
    }

    protected function logLevel(string $riskLevel): string
    {
        return match ($riskLevel) {
            'critical', 'high' => 'warning',
            'warning', 'medium' => 'notice',
            default => 'info',
        };
    }

    protected function messageForEvent(string $eventType, string $riskLevel): string
    {
        return "Security event '{$eventType}' recorded with {$riskLevel} risk for investigation.";
    }
}
