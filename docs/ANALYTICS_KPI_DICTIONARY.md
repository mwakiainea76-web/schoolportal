# Analytics KPI Dictionary

## Purpose

This document defines the initial KPI dictionary for analytics implementation. It is the source of truth for business meaning, query rules, exclusions, and ownership.

All analytics code should follow these definitions unless a later approved revision changes them.

## Global Rules

- Soft-deleted transactional rows are excluded unless explicitly stated otherwise.
- Metrics must never rely on lazy-loaded relation accessors.
- Date-based KPIs must state whether they use `created_at`, `issue_date`, `payment_date`, `admission_date`, or another canonical field.
- Financial KPIs must explicitly state whether draft, rejected, reversed, or cancelled records are included.
- Student-facing analytics must only expose the current authenticated student's own data.
- Management analytics should default to aggregate-only output unless drill-down access is explicitly authorized.

## Executive KPIs

### total_students

- Meaning: Count of all non-deleted student records in the system.
- Source tables: `students`
- Formula: `COUNT(*)`
- Time field: none
- Default exclusions: soft-deleted students
- Filters: department, program, program version, gender, county
- Owner: registry
- Security: aggregate only

### active_students

- Meaning: Count of students whose `student_status` is `active`.
- Source tables: `students`
- Formula: `COUNT(*) WHERE student_status = 'active'`
- Time field: none
- Default exclusions: soft-deleted students
- Filters: department, program, program version, module
- Owner: registry
- Security: aggregate only

### new_admissions_this_month

- Meaning: Count of students admitted during the current calendar month.
- Source tables: `students`
- Formula: `COUNT(*) WHERE admission_date BETWEEN start_of_month AND end_of_month`
- Time field: `admission_date`
- Default exclusions: soft-deleted students
- Filters: department, program, program version, county, gender
- Owner: admissions
- Security: aggregate only

### students_registered_in_active_session

- Meaning: Count of students with an academic session enrollment linked to the currently active academic session.
- Source tables: `academic_session_enrollments`, `academic_sessions`, `course_enrollments`, `students`
- Formula: distinct student count for enrollments in active session
- Time field: active session context
- Default exclusions: soft-deleted enrollments, soft-deleted students
- Filters: department, program, program version, year of study, module
- Owner: academic operations
- Security: aggregate only

### total_invoiced

- Meaning: Sum of `amount_due` for included student invoices.
- Source tables: `student_invoices`
- Formula: `SUM(amount_due)`
- Time field: `issue_date`
- Default exclusions: soft-deleted invoices
- Open policy: whether to exclude draft or rejected invoices must be enforced centrally in code
- Filters: academic session, department, program, invoice type, approval status, date range
- Owner: finance
- Security: aggregate plus authorized drill-down

### total_collected

- Meaning: Sum of amounts collected against student invoices in the selected period.
- Source tables: `payments`, `payment_allocations`, `student_invoices`
- Formula: sum of allocated payment amounts within reporting scope
- Time field: `payment_date`
- Default exclusions: soft-deleted payments and allocations
- Open policy: treatment of unapplied credits must be explicit
- Filters: academic session, department, program, payment method, date range
- Owner: finance
- Security: aggregate plus authorized drill-down

### outstanding_balance

- Meaning: Sum of invoice `balance_due` where remaining balance is positive.
- Source tables: `student_invoices`
- Formula: `SUM(balance_due) WHERE balance_due > 0`
- Time field: real-time balance
- Default exclusions: soft-deleted invoices
- Open policy: reversed and rejected invoice handling must be explicit
- Filters: academic session, department, program, invoice type
- Owner: finance
- Security: aggregate plus authorized drill-down

### overdue_balance

- Meaning: Sum of positive invoice balances where due date is before today.
- Source tables: `student_invoices`
- Formula: `SUM(balance_due) WHERE balance_due > 0 AND due_date < today`
- Time field: `due_date`
- Default exclusions: soft-deleted invoices
- Open policy: whether draft invoices can become overdue must be defined centrally
- Filters: academic session, department, program, aging bucket
- Owner: finance
- Security: aggregate plus authorized drill-down

### session_registration_rate

- Meaning: Ratio of eligible active students who are registered in the active academic session.
- Source tables: `students`, `course_enrollments`, `academic_session_enrollments`, `academic_sessions`
- Formula: `registered_students / eligible_students`
- Time field: active session context
- Default exclusions: soft-deleted students, inactive or dropped students unless policy changes
- Open policy: treatment of suspended students must be explicit
- Filters: department, program, program version, year of study, module
- Owner: academic operations
- Security: aggregate plus authorized drill-down

### hostel_occupancy_rate

- Meaning: Percentage of hostel beds currently allocated.
- Source tables: `hostel_allocations`, `hostel_beds`, `hostel_rooms`, `hostels`
- Formula: `occupied_beds / total_beds`
- Time field: current allocation state
- Default exclusions: soft-deleted allocations, beds, rooms, hostels
- Open policy: whether suspended students count as occupied must be explicit
- Filters: hostel, room, gender
- Owner: hostel administration
- Security: aggregate only by default

## Finance KPIs

### invoice_count_by_status

- Meaning: Count of invoices grouped by workflow status.
- Source tables: `student_invoices`
- Formula: grouped count by `status`
- Time field: `issue_date` or real-time view, depending on report
- Default exclusions: soft-deleted invoices
- Filters: academic session, department, program, invoice type, date range
- Owner: finance
- Security: aggregate plus authorized drill-down

### collection_rate

- Meaning: Percentage of invoiced amount that has been collected within scope.
- Source tables: `student_invoices`, `payment_allocations`, `payments`
- Formula: `total_collected / total_invoiced`
- Time field: mixed, must be defined consistently by report
- Default exclusions: soft-deleted invoices, soft-deleted allocations, soft-deleted payments
- Open policy: denominator must use same inclusion rules as `total_invoiced`
- Filters: academic session, department, program, date range
- Owner: finance
- Security: aggregate only

### credit_balance_students

- Meaning: Count of students whose net account position is in credit.
- Source tables: `student_invoices`, `payments`, `payment_allocations`
- Formula: count of students where credits exceed charges in scope
- Time field: real-time balance
- Default exclusions: soft-deleted rows
- Filters: academic session, department, program
- Owner: finance
- Security: authorized drill-down only

## Academic KPIs

### students_not_registered_for_active_session

- Meaning: Count of eligible students missing an enrollment in the active academic session.
- Source tables: `students`, `course_enrollments`, `academic_sessions`, `academic_session_enrollments`
- Formula: eligible active students minus registered active-session students
- Time field: active session context
- Default exclusions: soft-deleted rows
- Open policy: treatment of suspended students must be explicit
- Filters: department, program, program version, module, year of study
- Owner: academic operations
- Security: aggregate plus authorized drill-down

### timetable_completion_rate

- Meaning: Share of expected unit delivery that has timetable coverage.
- Source tables: `course_version_units`, `academic_timetables`
- Formula: timetabled mapped units divided by expected mapped units for active scope
- Time field: session or timetable period
- Default exclusions: soft-deleted rows
- Open policy: exact expected-unit denominator per module must be agreed
- Filters: department, program, program version, module, lecturer, room
- Owner: academic operations
- Security: aggregate plus authorized drill-down

### room_utilization_rate

- Meaning: Ratio of scheduled room usage time to available room capacity time.
- Source tables: `academic_timetables`, `lecture_rooms`
- Formula: scheduled slot duration divided by capacity duration in scope
- Time field: timetable date range
- Default exclusions: soft-deleted rows
- Open policy: standard room availability hours must be defined
- Filters: room, department, day, date range
- Owner: academic operations
- Security: aggregate only

## Data Quality KPIs

### students_missing_program_enrollment

- Meaning: Count of students without a linked program enrollment.
- Source tables: `students`, `course_enrollments`
- Formula: students with no related program enrollment
- Time field: real-time state
- Default exclusions: soft-deleted rows
- Filters: admission period, county, gender
- Owner: registry
- Security: authorized drill-down only

### invoices_missing_enrollment

- Meaning: Count of invoices not linked to an academic session enrollment.
- Source tables: `student_invoices`, `academic_session_enrollments`
- Formula: invoices where `enrollment_id` is null or orphaned
- Time field: `issue_date` or real-time state
- Default exclusions: soft-deleted invoices
- Filters: academic session, invoice type, date range
- Owner: finance
- Security: authorized drill-down only

### duplicate_contact_risk

- Meaning: Count of users or students sharing email or phone values that should be unique operationally.
- Source tables: `users`, `students`
- Formula: grouped duplicate counts across configured keys
- Time field: real-time state
- Default exclusions: soft-deleted users and students
- Filters: department, role, student/staff type
- Owner: registry and IT
- Security: authorized drill-down only

## Decisions To Lock Before Wider Rollout

- whether draft invoices count in `total_invoiced`
- whether rejected invoices count in `total_invoiced`
- whether reversed invoices remain in historical financial trend denominators
- whether suspended students are part of `session_registration_rate`
- whether suspended students count toward `hostel_occupancy_rate`
- whether `total_collected` is based on payments recorded or allocations applied
