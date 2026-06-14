# Audit Logging

## Overview

The audit subsystem records business-critical actions without blocking the user request.

Core pieces:

- `audit_logs` stores immutable audit rows.
- `App\Services\AuditService` normalizes payloads, redacts sensitive values, trims unchanged fields, and dispatches queue work.
- `App\Jobs\WriteAuditLogJob` persists audit rows asynchronously.
- `App\Traits\Auditable` can be added to models that need low-noise CRUD auditing.

## Queue Behavior

- Production uses the queue connection configured in `config/queue.php`.
- Audit jobs are pushed to the queue name from `config/audit.php`.
- In tests, audit writes run synchronously by default so assertions can inspect `audit_logs` directly.

## Access

Audit pages and API endpoints are restricted to the roles listed in `config/audit.php`.

## API Endpoints

- `GET /api/audit-logs`
- `GET /api/audit-logs/{id}`
- `GET /api/audit-logs/student/{id}`
- `GET /api/audit-logs/staff/{id}`
- `GET /api/audit-logs/export`

## Notes

- Sensitive fields like passwords, tokens, OTPs, and secrets are always redacted.
- High-risk actions should pass `high_risk => true` to `AuditService::log(...)`.
- For model-level auditing, use `protected $auditOnly = []` or `protected $auditExclude = []` on the model when needed.
- Laravel blocks `update` and `delete` on `AuditLog`, and PostgreSQL also rejects direct `UPDATE` and `DELETE` statements through DB triggers after migrations run.
