# Architecture And Operations

## 1. Application Architecture

The application uses server-side routing with client-side rendering through Inertia.

Request flow:

1. Browser hits Laravel route
2. Controller validates and gathers data
3. Service layer applies business rules
4. Controller returns Inertia payload
5. React page renders the module UI

This keeps routing, authorization, and business workflows centralized in Laravel while still giving a modern SPA user experience.

---

## 2. Key Domain Models

Important model groups include:

- `User`
- `Student`
- `Staff`
- `Department`
- `Course`
- `Curriculum`
- `CurriculumMapping`
- `Unit`
- `AcademicYear`
- `AcademicSession`
- `AcademicSessionEnrollment`
- `StudentInvoice`
- `Payment`
- `FeeAdjustment`
- `LedgerTransaction`
- `Hostel`, `HostelRoom`, `HostelBed`, `HostelAllocation`
- `AuditLog`

Profile design:

- a `User` is the authenticatable identity
- profile data lives in either `Student` or `Staff`
- profile-driven attributes like full name come from those linked records

---

## 3. Middleware Stack

Important middleware responsibilities:

- `auth` and `verified`
- `role:*` authorization by module
- `non_student` separation for staff/admin workflows
- `EnsureActiveUser`
  locks inactive accounts out even if a session already exists
- `EnforceSecurityBlock`
  blocks flagged devices/accounts
- `RecordRequestPerformance`
  records slow and error request metrics
- `HandleInertiaRequests`
  shares auth/profile/role data globally to React

---

## 4. Services Layer

The service layer is where business rules live.

### Academic services

- `AcademicYearService`
- `AcademicSessionService`
- `UnitService`
- `CourseService`
- `CurriculumService`
- `CurriculumMappingService`

### Student and staff lifecycle services

- `AdmissionNumberService`
- `StudentEnrollmentStatusService`
- `StaffStatusService`
- `StudentAcademicContextService`

### Finance services

- `BillingService`
- `BillingStatementService`
- `FeeManagement/FeePlanService`
- `FeeManagement/FeeComponentService`
- `FeeManagement/FeeAssignmentService`

### Security and governance

- `SecurityMonitoringService`
- `AuditService`
- `AuditLogQueryService`
- `RBACService`

### Reporting and analytics

- analytics services under `App\Services\Analytics`
- `ReportingService`

This separation makes controllers thinner and supports safer testing.

---

## 5. Finance Architecture

The finance module is built around these concepts:

- fee plan
- fee plan item
- fee assignment
- invoice
- payment
- adjustment
- ledger transaction

Flow summary:

1. Fee plans define reusable pricing structures
2. Fee assignments bind those plans to academic contexts
3. Student academic enrollment activates billing context
4. `BillingService` creates invoices
5. payments and adjustments recalculate balance
6. ledger entries preserve the financial trail

Important implementation note:

The billing service centralizes validations and recalculation logic, which reduces duplicate finance code across controllers.

---

## 6. Timetable Architecture

Timetable generation is built around:

- department
- academic session
- curriculum unit(s)
- trainer
- lecture room
- day and time slot

Special behavior:

- HOD workflows are department-scoped
- admin can operate across departments
- merge logic supports shared teaching slots when room, trainer, and time fully match
- selected course mapping drives available units

The core orchestration lives in `AcademicTimetableController`.

---

## 7. Analytics Architecture

Reporting is implemented as dedicated analytics services rather than raw controller queries.

Benefits:

- reusable summary logic
- cleaner report controllers
- easier snapshotting
- better future background processing options

Snapshot support:

- `AnalyticsSnapshotService`
- `AnalyticsSnapshotReadService`
- background job:
  - `RefreshAnalyticsSnapshotsJob`
- artisan commands exist for refresh/backfill flows

---

## 8. Logging, Monitoring, and Audit

There are three distinct observability layers in this project:

### Application/performance logs

- powered by Laravel logging
- surfaced in the log viewer
- performance events come from request performance tracking

### Security events

- focused on auth risk, blocks, device/IP activity, and suspicious behavior
- managed through `SecurityMonitoringService`

### Audit logs

- focused on business actions and governance
- immutable, filterable, and exportable
- uses queue-backed writes through `AuditService`

This separation is good because operational logs, security monitoring, and business audit trails serve different purposes.

---

## 9. Queue Usage

Current queued workflows include:

- `WriteAuditLogJob`
- `RefreshAnalyticsSnapshotsJob`

Why this matters:

- audit writes should not block user actions
- analytics refresh work can run asynchronously

The queue configuration is already database-friendly through Laravel queue config.

---

## 10. Export Strategy

The project supports document/data export through:

- generic resource export endpoint
- specialized marks/marksheet exports
- PDF service classes with a shared base exporter

This keeps export formatting logic out of controllers.

---

## 11. Testing Strategy

Feature tests cover critical areas such as:

- authentication and access control
- dashboard role routing
- student and staff onboarding
- finance manual operations
- timetable conflict and merge logic
- status management
- log viewer
- exports
- audit logging

Representative files:

- `QaModule1AuthTest.php`
- `QaModule34StaffStudentTest.php`
- `QaModule6TimetableTest.php`
- `QaModule7FinanceTest.php`
- `QaModule8LogsTest.php`
- `ManualAcademicSessionEnrollmentTest.php`
- `StaffStatusManagementTest.php`
- `AuditLoggingTest.php`

---

## 12. Operational Notes

### Status sync and login control

- student/staff status changes affect linked `users.is_active`
- inactive accounts are blocked at login and during existing sessions

### Audit immutability

- audit rows are protected in Laravel
- PostgreSQL triggers also reject update/delete after migration

### Security blocks

- login/password-reset abuse can trigger risk events and automatic blocks

### Role cache

- role/permission changes clear RBAC caches to keep access consistent

---

## 13. Recommended Maintenance Habits

- keep migrations coherent and fold simple column tweaks into parent migrations while still in development
- keep business rules in services, not duplicated in controllers
- keep role-specific dashboards independent
- use dedicated status pages for lifecycle transitions
- continue routing finance mutations through `BillingService`
- keep audit logging focused on meaningful business actions to avoid noise

---

## 14. Documentation Maintenance

When new features are added, update documentation in this order:

1. `PROJECT_GUIDE.md` if a new top-level module or role behavior is introduced
2. `FEATURE_REFERENCE.md` with what the feature does and which files implement it
3. `ARCHITECTURE_AND_OPERATIONS.md` if the feature changes services, jobs, exports, security, or background processing
4. dedicated focused docs, like `audit-logging.md`, when the feature is large enough to deserve its own operational reference
