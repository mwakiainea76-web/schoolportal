<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use App\Services\AuditLogQueryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditLogController extends Controller
{
    public function index(Request $request, AuditLogQueryService $queryService)
    {
        $this->authorizeAuditAccess($request);

        $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
        $logs = $queryService->query($this->filters($request))->paginate($perPage)->withQueryString();

        return AuditLogResource::collection($logs);
    }

    public function show(Request $request, AuditLog $auditLog): AuditLogResource
    {
        $this->authorizeAuditAccess($request);
        $auditLog->load('user:id,email,login_id');

        return new AuditLogResource($auditLog);
    }

    public function student(Request $request, int $id, AuditLogQueryService $queryService)
    {
        $this->authorizeAuditAccess($request);

        $logs = $queryService->query($this->filters($request) + [
            'entity_type' => 'student',
            'entity_id' => $id,
        ])->paginate(25)->withQueryString();

        return AuditLogResource::collection($logs);
    }

    public function staff(Request $request, int $id, AuditLogQueryService $queryService)
    {
        $this->authorizeAuditAccess($request);

        $logs = $queryService->query($this->filters($request) + [
            'entity_type' => 'staff',
            'entity_id' => $id,
        ])->paginate(25)->withQueryString();

        return AuditLogResource::collection($logs);
    }

    public function export(Request $request, AuditLogQueryService $queryService): StreamedResponse
    {
        $this->authorizeAuditAccess($request);

        $fileName = 'audit-logs-'.now()->format('Ymd_His').'.csv';
        $rows = $queryService->query($this->filters($request))->limit(5000)->get();

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date', 'User', 'Module', 'Action', 'Entity Type', 'Entity ID', 'Entity Label', 'High Risk', 'IP Address', 'Request ID']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    optional($row->created_at)->toDateTimeString(),
                    $row->user?->full_name ?: $row->user?->email,
                    $row->module,
                    $row->action,
                    $row->entity_type,
                    $row->entity_id,
                    $row->entity_label,
                    data_get($row->metadata, 'high_risk', false) ? 'Yes' : 'No',
                    $row->ip_address,
                    $row->request_id,
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
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

    protected function authorizeAuditAccess(Request $request): void
    {
        abort_unless($request->user()?->hasAnyRole(config('audit.authorization_roles', ['admin'])), 403, 'User does not have the right roles.');
    }
}
