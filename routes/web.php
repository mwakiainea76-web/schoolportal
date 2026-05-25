<?php

use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\AcademicSessionEnrollmentController;
use App\Http\Controllers\AcademicTimetableController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CertificationLevelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ExamBodyController;
use App\Http\Controllers\FeeAssignmentController;
use App\Http\Controllers\FeePlanController;
use App\Http\Controllers\FeePlanItemController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LedgerTransactionController;
use App\Http\Controllers\LectureRoomController;
use App\Http\Controllers\HostelAllocationController;
use App\Http\Controllers\HostelController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramEnrollmentController;
use App\Http\Controllers\ProgramVersionController;
use App\Http\Controllers\ProgramVersionMappingController;
use App\Http\Controllers\ProgramVersionUnitController;
use App\Http\Controllers\ReportingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => redirect()->route('login'));

Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');

Route::get('/dashboard', [DashboardController::class, 'redirect'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [DashboardController::class, 'studentDashboard'])
        ->name('student.dashboard');
    Route::post('/student/dashboard/register-session', [AcademicSessionEnrollmentController::class, 'registerCurrentStudent'])
        ->name('student.dashboard.register-session');
    Route::get('/student/program-units', [ProgramVersionUnitController::class, 'studentIndex'])
        ->name('student.program-units.index');
    Route::get('/student/fee-statements', [InvoiceController::class, 'studentStatementsIndex'])
        ->name('student.fee-statements.index');
    Route::get('/student/fee-statements/{invoice}', [InvoiceController::class, 'studentStatementShow'])
        ->name('student.fee-statements.show');
});

Route::get('/staff/dashboard', [DashboardController::class, 'staffDashboard'])
    ->middleware(['auth', 'verified', 'non_student'])
    ->name('staff.dashboard');

/*
|--------------------------------------------------------------------------
| AUTH GROUP
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'non_student'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | EXAM BODIES
    |--------------------------------------------------------------------------
    */
    Route::prefix('exam-bodies')->name('exam.bodies.')->group(function () {
        Route::get('/', [ExamBodyController::class, 'index'])->name('index');
        Route::get('/create', [ExamBodyController::class, 'create'])->name('create');
        Route::post('/', [ExamBodyController::class, 'store'])->name('store');
        Route::get('/search', [ExamBodyController::class, 'search'])->name('search');

        Route::get('/{exam_body}/edit', [ExamBodyController::class, 'edit'])->name('edit');
        Route::put('/{exam_body}', [ExamBodyController::class, 'update'])->name('update');
        Route::delete('/{exam_body}', [ExamBodyController::class, 'destroy'])->name('destroy');

        Route::get('/reports', [ExamBodyController::class, 'showReports'])->name('reports');
    });

    /*
    |--------------------------------------------------------------------------
    | CERTIFICATION LEVELS
    |--------------------------------------------------------------------------
    */
    Route::prefix('exam-bodies/certification-levels')->name('certification-levels.')->group(function () {
        Route::get('/', [CertificationLevelController::class, 'index'])->name('index');
        Route::get('/create', [CertificationLevelController::class, 'create'])->name('create');
        Route::post('/', [CertificationLevelController::class, 'store'])->name('store');

        Route::get('/{certification_level}/edit', [CertificationLevelController::class, 'edit'])->name('edit');
        Route::put('/{certification_level}', [CertificationLevelController::class, 'update'])->name('update');
        Route::delete('/{certification_level}', [CertificationLevelController::class, 'destroy'])->name('destroy');

        Route::get('/search', [CertificationLevelController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | DEPARTMENTS
    |--------------------------------------------------------------------------
    */
    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::get('/create', [DepartmentController::class, 'create'])->name('create');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');

        Route::get('/{department}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');

        Route::get('/search', [DepartmentController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | PROGRAMS
    |--------------------------------------------------------------------------
    */
    Route::prefix('programs')->name('programs.')->group(function () {
        Route::get('/', [ProgramController::class, 'index'])->name('index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create');
        Route::post('/', [ProgramController::class, 'store'])->name('store');
        Route::get('/enrollments', [ProgramEnrollmentController::class, 'index'])->name('enrollments.index');

        Route::get('/{program}/edit', [ProgramController::class, 'edit'])->name('edit');
        Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
        Route::delete('/{program}', [ProgramController::class, 'destroy'])->name('destroy');

        Route::get('/search', [ProgramController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | CURRICULUM
    |--------------------------------------------------------------------------
    */
    Route::prefix('program-versions')->name('program-versions.')->group(function () {
        Route::get('/', [ProgramVersionController::class, 'index'])->name('index');
        Route::get('/create', [ProgramVersionController::class, 'create'])->name('create');
        Route::post('/', [ProgramVersionController::class, 'store'])->name('store');

        Route::get('/{curriculum}/edit', [ProgramVersionController::class, 'edit'])->name('edit');
        Route::put('/{curriculum}', [ProgramVersionController::class, 'update'])->name('update');
        Route::delete('/{curriculum}', [ProgramVersionController::class, 'destroy'])->name('destroy');

        Route::get('/search', [ProgramVersionController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | PROGRAM VERSION MAPPINGS
    |--------------------------------------------------------------------------
    */
    Route::prefix('programs/program-versions')->name('programs.program-version-mappings.')->group(function () {
        Route::get('/', [ProgramVersionMappingController::class, 'index'])->name('index');
        Route::get('/create', [ProgramVersionMappingController::class, 'create'])->name('create');
        Route::post('/', [ProgramVersionMappingController::class, 'store'])->name('store');

        Route::get('/search', [ProgramVersionMappingController::class, 'search'])->name('search');
        Route::get('/program-search', [ProgramVersionMappingController::class, 'programSearch'])->name('program-search');

        Route::get('/{programVersionMapping}/edit', [ProgramVersionMappingController::class, 'edit'])->name('edit');
        Route::put('/{programVersionMapping}', [ProgramVersionMappingController::class, 'update'])->name('update');
        Route::delete('/{programVersionMapping}', [ProgramVersionMappingController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | UNITS
    |--------------------------------------------------------------------------
    */
    Route::prefix('units')->name('units.')->group(function () {
        Route::get('/', [UnitController::class, 'index'])->name('index');
        Route::get('/create', [UnitController::class, 'create'])->name('create');
        Route::post('/', [UnitController::class, 'store'])->name('store');

        Route::get('/edit', [UnitController::class, 'edit'])->name('editpage');
        Route::get('/{unit?}/edit', [UnitController::class, 'edit'])->name('edit');

        Route::put('/{unit}', [UnitController::class, 'update'])->name('update');
        Route::delete('/{unit}', [UnitController::class, 'destroy'])->name('destroy');

        Route::get('/search', [UnitController::class, 'search'])->name('search');
    });

    Route::prefix('units/program-versions')->name('units.program-version-units.')->group(function () {
        Route::get('/', [ProgramVersionUnitController::class, 'index'])->name('index');
        Route::get('/create', [ProgramVersionUnitController::class, 'create'])->name('create');
        Route::post('/', [ProgramVersionUnitController::class, 'store'])->name('store');

        Route::get('/edit', [ProgramVersionUnitController::class, 'edit'])->name('editpage');
        Route::get('/{curriculum_unit?}/edit', [ProgramVersionUnitController::class, 'edit'])->name('edit');

        Route::put('/{curriculum_unit}', [ProgramVersionUnitController::class, 'update'])->name('update');
        Route::delete('/{curriculum_unit}', [ProgramVersionUnitController::class, 'destroy'])->name('destroy');

        Route::get('/search', [ProgramVersionUnitController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | ACADEMIC YEARS
    |--------------------------------------------------------------------------
    */
    Route::prefix('academic/years')->name('academic.years.')->group(function () {
        Route::get('/', [AcademicYearController::class, 'index'])->name('index');
        Route::get('/create', [AcademicYearController::class, 'create'])->name('create');
        Route::post('/', [AcademicYearController::class, 'store'])->name('store');

        Route::get('/{academic_year}/edit', [AcademicYearController::class, 'edit'])->name('edit');
        Route::put('/{academic_year}', [AcademicYearController::class, 'update'])->name('update');
        Route::delete('/{academic_year}', [AcademicYearController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | ACADEMIC SESSIONS
    |--------------------------------------------------------------------------
    */
    Route::prefix('academic/sessions')->name('academic.sessions.')->group(function () {
        Route::get('/', [AcademicSessionController::class, 'index'])->name('index');
        Route::get('/create', [AcademicSessionController::class, 'create'])->name('create');
        Route::post('/', [AcademicSessionController::class, 'store'])->name('store');

        Route::get('/search', [AcademicSessionController::class, 'search'])->name('search');

        Route::get('/{academic_session}/edit', [AcademicSessionController::class, 'edit'])->name('edit');
        Route::put('/{academic_session}', [AcademicSessionController::class, 'update'])->name('update');
        Route::delete('/{academic_session}', [AcademicSessionController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('academic/sessions/enrollments')->name('academic.sessions.enrollments.')->group(function () {
        Route::get('/', [AcademicSessionEnrollmentController::class, 'index'])->name('index');
        Route::get('/create', [AcademicSessionEnrollmentController::class, 'create'])->name('create');
        Route::post('/', [AcademicSessionEnrollmentController::class, 'store'])->name('store');
        Route::get('/{academicSessionEnrollment}/edit', [AcademicSessionEnrollmentController::class, 'edit'])->name('edit');
        Route::patch('/{academicSessionEnrollment}', [AcademicSessionEnrollmentController::class, 'update'])->name('update');
        Route::delete('/{academicSessionEnrollment}', [AcademicSessionEnrollmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('academic/timetables')->name('academic.timetables.')->group(function () {
        Route::get('/', [AcademicTimetableController::class, 'index'])->name('index');
        Route::get('/create', [AcademicTimetableController::class, 'create'])->name('create');
        Route::post('/', [AcademicTimetableController::class, 'store'])->name('store');
        Route::get('/{timetable}/edit', [AcademicTimetableController::class, 'edit'])->name('edit');
        Route::put('/{timetable}', [AcademicTimetableController::class, 'update'])->name('update');
        Route::delete('/{timetable}', [AcademicTimetableController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('lecture-rooms')->name('lecture-rooms.')->group(function () {
        Route::get('/', [LectureRoomController::class, 'index'])->name('index');
        Route::get('/create', [LectureRoomController::class, 'create'])->name('create');
        Route::post('/', [LectureRoomController::class, 'store'])->name('store');
        Route::get('/{lecture_room}/edit', [LectureRoomController::class, 'edit'])->name('edit');
        Route::put('/{lecture_room}', [LectureRoomController::class, 'update'])->name('update');
        Route::delete('/{lecture_room}', [LectureRoomController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hostels')->name('hostels.')->group(function () {
        Route::get('/', [HostelController::class, 'index'])->name('index');
        Route::get('/create', [HostelController::class, 'create'])->name('create');
        Route::post('/', [HostelController::class, 'store'])->name('store');
        Route::get('/{hostel}/edit', [HostelController::class, 'edit'])->name('edit');
        Route::put('/{hostel}', [HostelController::class, 'update'])->name('update');
        Route::delete('/{hostel}', [HostelController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hostel-allocations')->name('hostel-allocations.')->group(function () {
        Route::get('/', [HostelAllocationController::class, 'index'])->name('index');
        Route::get('/create', [HostelAllocationController::class, 'create'])->name('create');
        Route::post('/', [HostelAllocationController::class, 'store'])->name('store');
        Route::get('/{hostel_allocation}/edit', [HostelAllocationController::class, 'edit'])->name('edit');
        Route::put('/{hostel_allocation}', [HostelAllocationController::class, 'update'])->name('update');
    });

    /*
    |--------------------------------------------------------------------------
    | FEES → PLANS
    |--------------------------------------------------------------------------
    */
    Route::prefix('fees/plans')->name('fees.plans.')->group(function () {
        Route::get('/', [FeePlanController::class, 'index'])->name('index');
        Route::get('/create', [FeePlanController::class, 'create'])->name('create');
        Route::post('/', [FeePlanController::class, 'store'])->name('store');

        Route::get('/{feePlan}/edit', [FeePlanController::class, 'edit'])->name('edit');
        Route::get('/{feePlan}/items', [FeePlanController::class, 'items'])->name('items');
        Route::put('/{feePlan}', [FeePlanController::class, 'update'])->name('update');
        Route::delete('/{feePlan}', [FeePlanController::class, 'destroy'])->name('destroy');

        Route::post('/{feePlan}/approval', [FeePlanController::class, 'approval'])->name('approval');
    });

    /*
    |--------------------------------------------------------------------------
    | FEES → ASSIGNMENTS (CLEAN + FIXED)
    |--------------------------------------------------------------------------
    */
    Route::prefix('fees/assignments')->name('fees.assignments.')->group(function () {

        Route::get('/', [FeeAssignmentController::class, 'index'])->name('index');
        Route::get('/create', [FeeAssignmentController::class, 'create'])->name('create');
        Route::post('/', [FeeAssignmentController::class, 'store'])->name('store');

        Route::get('/search', [FeeAssignmentController::class, 'search'])->name('search');

        Route::get('/{feeAssignment}/edit', [FeeAssignmentController::class, 'edit'])->name('edit');
        Route::put('/{feeAssignment}', [FeeAssignmentController::class, 'update'])->name('update');
        Route::delete('/{feeAssignment}', [FeeAssignmentController::class, 'destroy'])->name('destroy');

        Route::post('/{id}/restore', [FeeAssignmentController::class, 'restore'])->name('restore');
        Route::post('/resolve', [FeeAssignmentController::class, 'resolve'])->name('resolve');
        Route::post('/{feeAssignment}/approval', [FeeAssignmentController::class, 'approval'])->name('approval');

        // BULK
        Route::get('/bulk', [FeeAssignmentController::class, 'bulk'])->name('bulk');
        Route::get('/bulk/certification-levels', [FeeAssignmentController::class, 'bulkCertificationLevels'])->name('bulk.certification-levels');
        Route::get('/bulk/program-versionss', [FeeAssignmentController::class, 'bulkProgramVersions'])->name('bulk.curriculums');
        Route::post('/bulk/assign', [FeeAssignmentController::class, 'bulkAssign'])->name('bulk.assign');
        Route::post('/bulk/replace', [FeeAssignmentController::class, 'bulkReplace'])->name('bulk.replace');
        Route::post('/bulk/preview', [FeeAssignmentController::class, 'bulkPreview'])->name('bulk.preview');
    });

    /*
    |--------------------------------------------------------------------------
    | FEES → PLAN ITEMS BULK
    |--------------------------------------------------------------------------
    */
    Route::prefix('fees/plans/items')->name('fees.plans.items.')->group(function () {
        Route::get('/', [FeePlanItemController::class, 'index'])->name('index');
        Route::get('/create', [FeePlanItemController::class, 'create'])->name('create');
        Route::post('/', [FeePlanItemController::class, 'store'])->name('store');

        Route::get('/search', [FeePlanItemController::class, 'search'])->name('search');

        Route::get('/{feePlanItem}/edit', [FeePlanItemController::class, 'edit'])->name('edit');
        Route::put('/{feePlanItem}', [FeePlanItemController::class, 'update'])->name('update');
        Route::delete('/{feePlanItem}', [FeePlanItemController::class, 'destroy'])->name('destroy');

        Route::post('/bulk-destroy', [FeePlanItemController::class, 'bulkDestroy'])->name('bulk-destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | BILLING
    |--------------------------------------------------------------------------
    */
    Route::prefix('billing')->name('billing.')->group(function () {

        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::get('/ledger', [LedgerTransactionController::class, 'index'])->name('ledger.index');
        Route::get('/manual-operations', [InvoiceController::class, 'manualOperations'])->name('manual.index');
        Route::get('/manual-operations/additional-invoice', [InvoiceController::class, 'manualInvoiceCreate'])->name('manual.invoices.create');
        Route::get('/manual-operations/record-payment', [InvoiceController::class, 'manualPaymentCreate'])->name('manual.payments.create');
        Route::get('/manual-operations/post-penalty', [InvoiceController::class, 'manualPenaltyCreate'])->name('manual.penalties.create');
        Route::get('/manual-operations/apply-adjustment', [InvoiceController::class, 'manualAdjustmentCreate'])->name('manual.adjustments.create');
        Route::post('/manual-invoices', [InvoiceController::class, 'storeManualInvoice'])->name('manual.invoices.store');
        Route::post('/manual-payments', [InvoiceController::class, 'storePayment'])->name('manual.payments.store');
        Route::post('/manual-penalties', [InvoiceController::class, 'storePenalty'])->name('manual.penalties.store');
        Route::post('/manual-adjustments', [InvoiceController::class, 'storeAdjustment'])->name('manual.adjustments.store');

        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

        Route::post('/invoices/{invoice}/approval', [InvoiceController::class, 'approval'])->name('invoices.approval');

        Route::post('/bulk-invoices', [InvoiceController::class, 'bulkGenerate'])->name('bulk.invoices');
        Route::post('/bulk-discounts', [InvoiceController::class, 'bulkApplyDiscount'])->name('bulk.discounts');
        Route::post('/bulk-generate-from-plans', [InvoiceController::class, 'store'])->name('bulk.generate.from.plans');

        Route::get('/bulk-operations', [InvoiceController::class, 'bulkOperations'])->name('bulk.operations');
    });

    /*
    |--------------------------------------------------------------------------
    | STAFFS
    |--------------------------------------------------------------------------
    */
    Route::prefix('staffs')->name('staffs.')->group(function () {
        Route::get('/', [StaffController::class, 'index'])->name('index');
        Route::get('/create', [StaffController::class, 'create'])->name('create');
        Route::post('/', [StaffController::class, 'store'])->name('store');

        Route::get('/{staff}/edit', [StaffController::class, 'edit'])->name('edit');
        Route::put('/{staff}', [StaffController::class, 'update'])->name('update');
        Route::delete('/{staff}', [StaffController::class, 'destroy'])->name('destroy');

        Route::post('/validate-step', [StaffController::class, 'validateStep'])->name('validateStep');
    });

    /*
    |--------------------------------------------------------------------------
    | STUDENTS
    |--------------------------------------------------------------------------
    */
    Route::prefix('students')->name('students.')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/create', [StudentController::class, 'create'])->name('create');
        Route::post('/', [StudentController::class, 'store'])->name('store');

        Route::get('/{student}/edit', [StudentController::class, 'edit'])->name('edit');
        Route::put('/{student}', [StudentController::class, 'update'])->name('update');
        Route::delete('/{student}', [StudentController::class, 'destroy'])->name('destroy');

        Route::post('/validate-step', [StudentController::class, 'validateStep'])->name('validateStep');
        Route::get('/search', [StudentController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | ROLES
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/create', [RoleController::class, 'create'])->name('create');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/search', [RoleController::class, 'search'])->name('search');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
        Route::get('/{role}/permissions', [RoleController::class, 'editpermission'])->name('permissions.edit');
        Route::post('/permissions/assign', [RoleController::class, 'assignPermissions'])->name('permissions.assign');
    });

    /*
    |--------------------------------------------------------------------------
    | PERMISSIONS
    |--------------------------------------------------------------------------
    */
    Route::prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');
        Route::get('/create', [PermissionController::class, 'create'])->name('create');
        Route::post('/', [PermissionController::class, 'store'])->name('store');
        Route::get('/search', [PermissionController::class, 'search'])->name('search');
        Route::get('/roles', [PermissionController::class, 'roles'])->name('roles');
        Route::post('/roles/sync', [PermissionController::class, 'syncRolePermissions'])->name('roles.sync');
        Route::get('/{permission}/edit', [PermissionController::class, 'edit'])->name('edit');
        Route::put('/{permission}', [PermissionController::class, 'update'])->name('update');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | REPORTS
    |--------------------------------------------------------------------------
    */
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportingController::class, 'index'])->name('dashboard');
        Route::get('/api/outstanding-balance', [ReportingController::class, 'outstandingBalance'])->name('api.outstanding');
        Route::get('/api/overdue-department', [ReportingController::class, 'overdueByDepartment'])->name('api.overdue');
        Route::get('/api/collection-performance', [ReportingController::class, 'collectionPerformance'])->name('api.collection');
        Route::get('/api/fee-plan-usage', [ReportingController::class, 'feePlanUsage'])->name('api.usage');
    });

});

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
