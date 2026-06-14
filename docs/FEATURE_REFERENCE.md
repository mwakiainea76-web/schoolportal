# Feature Reference

## 1. Authentication

### What it does

- login
- logout
- forgot password
- password reset
- email verification support
- password update for the authenticated user

### How it works

- users authenticate with `login_id` or `email`
- account activity is throttled and monitored
- inactive users are denied access
- successful and failed auth events are logged

### Main implementation

- controllers:
  - `Auth/AuthenticatedSessionController.php`
  - `Auth/PasswordResetLinkController.php`
  - `Auth/NewPasswordController.php`
  - `Auth/PasswordController.php`
- request:
  - `Http/Requests/Auth/LoginRequest.php`
- security:
  - `Services/SecurityMonitoringService.php`
  - `Http/Middleware/EnsureActiveUser.php`
  - `Http/Middleware/EnforceSecurityBlock.php`
- audit:
  - `Services/AuditService.php`

---

## 2. Profile Management

### What it does

- users can view their profile
- most fields are read-only
- users can only change their own password

### How it works

- profile data is pulled from either `student` or `staff`
- profile UI is unified under one page
- actual personal record updates are expected to be admin-managed

### Main implementation

- controller:
  - `ProfileController.php`
- page:
  - `resources/js/Pages/Profile/Edit.jsx`
- partials:
  - `Profile/Partials/UpdatePasswordForm.jsx`
  - `Profile/Partials/UpdateProfileInformationForm.jsx`

---

## 3. Role-Based Dashboards

### What it does

- renders a different dashboard per role
- surfaces role-specific analytics and quick actions

### How it works

- backend builds a `dashboard` payload
- frontend selects the right dashboard component by role
- student dashboard is fully independent, and the same pattern is used for staff roles

### Main implementation

- controller:
  - `DashboardController.php`
- page selector:
  - `resources/js/Pages/Dashboard.jsx`
- individual dashboards:
  - `resources/js/Pages/Dashboards/*`

---

## 4. Student Management

### What it does

- student admission/onboarding
- student listing, editing, and deletion
- curriculum/course selection during onboarding
- admission-letter generation
- next-of-kin capture
- student password reset by admin

### How it works

- creating a student creates:
  - a `User`
  - a `Student`
  - related next-of-kin data
  - enrollment context as needed
- onboarding defaults student status to active
- normal create/edit forms do not manage student lifecycle status directly

### Main implementation

- controller:
  - `StudentController.php`
- services:
  - `AdmissionNumberService.php`
  - `StudentEnrollmentStatusService.php`
- pages:
  - `resources/js/Pages/students/Index.jsx`
  - `Create.jsx`
  - `Edit.jsx`
  - `ResetPassword.jsx`

### Related tests

- `QaModule34StaffStudentTest.php`
- `ManualAcademicSessionEnrollmentTest.php`

---

## 5. Student Enrollment Status Management

### What it does

- change student lifecycle state
- keep audit/history of status transitions
- lock or unlock login access automatically

### Supported statuses

- `active`
- `deferred`
- `expelled`
- `graduated`

### How it works

- admin uses a dedicated page, not the student create/edit form
- service updates:
  - `students.enrollment_status`
  - linked `users.is_active`
  - `student_status_logs`

### Main implementation

- controller:
  - `AcademicSessionEnrollmentController.php`
- service:
  - `StudentEnrollmentStatusService.php`
- model:
  - `StudentStatusLog`
- page:
  - `AcademicSessionEnrollments/ChangeStatus.jsx`

---

## 6. Manual Student Session Enrollment

### What it does

- admin can enroll students into the active academic session by admission number
- module number drives derived academic placement

### How it works

- admin enters:
  - admission number
  - module number
- the system derives:
  - year of study
  - session number
- it validates against the active academic year/session context
- it can trigger automatic finance invoicing

### Main implementation

- controller:
  - `AcademicSessionEnrollmentController.php`
- page:
  - `AcademicSessionEnrollments/Create.jsx`

### Important rule

Module numbering is the source of truth for deriving year/session progression.

---

## 7. Student Self Registration

### What it does

- students can register their own current session
- students can register their units

### How it works

- available from student dashboard routes
- registration uses the current module progression and active academic session

### Main implementation

- routes under `student.dashboard.*`
- controller:
  - `AcademicSessionEnrollmentController.php`
- student dashboard:
  - `Dashboards/StudentDashboard.jsx`

---

## 8. Student Course Change

### What it does

- allows admin-managed course/curriculum changes
- preserves historical traceability

### How it works

- user selects student and target academic mapping
- workflow updates the academic context while keeping a history trail

### Main implementation

- controller:
  - `StudentCourseChangeController.php`
- page:
  - `resources/js/Pages/students/CourseChange.jsx`

---

## 9. Staff Management

### What it does

- single-page staff onboarding
- staff listing, editing, deletion
- role assignment
- next-of-kin capture
- password reset by admin

### How it works

- staff create/edit is now direct and not multi-step
- onboarding creates:
  - `User`
  - `Staff`
  - role assignment
  - next-of-kin data
- status is separated from the normal create/edit flow

### Main implementation

- controller:
  - `StaffController.php`
- pages:
  - `Staffs/Index.jsx`
  - `Create.jsx`
  - `Edit.jsx`
  - `ResetPassword.jsx`

---

## 10. Staff Status Management

### What it does

- dedicated page to change staff status
- logs transitions in history
- keeps linked user account active/inactive in sync

### Supported statuses

- `active`
- `suspended`
- `onleave`
- `exited`

### How it works

- admin changes staff status by staff number
- service updates:
  - `staffs.staff_status`
  - linked `users.is_active`
  - `staff_status_logs`

### Main implementation

- controller:
  - `StaffController.php`
- service:
  - `StaffStatusService.php`
- page:
  - `Staffs/ChangeStatus.jsx`

---

## 11. Academic Years and Sessions

### What it does

- manage academic years
- manage academic sessions/modules
- activate/deactivate academic periods

### How it works

- only one active context is expected for core operational workflows
- other modules such as enrollment and finance depend on the active academic period

### Main implementation

- controllers:
  - `AcademicYearController.php`
  - `AcademicSessionController.php`
- services:
  - `AcademicYearService.php`
  - `AcademicSessionService.php`
- pages:
  - `AcademicYears/*`
  - `AcademicSessions/*`

---

## 12. Departments

### What it does

- create departments
- assign HOD
- edit/delete/search departments

### How it works

- department records can be scoped in HOD workflows
- deletion is guarded by dependency checks

### Main implementation

- controller:
  - `DepartmentController.php`
- service:
  - `DepartmentService.php`
- pages:
  - `Departments/*`

---

## 13. Exam Bodies and Certification Levels

### What it does

- manage external/awarding bodies
- manage certification levels

### How it works

- the workspace pattern allows related academic setup in one area
- certification level dependencies affect course creation and deletion rules

### Main implementation

- controllers:
  - `ExamBodyController.php`
  - `CertificationLevelController.php`
- services:
  - `ExamBodyService.php`
  - `CertificationLevelService.php`
- pages:
  - `ExamBodies/*`
  - `CertificationLevels/*`

---

## 14. Courses, Curriculums, and Course Version Mappings

### What it does

- manage courses
- manage curricula
- manage course version/curriculum mappings

### How it works

- mappings are treated as the active versioned academic identity
- downstream modules like units, enrollment, timetable, and fees rely on the mapping rather than only the raw course

### Main implementation

- controllers:
  - `CourseController.php`
  - `CurriculumController.php`
  - `CurriculumMappingController.php`
- services:
  - `CourseService.php`
  - `CurriculumService.php`
  - `CurriculumMappingService.php`
- pages:
  - `Courses/*`
  - `Curriculums/*`
  - `CurriculumMappings/*`

---

## 15. Units / Curriculum Units

### What it does

- create units under a course version mapping
- manage unit code, name, credit factor, module taught, and scope
- filter units by mapping, module, and scope

### Important current design

- removed fields such as semester, module slot, and sort order
- `scope` is used instead of the old compulsory-style approach
- units are tied to versioned course mappings

### Main implementation

- controller:
  - `UnitController.php`
- service:
  - `UnitService.php`
- pages:
  - `CurriculumUnits/*`

---

## 16. Course Enrollments

### What it does

- manage which academic context a student belongs to
- support filters and scoped listing

### How it works

- works together with student records, curriculum mappings, and academic session enrollment

### Main implementation

- controller:
  - `CourseEnrollmentController.php`
- page:
  - `CourseEnrollments/Index.jsx`

---

## 17. Timetable Management

### What it does

- create timetable entries
- support admin and HOD variants
- prevent invalid overlaps
- support merge behavior when identical room/trainer/time conditions apply

### How it works

- admin can choose department, then valid course mappings
- HOD is scoped to their own department
- units are loaded from course version mappings
- trainer search is intentionally flexible beyond a single department
- merge only happens when the same:
  - room
  - trainer
  - time slot
  are used

### Main implementation

- controller:
  - `AcademicTimetableController.php`
- pages:
  - `Academic/Timetables/Index.jsx`
  - `Create.jsx`
  - `CreateHod.jsx`
  - `Edit.jsx`

### Related tests

- `QaModule6TimetableTest.php`
- `QaSpecialAttentionTest.php`

---

## 18. Marks and Results

### What it does

- add marks
- view marks
- publish/unpublish results
- generate marksheet exports
- expose student results

### How it works

- trainers, HODs, and admins have different access levels
- publish actions are more restricted
- exports can stream PDF/CSV style output depending on flow

### Main implementation

- controller:
  - `StudentMarkController.php`
- pages:
  - `Grades/Add.jsx`
  - `Grades/View.jsx`
  - `Grades/Publish.jsx`
  - `Grades/Marksheet.jsx`
  - `Grades/StudentResults.jsx`

---

## 19. Fee Plans

### What it does

- define reusable fee plans
- manage fee plan items
- approve and activate fee plan usage

### How it works

- fee plans represent the reusable pricing template
- fee plan items are the component rows
- constraints prevent invalid duplicate structures

### Main implementation

- controllers:
  - `FeePlanController.php`
  - `FeePlanItemController.php`
- services:
  - `FeeManagement/FeePlanService.php`
  - `FeeManagement/FeeComponentService.php`
- pages:
  - `Fees/FeePlans/*`
  - `Fees/FeePlanItems/*`

---

## 20. Fee Assignments

### What it does

- assign fee plans to academic contexts
- bulk assign or replace assignments
- preview assignment impacts

### How it works

- fee assignments bind academic year + course version mapping + year/session study context to a finance plan
- active assignments drive automatic student invoicing

### Main implementation

- controller:
  - `FeeAssignmentController.php`
- services:
  - `FeeManagement/FeeAssignmentService.php`
  - legacy `FeeAssignmentService.php` helpers where applicable
- pages:
  - `Fees/FeeAssignments/*`

---

## 21. Billing and Invoices

### What it does

- generate invoices
- show invoice details
- manage approvals
- show student fee statements
- show ledger

### How it works

- invoices can be system-generated or manually created
- approval status controls whether financial activity is allowed
- billing flows recalculate balances using invoice items, adjustments, and payment allocations

### Main implementation

- controllers:
  - `InvoiceController.php`
  - `LedgerTransactionController.php`
- services:
  - `BillingService.php`
  - `BillingStatementService.php`

---

## 22. Manual Finance Operations

### What it does

- post student charges
- record payments
- post penalties
- apply adjustments

### How it works

- manual operations are surfaced in modal-based UI from one billing workspace
- forms are full standalone React components
- actions ultimately pass through `BillingService`

### Main implementation

- pages:
  - `Billing/ManualOperations/Index.jsx`
  - `AdditionalInvoice.jsx`
  - `RecordPayment.jsx`
  - `PostPenalty.jsx`
  - `ApplyAdjustment.jsx`
- controller:
  - `InvoiceController.php`
- service:
  - `BillingService.php`

### Related tests

- `QaModule7FinanceTest.php`
- `QaSpecialAttentionTest.php`

---

## 23. Hostel Management

### What it does

- manage hostels, rooms, and beds
- allocate hostel capacity to students
- tie hostel billing into finance

### How it works

- hostel allocations are admin-managed
- hostel billing can produce finance records using hostel-specific invoice logic

### Main implementation

- controllers:
  - `HostelController.php`
  - `HostelAllocationController.php`
- pages:
  - `Hostels/*`
  - `HostelAllocations/*`

---

## 24. Lecture Rooms

### What it does

- manage lecture room records used by timetable workflows

### How it works

- rooms can be department-associated
- deletion is blocked when the room is already used in timetable records

### Main implementation

- controller:
  - `LectureRoomController.php`
- pages:
  - `LectureRooms/*`

---

## 25. Roles and Permissions

### What it does

- create roles
- create permissions
- assign/sync permissions to roles

### How it works

- built on Spatie Permission
- RBAC cache invalidation happens after changes
- role/permission changes are now audit logged as high-risk actions

### Main implementation

- controllers:
  - `RoleController.php`
  - `PermissionController.php`
- support:
  - `Support/RbacCache.php`
  - `Services/RBACService.php`
- pages:
  - `Roles/*`
  - `Permissions/*`

---

## 26. Reports and Analytics

### What it does

- executive analytics
- finance analytics
- academic analytics
- admissions analytics
- hostel analytics
- data-quality analytics
- snapshot trend reporting

### How it works

- report pages are rendered through one reporting workspace
- detailed metrics are pulled from analytics services
- snapshot support exists for trend/history use cases

### Main implementation

- controller:
  - `ReportingController.php`
- services:
  - `Analytics/ExecutiveAnalyticsService.php`
  - `Analytics/FinanceAnalyticsService.php`
  - `Analytics/AcademicAnalyticsService.php`
  - `Analytics/AdmissionsAnalyticsService.php`
  - `Analytics/HostelAnalyticsService.php`
  - `Analytics/DataQualityAnalyticsService.php`
  - `Analytics/AnalyticsSnapshotService.php`
  - `Analytics/AnalyticsSnapshotReadService.php`
- page:
  - `Reports/Index.jsx`

---

## 27. Export System

### What it does

- export selected modules as PDF/CSV/Excel-style downloads depending on feature

### How it works

- shared export route delegates to export service classes
- marks and marksheet exports have their own specialized flows

### Main implementation

- API controller:
  - `Api/ExportController.php`
- base service:
  - `Services/Export/BasePdfExport.php`
- PDF exporters under:
  - `Services/Export/Pdf/*`

---

## 28. Security Monitoring

### What it does

- monitor risky auth behavior
- record security events
- create/lift security blocks
- investigate suspicious access patterns

### How it works

- login and password reset requests feed the monitoring service
- repeated failures can create automatic blocks
- admins can review and manage those blocks

### Main implementation

- controller:
  - `SecurityMonitoringController.php`
- service:
  - `SecurityMonitoringService.php`
- page:
  - `Settings/SecurityMonitoring.jsx`

---

## 29. Log Viewer and Performance Monitoring

### What it does

- read log files from the app
- filter log entries
- clear logs
- monitor slow endpoints and error metrics
- inspect active/online users

### How it works

- application logs and performance logs are parsed by server-side services
- performance middleware measures requests and records slow/error events

### Main implementation

- controllers:
  - `LogViewerController.php`
  - `PerformanceDashboardController.php`
  - `UserMonitorController.php`
  - `OnlineUsersController.php`
- services:
  - `LogReaderService.php`
- middleware:
  - `RecordRequestPerformance.php`

---

## 30. Audit Logging

### What it does

- records critical business actions
- stores who acted, what changed, when, and on which record
- supports filterable admin review and CSV export

### How it works

- `AuditService` normalizes payloads
- sensitive fields are redacted
- logs are written asynchronously through a queue job
- selected model CRUD actions can be auto-audited with `Auditable`
- high-risk actions such as role changes, password resets, timetable changes, and finance changes are explicitly logged

### Main implementation

- `AuditLog` model
- `AuditService`
- `WriteAuditLogJob`
- `Auditable` trait
- `AuditLogController`
- `Api/AuditLogController`
- `Admin/AuditLogs/*`

See also:

- [audit-logging.md](/c:/xampp/htdocs/New%20folder/laravel/docs/audit-logging.md)

