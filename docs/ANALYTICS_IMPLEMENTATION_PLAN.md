# Analytics Implementation Plan

## Purpose

This document defines the analytics and reporting direction for the school management application. It is intended to guide implementation one slice at a time, while keeping definitions, edge cases, and ownership consistent across the whole product.

The goal is to treat analytics as a product capability, not as isolated charts or ad hoc SQL queries.

## Objectives

- Provide operational analytics for day-to-day staff work.
- Provide management analytics for strategic decisions.
- Provide student-facing personal analytics and status visibility.
- Create trusted KPI definitions so different screens do not show conflicting numbers.
- Build for enterprise-grade scale, auditability, and performance.

## Guiding Principles

- Every metric must have a clear source of truth.
- Every dashboard must answer a real user decision or action.
- Real-time reporting should be used only where necessary.
- Expensive reporting should move to pre-aggregated tables or scheduled snapshots.
- Sensitive data must be role-restricted and aggregated where possible.
- Every report must define how soft-deleted records, reversals, rejected approvals, and inactive entities are handled.

## User Groups

### Students

Students need analytics that help them understand their academic and financial standing.

Core needs:
- active academic session
- session registration status
- program and module progress
- outstanding fees
- recent payments
- hostel allocation status
- timetable coverage

### Admissions and Registry Staff

Admissions and registry teams need onboarding and lifecycle visibility.

Core needs:
- new admissions by intake
- admitted students by program, department, county, gender, disability status
- students missing required records
- students admitted but not session-registered
- program demand trends

### Academic Operations

Academic operations teams need registration, unit delivery, timetable, and progression visibility.

Core needs:
- active session registration completion
- students by program, year of study, module, and status
- unit mapping completeness
- timetable completeness
- lecturer load
- lecture room utilization
- clash detection

### Finance and Billing Staff

Finance teams need invoicing, collections, debt, and adjustment insight.

Core needs:
- invoices raised
- payments received
- outstanding balances
- overdue balances
- aging analysis
- discounts, waivers, penalties, refunds, reversals
- student account exceptions

### Hostel and Welfare Staff

Hostel and welfare teams need occupancy and allocation analytics.

Core needs:
- bed occupancy
- hostel utilization
- vacancies
- allocation mismatches
- billed-but-not-allocated students
- allocated-but-not-billed students

### Staff and HR Administration

Staff administration needs visibility into users, roles, access, and teaching load.

Core needs:
- staff by department and role
- active vs inactive accounts
- permissions coverage
- lecturer timetable load

### Management and Leadership

Management needs high-level trend and performance reporting across the institution.

Core needs:
- enrollment trends
- revenue trends
- collection performance
- student retention and dropout trends
- department and program performance
- hostel occupancy and hostel revenue
- operational exception volumes

## Analytics Domains

### 1. Executive Analytics

Purpose:
- Provide a cross-functional summary of institutional performance.

Core KPIs:
- total students
- active students
- new admissions this month
- students registered in active session
- total invoiced
- total collected
- outstanding balance
- overdue balance
- hostel occupancy rate
- top programs by enrollment

Trend views:
- admissions over time
- collections over time
- outstanding over time
- dropout and suspension over time

### 2. Admissions Analytics

Purpose:
- Track intake performance and onboarding completeness.

Core KPIs:
- new admissions by day, week, month, intake
- admissions by department
- admissions by program
- admissions by certification level
- admissions by county
- admissions by gender
- admissions by disability status

Operational queues:
- students with no program enrollment
- students with no next of kin
- students with duplicate email or phone risk
- students with inactive user accounts
- students admitted but not session-enrolled

### 3. Academic Analytics

Purpose:
- Monitor academic participation, delivery, and utilization.

Core KPIs:
- session registration rate
- students per session
- students per year of study
- students per module
- students per program version
- active vs suspended vs dropped vs graduated counts
- unit mapping coverage
- timetable completeness
- room utilization
- lecturer teaching load
- timetable clash count

Operational queues:
- active students not session-registered
- programs with no mapped units
- mapped units not timetabled
- timetables without lecturer
- timetables without room
- room conflicts
- lecturer conflicts

### 4. Finance and Billing Analytics

Purpose:
- Measure billing health, collections, debt exposure, and exceptions.

Core KPIs:
- total invoiced
- total collected
- outstanding balance
- overdue balance
- collection rate
- average payment turnaround
- invoice count by status
- approval volume by status
- manual billing operation count

Breakdowns:
- by academic session
- by department
- by program
- by invoice type
- by payment method
- by date range

Aging buckets:
- current
- 1 to 30 days overdue
- 31 to 60 days overdue
- 61 to 90 days overdue
- over 90 days overdue

Adjustment analytics:
- discounts
- waivers
- bursaries
- HELB
- penalties
- refunds
- reversals
- other adjustments

Operational queues:
- enrollments without invoice
- invoices without items
- payments without allocations
- students with credit balance
- reversed invoices without replacement where required
- invoice approval backlog

### 5. Hostel Analytics

Purpose:
- Track allocation efficiency and hostel revenue linkage.

Core KPIs:
- occupancy rate by hostel
- occupancy rate by room
- available beds
- allocated students
- hostel-billed students
- hostel revenue invoiced
- hostel revenue collected

Operational queues:
- students allocated twice
- room capacity exceeded
- billed but not allocated
- allocated but not billed
- inactive students with active hostel allocation

### 6. Staff and Access Analytics

Purpose:
- Track institutional staffing visibility and access governance.

Core KPIs:
- total staff
- staff by department
- staff by role
- active vs inactive users
- role assignment coverage
- permissions coverage

Operational queues:
- staff with no role
- users with conflicting roles
- inactive staff still holding privileged permissions

### 7. Data Quality and Exception Analytics

Purpose:
- Surface issues that reduce reporting trust or break workflows.

Core KPIs:
- records missing required relationships
- duplicate contact identifiers
- orphaned financial records
- invalid status combinations
- strict-mode error count
- slow-query count
- failed job count

Operational queues:
- student without user
- student without program enrollment
- enrollment without academic session
- invoice without enrollment
- payment without student
- hostel allocation without bed or room
- multiple active academic sessions
- multiple active program mappings where only one should exist

## Metric Dictionary Requirements

Every KPI must have a definition entry with:

- metric name
- business meaning
- source tables
- filter dimensions
- aggregation logic
- exclusions
- handling of soft-deleted records
- refresh strategy
- owning team

Example fields:

```text
Metric: outstanding_balance
Meaning: Sum of unpaid invoice balance for included invoices
Source: student_invoices
Formula: SUM(balance_due) WHERE balance_due > 0
Exclusions: deleted invoices, reversed invoices if reversal policy excludes them
Dimensions: date, session, department, program, invoice_type
Refresh: real-time or daily snapshot
Owner: finance
```

## Canonical Dimensions

These dimensions should be reusable across dashboards and summary tables:

- calendar date
- week
- month
- quarter
- year
- academic year
- academic session
- department
- program
- program version
- certification level
- student status
- year of study
- module
- invoice type
- invoice status
- approval status
- payment method
- hostel
- lecture room
- gender
- county

## Shared Filters

We should standardize filters so dashboards feel consistent.

Global filters:
- date range
- academic year
- academic session
- department
- program
- program version
- student status
- gender
- county

Finance filters:
- invoice type
- invoice status
- approval status
- payment method
- overdue only

Academic filters:
- module
- year of study
- timetable day
- lecturer
- room

Hostel filters:
- hostel
- room
- occupancy status

## Critical Edge Cases

### Student Lifecycle Edge Cases

- student exists but user record missing
- student exists but role assignment missing
- student admitted with no program enrollment
- student has multiple enrollments across periods
- student program changed after billing already happened
- student suspended but still appears as active in operational reports
- student soft-deleted but still included in aggregate trends by mistake

### Academic Edge Cases

- no active academic session
- more than one active academic session
- session number stored inconsistently in `session_No` and `session_number`
- invalid year of study calculation because of bad session numbering
- unit mapping exists without timetable entries
- timetable entries exist without linked units, rooms, or lecturer
- lecturer double-booked
- room double-booked

### Finance Edge Cases

- invoice without enrollment
- invoice without items
- invoice created manually with inconsistent notes or invoice type
- negative balances caused by reversal or over-adjustment
- payment recorded but unallocated
- duplicate payment references
- payment allocated to wrong invoice
- refund posted without original payment linkage
- reversal posted without replacement invoice where expected
- draft invoices included in KPI when they should be excluded
- rejected invoices included in totals by mistake

### Hostel Edge Cases

- active allocation without invoice
- hostel invoice without active allocation
- student assigned to more than one bed
- room capacity exceeded
- allocation still active after student dropped or graduated

### Reporting Integrity Edge Cases

- historical metrics changing because transactional rows were edited later
- timezone affecting "today" or month-end totals
- soft deletes causing trend inconsistencies
- old schema naming still referenced in reports
- relation accessors hiding missing eager loads instead of queries loading the right shape

### Security and Privacy Edge Cases

- student seeing another student's financial data
- exports including sensitive medical or disability data without authorization
- management dashboard exposing row-level personally identifiable information unnecessarily
- broad CSV exports without role checks or audit trail

## Reporting Architecture Plan

### Layer 1. Transactional Queries

Use for:
- recent operational lists
- drill-down pages
- real-time exception queues

Rules:
- must be indexed
- must use explicit eager loading
- should be narrow and filterable

### Layer 2. Analytics Services

Create dedicated service classes for each domain:

- `App\Services\Analytics\ExecutiveAnalyticsService`
- `App\Services\Analytics\AdmissionsAnalyticsService`
- `App\Services\Analytics\AcademicAnalyticsService`
- `App\Services\Analytics\FinanceAnalyticsService`
- `App\Services\Analytics\HostelAnalyticsService`
- `App\Services\Analytics\DataQualityAnalyticsService`

Responsibilities:
- centralize metric logic
- enforce shared definitions
- isolate complex query composition from controllers

### Layer 3. Summary and Snapshot Tables

Introduce pre-aggregated tables for expensive reports:

- `daily_student_metrics`
- `daily_finance_metrics`
- `daily_hostel_metrics`
- `daily_academic_metrics`
- `session_registration_metrics`
- `data_quality_metrics`

Possible fields:
- metric_date
- academic_year_id
- academic_session_id
- department_id
- program_id
- program_version_id
- metric_key
- metric_value
- snapshot_generated_at

Use cases:
- trend charts
- management dashboards
- recurring exports
- stable historical reporting

### Layer 4. Refresh Jobs

Planned jobs:
- nightly summary refresh
- month-end reconciliation refresh
- targeted refresh on major transactions

Examples:
- after bulk invoice generation
- after bulk payment import
- after session activation
- after student admission batch

## Dashboard Implementation Order

### Phase 1. Foundations

- define KPI dictionary
- define shared filter contract
- define analytics service layer
- define data quality rules
- add missing indexes for heavy reporting paths

### Phase 2. Executive Dashboard MVP

Deliver:
- total students
- active students
- new admissions this month
- total invoiced
- total collected
- outstanding balance
- overdue balance
- session registration rate
- hostel occupancy rate

### Phase 3. Finance Dashboard MVP

Deliver:
- collection trend
- outstanding by session
- overdue aging buckets
- overdue by department
- adjustments summary
- payment method breakdown
- credit balance exception queue

### Phase 4. Academic Operations Dashboard MVP

Deliver:
- active session registration rate
- active students not session-registered
- students by module and year
- timetable completeness
- lecturer clash report
- room clash report
- room utilization

### Phase 5. Admissions Dashboard MVP

Deliver:
- intake trend
- admissions by department and program
- county and gender breakdown
- onboarding completion queue

### Phase 6. Hostel Dashboard MVP

Deliver:
- hostel occupancy
- vacancies
- hostel billing linkage checks
- duplicate allocation exceptions

### Phase 7. Data Quality Dashboard

Deliver:
- orphaned records
- duplicate contacts
- multi-active session anomalies
- invoice linkage anomalies
- slow-query and strict-mode operational signals

## Data Governance Rules

- Every metric must declare whether it is real-time or snapshot-based.
- Every financial metric must declare whether draft, rejected, reversed, and soft-deleted records are included.
- Exports must obey role permissions.
- Sensitive data should default to aggregated form.
- Manual finance actions should be auditable.
- Report definitions must be documented before broad rollout.

## Performance Requirements

- Large dashboard views should not depend on N+1 model traversal.
- Expensive cross-domain metrics should use summary tables, not repeated live joins.
- Trend charts should prefer daily snapshots.
- Query budgets and slow-query logging should remain enabled in non-production environments.
- Reporting endpoints must support pagination or summarized export paths for large data sets.

## Proposed Initial Technical Structure

### Backend

- analytics controllers under `app/Http/Controllers/Analytics`
- analytics services under `app/Services/Analytics`
- reporting DTOs or transformers for response shaping
- scheduled jobs for summary refresh
- optional reporting tables and materialized views

### Frontend

- analytics shell page
- reusable KPI card component
- reusable analytics filter bar
- chart components
- drill-down table component
- CSV export support for analytics tables

## First Implementation Backlog

### Step 1

Create the KPI dictionary and analytics domain service interfaces.

Deliverables:
- KPI markdown document
- analytics service folder structure
- placeholder service classes

### Step 2

Implement executive dashboard MVP using current transactional tables.

Deliverables:
- executive analytics service
- backend endpoints
- frontend dashboard cards and charts

### Step 3

Implement finance dashboard MVP and define financial metric exclusions.

Deliverables:
- finance analytics service
- aging logic
- collection trend
- overdue drill-down

### Step 4

Implement academic operations dashboard MVP.

Deliverables:
- session registration metrics
- timetable utilization metrics
- clash reports

### Step 5

Introduce snapshot tables for heavy trend metrics.

Deliverables:
- migrations for daily metrics tables
- nightly refresh job
- reconciliation command

## Open Questions To Resolve During Implementation

- What exactly counts as "active student" for management reporting?
- Should draft invoices count in invoiced totals or only approved/issued invoices?
- How should reversals affect historical revenue trend lines?
- What is the canonical source for session number: `session_No`, `session_number`, or a normalized field?
- Should suspended students count in hostel occupancy?
- Which dashboards require row-level exports and which should remain aggregate only?

## Immediate Recommendation

Start with:

1. KPI dictionary
2. Executive dashboard MVP
3. Finance dashboard MVP
4. Data quality dashboard

That sequence gives fast leadership value while also improving operational trust in the data.
