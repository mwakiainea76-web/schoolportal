<?php

namespace App\Http\Controllers;

use App\Models\SecurityBlock;
use App\Models\SecurityEvent;
use App\Services\SecurityMonitoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityMonitoringController extends Controller
{
    public function __construct(
        protected SecurityMonitoringService $securityMonitoring,
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'risk' => (string) $request->query('risk', ''),
            'event' => (string) $request->query('event', ''),
            'search' => trim((string) $request->query('search', '')),
        ];
        $eventPerPage = max(10, min((int) $request->query('event_per_page', 25), 100));
        $blockPerPage = max(10, min((int) $request->query('block_per_page', 15), 100));

        $events = SecurityEvent::query()
            ->with('user:id,first_name,last_name,login_id,email')
            ->when($filters['risk'], fn ($query) => $query->where('risk_level', $filters['risk']))
            ->when($filters['event'], fn ($query) => $query->where('event_type', $filters['event']))
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('login_identifier', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('device_id', 'like', "%{$search}%")
                        ->orWhere('location_hint', 'like', "%{$search}%");
                });
            })
            ->latest('occurred_at')
            ->paginate($eventPerPage, ['*'], 'events_page')
            ->withQueryString()
            ->through(fn (SecurityEvent $event) => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'risk_level' => $event->risk_level,
                'login_identifier' => $event->login_identifier,
                'email' => $event->email,
                'ip_address' => $event->ip_address,
                'device_id' => $event->device_id,
                'location_hint' => $event->location_hint,
                'route_name' => $event->route_name,
                'occurred_at' => optional($event->occurred_at)->toDateTimeString(),
                'user' => $event->user ? [
                    'id' => $event->user->id,
                    'name' => trim($event->user->first_name.' '.$event->user->last_name),
                    'login_id' => $event->user->login_id,
                    'email' => $event->user->email,
                ] : null,
                'context' => $event->context ?? [],
            ]);

        $blocks = SecurityBlock::query()
            ->with(['user:id,first_name,last_name,login_id,email', 'creator:id,first_name,last_name'])
            ->latest('created_at')
            ->paginate($blockPerPage, ['*'], 'blocks_page')
            ->withQueryString()
            ->through(fn (SecurityBlock $block) => [
                'id' => $block->id,
                'reason' => $block->reason,
                'risk_level' => $block->risk_level,
                'is_active' => $block->is_active,
                'login_identifier' => $block->login_identifier,
                'email' => $block->email,
                'ip_address' => $block->ip_address,
                'device_id' => $block->device_id,
                'location_hint' => $block->location_hint,
                'starts_at' => optional($block->starts_at)->toDateTimeString(),
                'ends_at' => optional($block->ends_at)->toDateTimeString(),
                'lifted_at' => optional($block->lifted_at)->toDateTimeString(),
                'notes' => $block->notes,
                'user' => $block->user ? [
                    'id' => $block->user->id,
                    'name' => trim($block->user->first_name.' '.$block->user->last_name),
                    'login_id' => $block->user->login_id,
                    'email' => $block->user->email,
                ] : null,
                'creator' => $block->creator ? trim($block->creator->first_name.' '.$block->creator->last_name) : null,
            ]);

        return Inertia::render('Settings/SecurityMonitoring', [
            'filters' => $filters,
            'events' => $events,
            'blocks' => $blocks,
            'summary' => [
                'high_risk_events_24h' => SecurityEvent::query()
                    ->whereIn('risk_level', ['warning', 'high', 'critical'])
                    ->where('occurred_at', '>=', now()->subDay())
                    ->count(),
                'active_blocks' => SecurityBlock::query()
                    ->where('is_active', true)
                    ->where(function ($query) {
                        $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
                    })
                    ->count(),
                'failed_logins_24h' => SecurityEvent::query()
                    ->where('event_type', 'login.failed')
                    ->where('occurred_at', '>=', now()->subDay())
                    ->count(),
                'forgot_password_risks_24h' => SecurityEvent::query()
                    ->whereIn('event_type', ['password_reset.risk_detected', 'password_reset.rate_limited'])
                    ->where('occurred_at', '>=', now()->subDay())
                    ->count(),
            ],
        ]);
    }

    public function storeBlock(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => ['nullable', 'string', 'max:191'],
            'ip_address' => ['nullable', 'string', 'max:45'],
            'device_id' => ['nullable', 'string', 'max:191'],
            'location_hint' => ['nullable', 'string', 'max:191'],
            'reason' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'risk_level' => ['required', 'in:warning,high,critical'],
            'duration_minutes' => ['nullable', 'integer', 'min:5', 'max:10080'],
        ]);

        $user = $this->securityMonitoring->resolveUser($validated['subject'] ?? null);
        $subject = trim((string) ($validated['subject'] ?? ''));
        $subjectEmail = filter_var($subject, FILTER_VALIDATE_EMAIL) ? $subject : null;

        if (! $user && empty($validated['subject']) && empty($validated['ip_address']) && empty($validated['device_id']) && empty($validated['location_hint'])) {
            return back()->withErrors([
                'subject' => 'Provide at least one blocking attribute such as a user, IP address, device ID, or location hint.',
            ]);
        }

        SecurityBlock::create([
            'user_id' => $user?->id,
            'created_by' => $request->user()?->id,
            'login_identifier' => $user?->login_id ?? ($subjectEmail ? null : ($subject ?: null)),
            'email' => $user?->email ?? $subjectEmail,
            'ip_address' => $validated['ip_address'] ?: null,
            'device_id' => $validated['device_id'] ?: null,
            'location_hint' => $validated['location_hint'] ?: null,
            'reason' => $validated['reason'],
            'risk_level' => $validated['risk_level'],
            'starts_at' => now(),
            'ends_at' => ! empty($validated['duration_minutes'])
                ? now()->addMinutes((int) $validated['duration_minutes'])
                : null,
            'notes' => $validated['notes'] ?? null,
            'context' => [
                'created_from' => 'admin_console',
            ],
        ]);

        return back()->with('success', 'Security block created successfully.');
    }

    public function liftBlock(SecurityBlock $securityBlock): RedirectResponse
    {
        $securityBlock->update([
            'is_active' => false,
            'lifted_at' => now(),
        ]);

        return back()->with('success', 'Security block lifted.');
    }
}
