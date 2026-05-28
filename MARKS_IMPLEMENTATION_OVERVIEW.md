# Marks Implementation Overview - School Portal

## Executive Summary
The schoolportal system implements a comprehensive marks management system allowing staff to record student assessment marks (theory and practical), HODs to review and publish marks, and students to view their published results. The system supports multiple assessment types and numbers per unit.

---

## 1. Database Schema

### Migration File
**Location:** [database/migrations/2026_05_27_170000_create_student_marks_table.php](database/migrations/2026_05_27_170000_create_student_marks_table.php)

**Table:** `student_marks`

**Columns:**
- `id` - Primary key (auto-increment)
- `academic_session_id` - Foreign key to `academic_sessions` (cascade delete)
- `academic_session_enrollment_id` - Foreign key to `academic_session_enrollments` (cascade delete)
- `student_id` - Foreign key to `students` (cascade delete)
- `program_version_unit_id` - Foreign key to `program_version_units` (cascade delete)
- `assessment_type` - String (20 chars) - Values: "theory" or "practical"
- `assessment_number` - Unsigned integer - Assessment number for the unit
- `marks` - Unsigned tiny integer (0-100) - The actual mark/score
- `is_published` - Boolean (default: false) - Whether marks are published to students
- `recorded_by_staff_id` - Foreign key to `staffs` (nullable, set null on delete)
- `timestamps` - created_at and updated_at

**Unique Constraint:**
- `student_marks_unique_assessment` - Ensures only one mark per student per unit per assessment type/number

---

## 2. Models

### StudentMark Model
**Location:** [app/Models/StudentMark.php](app/Models/StudentMark.php)

**Key Features:**
- Uses `HasFactory` trait for testing
- Fillable attributes: academic_session_id, academic_session_enrollment_id, student_id, program_version_unit_id, assessment_type, assessment_number, marks, is_published, recorded_by_staff_id
- Type casts: assessment_number (integer), marks (integer), is_published (boolean)

**Relationships:**
- `academicSession()` - belongsTo AcademicSession
- `academicSessionEnrollment()` - belongsTo AcademicSessionEnrollment
- `student()` - belongsTo Student
- `programVersionUnit()` - belongsTo ProgramVersionUnit
- `recordedByStaff()` - belongsTo Staff (via recorded_by_staff_id)

---

## 3. Controllers

### StudentMarkController
**Location:** [app/Http/Controllers/StudentMarkController.php](app/Http/Controllers/StudentMarkController.php)

**Primary Methods:**

#### 1. `index(Request $request)` - Mark Entry Form
- **Route:** `GET /academic/marks/`
- **Purpose:** Display mark entry form for staff to submit marks
- **Access:** Authenticated users (staff)
- **Parameters:**
  - `program_version_unit_code` - Unit code (e.g., "ICT101")
  - `assessment_type` - "theory" or "practical"
  - `assessment_number` - Assessment sequence number
- **Returns:** Inertia render of `Grades/Index` view with:
  - Filter parameters
  - Selected unit details
  - Already submitted marks for that assessment
  - Error message if unit not found

#### 2. `store(Request $request)` - Store Marks
- **Route:** `POST /academic/marks/`
- **Purpose:** Save student marks in database
- **Access:** Authenticated staff
- **Validation:**
  - program_version_unit_code: required, string
  - assessment_type: required, in:theory,practical
  - assessment_number: required, integer, min:1
  - entries: required, array, min:1 entry
    - entries.*.registration_number: required, string, distinct
    - entries.*.marks: required, integer, min:0, max:100
- **Logic:**
  1. Validates unit code exists
  2. Validates all students have valid registration numbers
  3. Checks all students are enrolled in the unit
  4. Creates or updates StudentMark records (firstOrNew pattern)
  5. Sets recorded_by_staff_id from authenticated user
  6. Sets is_published to false initially
- **Returns:** Redirect to index with success message

#### 3. `publishIndex(Request $request)` - Publish Review Form
- **Route:** `GET /academic/marks/publish`
- **Purpose:** HOD workspace to review and publish marks
- **Access:** HOD or Admin (enforced via `ensureHod()`)
- **Parameters:** Same as index method
- **Returns:** Inertia render of `Grades/Publish` view with submitted marks data

#### 4. `publishAssessment(Request $request)` - Bulk Publish/Unpublish
- **Route:** `POST /academic/marks/publish`
- **Purpose:** Publish or unpublish all marks for a specific assessment
- **Access:** HOD or Admin only
- **Validation:**
  - program_version_unit_code: required, string
  - assessment_type: required, in:theory,practical
  - assessment_number: required, integer, min:1
  - action: required, in:publish,unpublish
- **Logic:** Updates is_published flag for all marks matching the assessment
- **Returns:** Redirect with success/failure message

#### 5. `togglePublish(Request $request, StudentMark $studentMark)` - Toggle Single Mark
- **Route:** `POST /academic/marks/{studentMark}/publish-toggle`
- **Purpose:** Publish/unpublish a single student's mark
- **Access:** HOD or Admin only
- **Validation:** action: required, in:publish,unpublish
- **Returns:** Back redirect with success message

#### 6. `studentResultsIndex(Request $request)` - View Results
- **Route:** `GET /student/results`
- **Purpose:** Allow students to view their published marks
- **Access:** Authenticated students
- **Parameters:**
  - `module` - Filter by module number (optional)
  - `year_of_study` - Filter by year of study (optional)
- **Logic:**
  1. Retrieves all published marks for authenticated student
  2. Extracts available modules and years of study for filtering
  3. Applies optional filters
  4. Formats mark data for display
- **Returns:** Inertia render of `Grades/StudentResults` view with filtered results

**Helper Methods:**

#### `resolveProgramVersionUnitByCode(string $unitCode)` - Protected
- Looks up ProgramVersionUnit by unit code
- Returns null if not found
- Eagerly loads related data: unit, programVersionMapping with program and version

#### `submittedMarksForAssessment(int $programVersionUnitId, string $assessmentType, int $assessmentNumber)` - Protected
- Retrieves marks for a specific assessment
- Maps StudentMark objects to array format with student/unit details
- Used by both staff entry and HOD publish views

#### `ensureHod(Request $request)` - Protected
- Authorization check
- Aborts with 403 if user doesn't have 'hod' or 'admin' role

---

## 4. Routes

**Location:** [routes/web.php](routes/web.php#L277) (lines 277-284)

```php
Route::prefix('academic/marks')->name('academic.marks.')->group(function () {
    Route::get('/', [StudentMarkController::class, 'index'])->name('index');
    Route::post('/', [StudentMarkController::class, 'store'])->name('store');
    Route::get('/publish', [StudentMarkController::class, 'publishIndex'])
        ->name('publish.index');
    Route::post('/publish', [StudentMarkController::class, 'publishAssessment'])
        ->name('publish.assessment');
    Route::post('/{studentMark}/publish-toggle', [StudentMarkController::class, 'togglePublish'])
        ->name('publish.toggle');
});
```

**Additional Route:**
```php
Route::get('/student/results', [StudentMarkController::class, 'studentResultsIndex'])
```

**Route Names & URLs:**
| Route Name | HTTP Method | URL | Purpose |
|------------|------------|-----|---------|
| academic.marks.index | GET | /academic/marks | View mark entry form |
| academic.marks.store | POST | /academic/marks | Submit marks |
| academic.marks.publish.index | GET | /academic/marks/publish | View publish workspace |
| academic.marks.publish.assessment | POST | /academic/marks/publish | Bulk publish/unpublish |
| academic.marks.publish.toggle | POST | /academic/marks/{id}/publish-toggle | Toggle single mark |
| student.results.index | GET | /student/results | View student results |

---

## 5. Frontend Views

### Location
All views in: [resources/js/Pages/Grades/](resources/js/Pages/Grades/)

### 5.1 Index.jsx - Mark Entry Form
**File:** [resources/js/Pages/Grades/Index.jsx](resources/js/Pages/Grades/Index.jsx)

**Purpose:** Form for staff to enter student marks

**Features:**
- Filter section with:
  - Program version unit code input (searchable)
  - Assessment type selector (theory/practical)
  - Assessment number input
  - Load button
- Mark entry table with:
  - Registration number column
  - Student name column
  - Unit name column
  - Marks input field (0-100)
  - Add/remove row functionality
  - Save button

**Key Interactions:**
- `loadAssessment()` - Fetch marks for selected assessment
- Mark entry form submission to store marks

### 5.2 Publish.jsx - HOD Mark Review
**File:** [resources/js/Pages/Grades/Publish.jsx](resources/js/Pages/Grades/Publish.jsx)

**Purpose:** HOD workspace to review and publish/unpublish marks

**Features:**
- Same filter section as Index
- Assessment load functionality
- Two action buttons:
  - "Publish" - Publish all marks for assessment
  - "Unpublish" - Retract published marks
- Marks table with:
  - Registration number
  - Student name
  - Unit name
  - Marks
  - Published status indicator
  - Individual toggle publish/unpublish button
- Bulk actions across entire assessment

**Key Interactions:**
- `loadAssessment()` - Load assessment details
- `publishAssessment(action)` - Bulk publish/unpublish
- `toggleStudentMark(markId, action)` - Individual mark toggle

### 5.3 StudentResults.jsx - Student Grade View
**File:** [resources/js/Pages/Grades/StudentResults.jsx](resources/js/Pages/Grades/StudentResults.jsx)

**Purpose:** Display student's published marks

**Features:**
- Student information card (name, registration number)
- Summary cards:
  - Total published results count
  - Filtered results count
- Filter section:
  - Module number dropdown
  - Year of study dropdown
  - Reset filters button
- Results table with:
  - Academic session
  - Year of study
  - Module number
  - Unit code
  - Unit name
  - Assessment type
  - Assessment number
  - Marks

**Key Interactions:**
- `updateFilter(field, value)` - Apply filters
- `resetFilters()` - Clear all filters

---

## 6. Navigation Integration

**File:** [resources/js/constants/navItems.jsx](resources/js/constants/navItems.jsx#L212)

**Nav Item:** "Marks Entry"
- Route: `academic.marks.index`
- Fallback URL: `/academic/marks`
- Located in academic management section

---

## 7. Data Flow & Workflows

### Workflow 1: Recording Marks (Staff)
```
1. Staff navigates to /academic/marks
2. Enters program unit code (e.g., ICT101)
3. Selects assessment type (theory/practical)
4. Enters assessment number
5. Clicks "Load" to fetch registered students
6. Fills in marks (0-100) for each student
7. Adds/removes student entries as needed
8. Clicks "Save" to submit
9. System validates and creates StudentMark records
10. Marks saved as unpublished (is_published = false)
11. Success message displayed
```

### Workflow 2: Publishing Marks (HOD)
```
1. HOD navigates to /academic/marks/publish
2. Enters same filter criteria as staff
3. Clicks "Load" to view submitted marks
4. Reviews marks and can:
   a. Publish entire assessment (bulk)
   b. Unpublish entire assessment
   c. Toggle individual student marks
5. Action triggers database update of is_published flag
6. Students can now see published marks
```

### Workflow 3: Viewing Results (Student)
```
1. Student navigates to /student/results
2. Views all published marks automatically
3. Optional: Filters by module or year of study
4. Sees results in table format with details
5. Can reset filters to see all marks
```

---

## 8. Security & Authorization

**Access Control:**
- Mark entry: Any authenticated user (typically staff)
- Mark publishing: HOD or Admin role only (enforced by `ensureHod()`)
- View results: Authenticated students (filtered to their own marks)

**Validation:**
- Unit codes must exist in database
- Registration numbers must match existing students
- Students must be enrolled in the unit
- Marks must be 0-100 integer values
- Only one mark per student per unit per assessment type/number

**Data Protection:**
- Foreign key constraints prevent orphaned records
- Cascade delete removes marks if related records deleted
- Timestamps track record creation/modification

---

## 9. Key Features & Capabilities

✅ **Multiple Assessment Types** - Support for theory and practical
✅ **Multiple Assessments** - Track multiple assessments per unit (assessment_number)
✅ **Bulk Operations** - Publish/unpublish entire assessment at once
✅ **Individual Control** - Toggle individual student marks
✅ **Two-Stage Release** - Marks recorded but hidden until HOD publishes
✅ **Audit Trail** - Records which staff member entered marks
✅ **Filtering** - Students can filter results by module and year
✅ **Real-time Validation** - Client-side and server-side validation
✅ **Enrollment Verification** - Ensures only registered students get marks

---

## 10. Related Models

The marks system depends on and relates to:

- **Student** - Has many StudentMark records
- **AcademicSession** - Marks belong to academic sessions
- **AcademicSessionEnrollment** - Tracks student enrollment for each session
- **ProgramVersionUnit** - The unit/course for which marks are recorded
- **ProgramVersionMapping** - Maps programs to units
- **Staff** - Records who entered the marks
- **User** - Staff/Student user accounts

---

## 11. Database Relationships Diagram

```
StudentMark
├── academic_session_id ──→ AcademicSession
├── academic_session_enrollment_id ──→ AcademicSessionEnrollment
├── student_id ──→ Student (via User)
├── program_version_unit_id ──→ ProgramVersionUnit
│   └── program_version_mapping_id ──→ ProgramVersionMapping
│       ├── program_id ──→ Program
│       └── program_version_id ──→ ProgramVersion
└── recorded_by_staff_id ──→ Staff (via User)
```

---

## 12. Summary Statistics

| Component | Count | Details |
|-----------|-------|---------|
| **Models** | 1 | StudentMark |
| **Controllers** | 1 | StudentMarkController (6 methods) |
| **Routes** | 6 | Web routes for marks operations |
| **Migrations** | 1 | Create student_marks table |
| **Views** | 3 | Index, Publish, StudentResults |
| **Database Relationships** | 5 | Relationships to 5 other models |
| **Route Groups** | 2 | academic.marks.* and student.results |

---

## 13. Configuration & Settings

**Marks Range:** 0-100 (unsigned tiny integer)

**Assessment Types:** 
- "theory"
- "practical"

**Default Values:**
- is_published: false
- recorded_by_staff_id: nullable (set from authenticated user)

**Role-Based Access:**
- Staff: Can record marks
- HOD: Can publish/unpublish marks
- Admin: Can do everything
- Students: Can view only their published marks

---

## 14. Potential Extensions/Improvements

1. Mark weightage (weight theory vs practical)
2. Automatic pass/fail determination based on marks
3. GPA calculation
4. Transcript generation
5. Mark appeal/review workflow
6. Historical mark tracking/auditing
7. Batch mark import (CSV/Excel)
8. Email notifications when marks published
9. Mark statistics/analytics (class average, distribution)
10. Customizable mark bands (A, B, C grades)

---

**Last Updated:** May 27, 2026
**Database Schema Version:** 2026_05_27_170000
