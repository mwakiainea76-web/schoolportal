<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditLogQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request, AuditLogQueryService $queryService): Response
    {
        $this->authorizeAuditAccess($request);

        $filters = $this->filters($request);
        $logs = $queryService->query($filters)
            ->paginate(25)
            ->withQueryString()
            ->through(fn (AuditLog $log) => $this->transformLog($log));

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $filters,
            'users' => User::query()
                ->with([
                    'roles:id,name',
                    'staff:id,user_id,first_name,last_name,other_name',
                    'student:id,user_id,first_name,last_name,other_name',
                ])
                ->orderBy('email')
                ->get(['id', 'email', 'login_id'])
                ->map(fn (User $user) => [
                    'id' => (string) $user->id,
                    'name' => $this->userDisplayLabel($user),
                ])
                ->values()
                ->all(),
        ]);
    }

    public function show(Request $request, AuditLog $auditLog): Response
    {
        $this->authorizeAuditAccess($request);
        $auditLog->load([
            'user:id,email,login_id',
            'user.roles:id,name',
            'user.staff:id,user_id,first_name,last_name,other_name',
            'user.student:id,user_id,first_name,last_name,other_name',
        ]);

        return Inertia::render('Admin/AuditLogs/Show', [
            'auditLog' => $this->transformLog($auditLog, true),
        ]);
    }

    protected function filters(Request $request): array
    {
        return [
            'date_from' => trim((string) $request->query('date_from', '')),
            'date_to' => trim((string) $request->query('date_to', '')),
            'user_id' => trim((string) $request->query('user_id', '')),
            'module' => trim((string) $request->query('module', '')),
            'action' => trim((string) $request->query('action', '')),
            'entity_type' => trim((string) $request->query('entity_type', '')),
            'high_risk' => trim((string) $request->query('high_risk', '')),
            'search' => trim((string) $request->query('search', '')),
        ];
    }

    protected function transformLog(AuditLog $log, bool $detailed = false): array
    {
        $payload = [
            'id' => $log->id,
            'created_at' => optional($log->created_at)->toDateTimeString(),
            'module' => $log->module,
            'action' => $log->action,
            'entity_type' => $log->entity_type,
            'entity_id' => $log->entity_id,
            'entity_label' => $log->entity_label,
            'ip_address' => $log->ip_address,
            'request_id' => $log->request_id,
            'user' => $log->user ? [
                'id' => (string) $log->user->id,
                'name' => $this->userDisplayLabel($log->user),
                'email' => $log->user->email,
                'login_id' => $log->user->login_id,
            ] : null,
            'is_high_risk' => (bool) data_get($log->metadata, 'high_risk', false),
        ];

        if ($detailed) {
            $payload['old_values'] = $log->old_values;
            $payload['new_values'] = $log->new_values;
            $payload['metadata'] = $log->metadata;
            $payload['user_agent_hash'] = $log->user_agent_hash;
        }

        return $payload;
    }

    protected function authorizeAuditAccess(Request $request): void
    {
        $allowedRoles = config('audit.authorization_roles', ['admin']);
        abort_unless($request->user()?->hasAnyRole($allowedRoles), 403, 'User does not have the right roles.');
    }

    protected function userDisplayLabel(User $user): string
    {
        $roleLabel = $user->roles
            ->pluck('name')
            ->filter()
            ->map(fn ($role) => ucfirst((string) $role))
            ->join(' / ');

        $profile = $user->student ?: $user->staff;
        $name = $profile?->full_name
            ?: $user->login_id
            ?: $user->email;

        return trim(($roleLabel !== '' ? $roleLabel.' - ' : '').$name);
    }
}
