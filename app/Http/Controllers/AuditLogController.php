<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Services\AuditLogQueryService;
use App\Support\AuditLogDisplay;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request, AuditLogQueryService $queryService): Response
    {
        $this->authorizeAuditAccess($request);

        $filters = $queryService->filtersFromRequest($request, true);
        $perPage = min(max((int) ($filters['per_page'] ?: 10), 1), 100);
        $logs = $queryService->query($filters)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (AuditLog $log) => AuditLogDisplay::toArray($log));

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $filters,
        ]);
    }

    public function show(Request $request, AuditLog $auditLog): Response
    {
        $this->authorizeAuditAccess($request);
        $auditLog->load(AuditLogQueryService::USER_RELATIONS);

        return Inertia::render('Admin/AuditLogs/Show', [
            'auditLog' => AuditLogDisplay::toArray($auditLog, true),
        ]);
    }

    protected function authorizeAuditAccess(Request $request): void
    {
        $allowedRoles = config('audit.authorization_roles', ['admin']);
        abort_unless($request->user()?->hasAnyRole($allowedRoles), 403, 'User does not have the right roles.');
    }
}
