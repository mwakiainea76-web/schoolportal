# QA Test Plan

This checklist is designed to help verify all major features implemented so far, with emphasis on role access, functional correctness, regressions, and data integrity.

## 1. Test Setup

Before testing any module:

- Use a fresh or known-good database snapshot.
- Run migrations cleanly.
- Seed or prepare sample data for:
  - Departments
  - Staff
  - Students
  - Courses
  - Course version mappings
  - Curriculum units
  - Academic years
  - Academic sessions
  - Lecture rooms
  - Invoices
  - Payments
- Prepare test users for:
  - `admin`
  - `hod`
  - `trainer`
  - `bursar`
  - `student`
- Keep browser dev tools open to capture failed requests.
- Keep Laravel logs open during testing.

## 2. How To Record Results

For every test case, record:

- Scenario
- Role
- Steps
- Expected result
- Actual result
- Pass/Fail
- Notes

Suggested status values:

- `PASS`
- `FAIL`
- `BLOCKED`
- `NEEDS REVIEW`

## 3. Global Smoke Test

Run this first before module-by-module testing.

### Authentication

- [ ] Login works for `admin`
- [ ] Login works for `hod`
- [ ] Login works for `trainer`
- [ ] Login works for `bursar`
- [ ] Login works for `student`
- [ ] Invalid credentials are rejected properly
- [ ] Logout works

### Route Protection

- [ ] Admin-only routes reject non-admin users
- [ ] HOD-only routes reject unauthorized users
- [ ] Billing routes reject unauthorized users
- [ ] Student routes reject staff users where appropriate
- [ ] Timetable routes allow correct roles and block wrong ones

### Shared UI Checks

- [ ] No page has broken layout on desktop
- [ ] No page has broken layout on mobile width
- [ ] Modals open and close correctly
- [ ] Buttons show loading/disabled behavior where needed
- [ ] Validation messages appear correctly

## 4. Dashboard Testing

### Admin Dashboard

- [ ] Admin sees admin dashboard only
- [ ] Admin analytics render without errors
- [ ] Admin shortcuts and actions link correctly

### HOD Dashboard

- [ ] HOD sees HOD dashboard only
- [ ] HOD analytics are role-specific
- [ ] HOD does not inherit admin-only UI accidentally

### Trainer Dashboard

- [ ] Trainer sees trainer dashboard only
- [ ] Trainer analytics are role-specific
- [ ] Trainer actions render independently

### Bursar Dashboard

- [ ] Bursar sees bursar dashboard only
- [ ] Billing/finance analytics render correctly

### Student Dashboard

- [ ] Student dashboard still works after role-based dashboard separation
- [ ] Student widgets and actions remain functional

## 5. Staff Onboarding

### Create Staff

- [ ] Single-page onboarding form loads fully
- [ ] All required fields are visible
- [ ] Valid submission creates staff successfully
- [ ] Department assignment saves correctly
- [ ] Role assignment saves correctly
- [ ] Related staff profile data saves correctly

### Validation

- [ ] Missing required fields are blocked
- [ ] Invalid formats are blocked
- [ ] Duplicate values are handled correctly

### Edit Staff

- [ ] Edit page loads existing data
- [ ] Update saves correctly
- [ ] Validation still applies during update

## 6. Student Admission

### Create Student

- [ ] Admission form loads correctly
- [ ] Required dropdowns populate correctly
- [ ] Admission number generation works
- [ ] Student can be saved successfully

### Relationships

- [ ] Student links to course correctly
- [ ] Student links to curriculum mapping correctly
- [ ] Student links to academic session/year correctly

### Validation and Edge Cases

- [ ] Missing required data is blocked
- [ ] Invalid dependent selections are blocked
- [ ] Duplicate admissions are handled correctly

### Edit Student

- [ ] Existing student loads for edit
- [ ] Updates save correctly
- [ ] Admission-related documents/actions still work

## 7. Curriculum, Mappings, and Units

### Course Version Mapping

- [ ] Search/select for versioned course loads results
- [ ] Create unit form fetches versioned course correctly
- [ ] Edit unit form fetches versioned course correctly

### Unit Create

- [ ] Unit create page loads correctly
- [ ] Course version mapping can be selected
- [ ] Unit code saves correctly
- [ ] Unit name saves correctly
- [ ] Credit factor saves correctly
- [ ] Module taught saves correctly
- [ ] Scope saves correctly

### Scope and Filters

- [ ] Scope values available are `basic`, `common`, `core`
- [ ] Scope filter appears in filters column
- [ ] Module filter appears in filters column
- [ ] Scope filter is disabled until course is selected
- [ ] Module filter is disabled until course is selected
- [ ] Scope filter works after course selection
- [ ] Module filter works after course selection

### Removed Fields Regression Check

- [ ] `semester` no longer appears in create/edit
- [ ] `module_slot` no longer appears in create/edit
- [ ] `sort_order` no longer appears in create/edit
- [ ] `compulsory` no longer appears in create/edit
- [ ] Backend no longer expects removed fields

### Unit List and Search

- [ ] Unit listing loads correctly
- [ ] Filtering by course works
- [ ] Filtering by module works
- [ ] Filtering by scope works
- [ ] Combined filters produce correct results

## 8. Timetable Testing

This is a high-risk module and should be tested carefully.

### Access and Routing

- [ ] Admin can open timetable index
- [ ] HOD can open timetable index
- [ ] Trainer can open timetable index if intended
- [ ] Admin can click `Add Timetable` without `403`
- [ ] HOD can click `Add Timetable` without `403`
- [ ] Wrong roles are blocked where appropriate

### Admin Timetable Create Flow

- [ ] Admin create page loads
- [ ] Department dropdown loads
- [ ] Selecting department populates mapped courses
- [ ] Selecting course version mapping populates units
- [ ] Units fetched are only those linked to selected mapping
- [ ] Module filter works on selected course
- [ ] Trainer field loads staff results
- [ ] Trainer search is flexible beyond department
- [ ] Lecture room field loads correctly

### HOD Timetable Create Flow

- [ ] HOD page loads
- [ ] Department field is hidden for HOD
- [ ] Course field is preloaded from HOD department
- [ ] Selecting course populates units
- [ ] Units fetched are from correct mapping
- [ ] Trainer field still allows wider search where intended
- [ ] Lecture room field loads correctly

### Unit Selection and Assignment

- [ ] Units display in correct simplified format
- [ ] User can select the intended unit(s)
- [ ] Assigned unit saves correctly
- [ ] Edit existing timetable opens correctly
- [ ] Existing filled units show proper state if designed that way

### Merge and Conflict Rules

- [ ] Same slot can be reused only when merge conditions are met
- [ ] Merge requires same room
- [ ] Merge requires same trainer
- [ ] Merge requires same time/day
- [ ] If any merge condition fails, save is rejected
- [ ] User gets clear feedback when merge happens
- [ ] Merged units still preserve their own unit codes in timetable records

### Timetable Index and Filters

- [ ] Timetable list loads correctly
- [ ] Department filter works
- [ ] Academic session filter works
- [ ] Course filter works
- [ ] Module filter works
- [ ] Trainer filter works
- [ ] Edit action works
- [ ] Delete action works

## 9. Finance and Billing

### General Billing Access

- [ ] Admin can access billing pages
- [ ] Bursar can access billing pages
- [ ] Unauthorized roles cannot access billing pages

### Post Student Charge

- [ ] Modal opens from parent page correctly
- [ ] Layout is responsive
- [ ] Form is not congested
- [ ] Inputs are grouped with at most 3 per row
- [ ] Admission number field works
- [ ] Invoice type field works
- [ ] Amount field works
- [ ] Date fields work
- [ ] Description field works
- [ ] Submission saves correctly

### Record Payment

- [ ] Modal opens from parent page correctly
- [ ] Inputs align properly in one layout flow
- [ ] Reference field is merged with other inputs as intended
- [ ] Payment method works
- [ ] Payment date works
- [ ] Amount works
- [ ] Note/reference saves correctly
- [ ] Submission updates balances correctly

### Reduce Student Charge

- [ ] Modal opens correctly
- [ ] UI matches updated design direction
- [ ] Form remains responsive
- [ ] Charge reduction saves correctly
- [ ] Over-reduction is blocked

### Post Penalty

- [ ] Penalty form exists directly in its main file
- [ ] Modal is called from the parent page
- [ ] Penalty saves correctly
- [ ] Student balance updates correctly

### Financial Integrity

- [ ] Invoice totals calculate correctly
- [ ] Payment reduces invoice/student balance correctly
- [ ] Penalties increase balances correctly
- [ ] Reductions reduce balances correctly
- [ ] Duplicate or accidental double submission is handled safely
- [ ] Statements/ledger reflect all changes correctly

## 10. Logs and Performance

### Log Viewer

- [ ] Logs page loads
- [ ] File dropdown/select works
- [ ] Selected file metadata is correct
- [ ] Entries display for active file
- [ ] Level filter works
- [ ] Tail lines filter works
- [ ] Search filter works
- [ ] Empty state only appears when truly no matches exist

### Performance Dashboard

- [ ] Performance dashboard loads
- [ ] Error status updates work
- [ ] Endpoint status updates work
- [ ] No broken cards or panels appear

## 11. Regression Checks

Run these after all functional testing.

### Frontend Regression

- [ ] No console errors on key pages
- [ ] No missing imports after refactors
- [ ] No orphaned modal/form references
- [ ] No duplicated form components left in old directories unexpectedly

### Backend Regression

- [ ] No request class points to removed fields
- [ ] No controller references removed UI fields
- [ ] No model fillable/casts/reference mismatch exists
- [ ] No route names are stale after refactors
- [ ] No merged migrations left schema inconsistent

### Database Regression

- [ ] New/merged columns exist as expected
- [ ] Foreign keys still work
- [ ] Indexes still work
- [ ] Seed data inserts cleanly

## 12. Code Review Walkthrough

Use this when you want to inspect code file by file.

### Controllers

Check each controller for:

- [ ] Duplicate logic
- [ ] Missing authorization
- [ ] Validation bypasses
- [ ] Incorrect redirects
- [ ] Wrong role handling
- [ ] N+1 query risks

### Requests

Check each request for:

- [ ] Required fields match UI
- [ ] Removed fields are truly removed
- [ ] Custom validation rules are still accurate
- [ ] Role-specific constraints are valid

### Models

Check each model for:

- [ ] Correct relationships
- [ ] Correct fillable fields
- [ ] Correct casts
- [ ] Dead accessors/scopes

### Frontend Pages

Check each page for:

- [ ] Broken props
- [ ] Duplicate JSX sections
- [ ] Role leakage between dashboards
- [ ] Old modal structure still hanging around
- [ ] Inconsistent field naming

### Routes

Check routes for:

- [ ] Correct middleware
- [ ] Correct role restrictions
- [ ] No duplicate/conflicting routes
- [ ] Route names match frontend usage

### Migrations

Check migrations for:

- [ ] Parent migrations contain intended merged schema
- [ ] Child/redundant migrations are no longer needed
- [ ] Columns added in code truly exist in DB

## 13. High-Priority End-to-End Scenarios

These should always pass before considering the build stable.

- [ ] Admin logs in, opens dashboard, creates timetable, edits timetable, views timetable
- [ ] HOD logs in, opens dashboard, creates department timetable allocation, edits it
- [ ] Trainer logs in, views relevant timetable and trainer-facing dashboard
- [ ] Bursar/admin posts student charge, records payment, posts penalty, reduces charge
- [ ] Admin/staff onboards a new staff member successfully
- [ ] Admin admits a student successfully
- [ ] User can create and filter units by course, module, and scope
- [ ] Log viewer displays entries correctly

## 14. Recommended Testing Order

Use this order to keep testing efficient:

1. Authentication and role access
2. Dashboards
3. Staff onboarding
4. Student admission
5. Course mappings and units
6. Timetable
7. Finance and billing
8. Logs and performance
9. Regression pass
10. File-by-file code review

## 15. Next Step

After completing this checklist, create a bug list with:

- Severity
- Module
- Reproduction steps
- Expected behavior
- Actual behavior
- File(s) likely involved

That bug list will make the next cleanup pass much faster and safer.
