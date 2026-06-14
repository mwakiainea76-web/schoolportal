# Project Guide

## Overview

This project is a School Management System built with:

- Laravel 12 for the backend
- React for the frontend
- Inertia.js for server-driven SPA navigation
- PostgreSQL-friendly schema patterns

The application is organized around role-aware workflows for:

- `admin`
- `student`
- `hod`
- `trainer`
- `bursar`

The system combines academic operations, admissions, finance, hostel management, reporting, security monitoring, and audit logging in one codebase.

---

## Core Design

The system follows a Laravel MVC + service-layer structure:

- `routes/web.php` defines the browser workflows
- `routes/api.php` exposes authenticated API/reporting/export endpoints
- `app/Http/Controllers` coordinates requests and Inertia responses
- `app/Services` contains business logic and reusable workflows
- `resources/js/Pages` contains role-specific and module-specific React screens
- `tests/Feature` verifies the critical workflows

Inertia is used as the bridge between Laravel and React, so controllers return data-rich page payloads and React renders the UI for each module.

---

## Role Model

Authentication and authorization are role-driven.

Main implementation pieces:

- `App\Models\User`
- `Spatie\Permission\Traits\HasRoles`
- `app/Services/RBACService.php`
- route middleware such as `auth`, `verified`, `role:*`, and `non_student`

How it works:

- every login authenticates a `User`
- each `User` is linked to either a `Student` or `Staff` profile
- roles determine what routes, dashboards, and modules are available
- inactive users are blocked from login and forced out of active sessions

Important access rules:

- students only access student-facing flows
- non-student routes are grouped separately
- admin controls system settings, onboarding, status changes, audit logs, and monitoring
- bursar controls billing and finance operations
- HOD and trainer handle timetable and marks workflows with scoped access

---

## Dashboard System

The application uses one dashboard route with role-based rendering:

- route: `/dashboard`
- controller: `app/Http/Controllers/DashboardController.php`
- page entry: `resources/js/Pages/Dashboard.jsx`

How it works:

- the backend resolves the user’s primary dashboard role
- the frontend maps that role to an independent dashboard component
- each dashboard is fully separated instead of using one overly-conditional page

Dashboard components:

- `Dashboards/AdminDashboard.jsx`
- `Dashboards/BursarDashboard.jsx`
- `Dashboards/HodDashboard.jsx`
- `Dashboards/TrainerDashboard.jsx`
- `Dashboards/StudentDashboard.jsx`
- `Dashboards/GenericStaffDashboard.jsx`

This keeps each dashboard isolated and makes role-specific analytics easier to maintain.

---

## Main Modules

The project is organized into these major modules:

1. Authentication and profile
2. Student onboarding and student lifecycle
3. Staff onboarding and staff lifecycle
4. Academic setup and curriculum management
5. Academic session enrollment
6. Timetable management
7. Marks and results
8. Fee plans, fee assignments, billing, and ledger
9. Hostels and hostel allocations
10. Reports and analytics
11. Security monitoring and log viewer
12. Audit logging

Each of these is explained in detail in [FEATURE_REFERENCE.md](/c:/xampp/htdocs/New%20folder/laravel/docs/FEATURE_REFERENCE.md).

---

## Important Cross-Cutting Behaviors

### 1. Status-driven access

Student and staff lifecycle state is not handled casually in forms.

- students have dedicated enrollment-status workflows
- staff have dedicated staff-status workflows
- status changes also update the linked `users.is_active`
- inactive accounts cannot log in

### 2. Automatic invoicing

When students are enrolled into active academic sessions, finance logic can automatically generate invoices based on the active fee assignment for that academic context.

### 3. Role-aware data scoping

Several modules are scoped by role:

- HOD operations are department-aware
- timetable creation changes based on admin vs HOD context
- reports expose different sections based on the signed-in role

### 4. Service-layer workflows

The application pushes business rules into services instead of leaving them scattered across controllers.

Examples:

- `BillingService`
- `StudentEnrollmentStatusService`
- `StaffStatusService`
- analytics services under `App\Services\Analytics`
- `SecurityMonitoringService`
- `AuditService`

---

## Where To Start In The Codebase

If you want to understand the project quickly, start with these files:

- [routes/web.php](/c:/xampp/htdocs/New%20folder/laravel/routes/web.php)
- [routes/api.php](/c:/xampp/htdocs/New%20folder/laravel/routes/api.php)
- [app/Http/Controllers/DashboardController.php](/c:/xampp/htdocs/New%20folder/laravel/app/Http/Controllers/DashboardController.php)
- [app/Http/Middleware/HandleInertiaRequests.php](/c:/xampp/htdocs/New%20folder/laravel/app/Http/Middleware/HandleInertiaRequests.php)
- [app/Models/User.php](/c:/xampp/htdocs/New%20folder/laravel/app/Models/User.php)
- [resources/js/Pages/Dashboard.jsx](/c:/xampp/htdocs/New%20folder/laravel/resources/js/Pages/Dashboard.jsx)

Then move to the implementation reference:

- [FEATURE_REFERENCE.md](/c:/xampp/htdocs/New%20folder/laravel/docs/FEATURE_REFERENCE.md)
- [ARCHITECTURE_AND_OPERATIONS.md](/c:/xampp/htdocs/New%20folder/laravel/docs/ARCHITECTURE_AND_OPERATIONS.md)

---

## Documentation Map

- [PROJECT_GUIDE.md](/c:/xampp/htdocs/New%20folder/laravel/docs/PROJECT_GUIDE.md)
  General overview, roles, and module map.
- [FEATURE_REFERENCE.md](/c:/xampp/htdocs/New%20folder/laravel/docs/FEATURE_REFERENCE.md)
  Feature-by-feature explanation of behavior and implementation.
- [ARCHITECTURE_AND_OPERATIONS.md](/c:/xampp/htdocs/New%20folder/laravel/docs/ARCHITECTURE_AND_OPERATIONS.md)
  Technical architecture, services, jobs, exports, logging, security, and operational behavior.
- [audit-logging.md](/c:/xampp/htdocs/New%20folder/laravel/docs/audit-logging.md)
  Dedicated audit logging implementation notes.
