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
use App\Http\Controllers\HostelAllocationController;
use App\Http\Controllers\HostelController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LectureRoomController;
use App\Http\Controllers\LedgerTransactionController;
use App\Http\Controllers\LogViewerController;
use App\Http\Controllers\OnlineUsersController;
use App\Http\Controllers\PerformanceDashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumMappingController;
use App\Http\Controllers\CurriculumUnitController;
use App\Http\Controllers\ReportingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SecurityMonitoringController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentCourseChangeController;
use App\Http\Controllers\StudentMarkController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserMonitorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => redirect()->route('login'));

Route::get('/dashboard', [DashboardController::class, 'redirect'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [DashboardController::class, 'studentDashboard'])
        ->name('student.dashboard');
    Route::post('/student/dashboard/register-session', [AcademicSessionEnrollmentController::class, 'registerCurrentStudent'])
        ->name('student.dashboard.register-session');
    Route::post('/student/dashboard/register-units', [AcademicSessionEnrollmentController::class, 'registerCurrentStudentUnits'])
        ->name('student.dashboard.register-units');
    Route::get('/student/course-units', [CurriculumUnitController::class, 'studentIndex'])
        ->name('student.course-units.index');
    Route::get('/student/results', [StudentMarkController::class, 'studentResultsIndex'])
        ->name('student.results.index');
    Route::get('/student/fee-statements', [InvoiceController::class, 'studentStatementsIndex'])
        ->name('student.fee-statements.index');
    Route::get('/student/fee-statements/{invoice}', [InvoiceController::class, 'studentStatementShow'])
        ->name('student.fee-statements.show');
});

Route::get('/admin/dashboard', [DashboardController::class, 'staffDashboard'])
    ->middleware(['auth', 'verified', 'non_student'])
    ->name('admin.dashboard');

Route::get('/staff/dashboard', [DashboardController::class, 'staffDashboard'])
    ->middleware(['auth', 'verified', 'non_student'])
    ->name('staff.dashboard');

Route::get('/trainer/dashboard', [DashboardController::class, 'trainerDashboard'])
    ->middleware(['auth', 'verified', 'role:trainer'])
    ->name('trainer.dashboard');

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
    Route::get('/online-users', [OnlineUsersController::class, 'index'])->name('online-users.index');
});

Route::middleware(['auth', 'non_student'])->group(function () {
    Route::middleware('role:admin')
        ->get('/settings/performance', [PerformanceDashboardController::class, 'index'])
        ->name('settings.performance.index');

    Route::middleware('role:admin')
        ->patch('/settings/performance/errors/{appRequestMetric}/status', [PerformanceDashboardController::class, 'updateErrorStatus'])
        ->name('settings.performance.errors.update-status');

    Route::middleware('role:admin')
        ->patch('/settings/performance/endpoints/status', [PerformanceDashboardController::class, 'updateEndpointStatus'])
        ->name('settings.performance.endpoints.update-status');

    Route::middleware('role:admin')
        ->get('/settings/logs', [LogViewerController::class, 'index'])
        ->name('settings.logs.index');

    Route::middleware('role:admin')
        ->post('/settings/logs/clear', [LogViewerController::class, 'clear'])
        ->name('settings.logs.clear');

    Route::middleware('role:admin')
        ->get('/settings/user-monitor', [UserMonitorController::class, 'index'])
        ->name('settings.user-monitor.index');

    Route::middleware('role:admin')
        ->get('/settings/security', [SecurityMonitoringController::class, 'index'])
        ->name('settings.security.index');

    Route::middleware('role:admin')
        ->post('/settings/security/blocks', [SecurityMonitoringController::class, 'storeBlock'])
        ->name('settings.security.blocks.store');

    Route::middleware('role:admin')
        ->put('/settings/security/blocks/{securityBlock}/lift', [SecurityMonitoringController::class, 'liftBlock'])
        ->name('settings.security.blocks.lift');

    /*
    |--------------------------------------------------------------------------
    | EXAM BODIES
    |--------------------------------------------------------------------------
    */
    Route::prefix('exam-bodies')->name('exam.bodies.')->group(function () {
        Route::get('/', [ExamBodyController::class, 'index'])->name('index');
        Route::get('/create', [ExamBodyController::class, 'create'])->name('create');
        Route::post('/', [ExamBodyController::class, 'store'])->name('store');
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

    });

    /*
    |--------------------------------------------------------------------------
    | COURSE MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::group([], function () {
        Route::prefix('courses')->name('courses.')->group(function () {
            Route::get('/', [CourseController::class, 'index'])->name('index');
            Route::get('/create', [CourseController::class, 'create'])->name('create');
            Route::post('/', [CourseController::class, 'store'])->name('store');
            Route::get('/enrollments', [CourseEnrollmentController::class, 'index'])->name('enrollments.index');
            Route::get('/search', [CourseController::class, 'search'])->name('search');

            Route::prefix('curriculums')->name('curriculum-mappings.')->group(function () {
                Route::get('/', [CurriculumMappingController::class, 'index'])->name('index');
                Route::get('/create', [CurriculumMappingController::class, 'create'])->name('create');
                Route::post('/', [CurriculumMappingController::class, 'store'])->name('store');

                Route::get('/{curriculumMapping}/edit', [CurriculumMappingController::class, 'edit'])->name('edit');
                Route::put('/{curriculumMapping}', [CurriculumMappingController::class, 'update'])->name('update');
                Route::patch('/{curriculumMapping}/activate', [CurriculumMappingController::class, 'activate'])->name('activate');
                Route::patch('/{curriculumMapping}/deactivate', [CurriculumMappingController::class, 'deactivate'])->name('deactivate');
                Route::delete('/{curriculumMapping}', [CurriculumMappingController::class, 'destroy'])->name('destroy');
            });

            Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
            Route::put('/{course}', [CourseController::class, 'update'])->name('update');
            Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('curriculums')->name('curriculums.')->group(function () {
            Route::get('/', [CurriculumController::class, 'index'])->name('index');
            Route::get('/create', [CurriculumController::class, 'create'])->name('create');
            Route::post('/', [CurriculumController::class, 'store'])->name('store');
            Route::get('/search', [CurriculumController::class, 'search'])->name('search');

            Route::patch('/{curriculum}/disable', [CurriculumController::class, 'disable'])->name('disable');
            Route::patch('/{curriculum}/reactivate', [CurriculumController::class, 'reactivate'])->name('reactivate');
            Route::get('/{curriculum}/edit', [CurriculumController::class, 'edit'])->name('edit');
            Route::put('/{curriculum}', [CurriculumController::class, 'update'])->name('update');
            Route::delete('/{curriculum}', [CurriculumController::class, 'destroy'])->name('destroy');
        });
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

    Route::prefix('units/curriculums')->name('units.curriculum-units.')->group(function () {
        Route::get('/', [CurriculumUnitController::class, 'index'])->name('index');
        Route::get('/create', [CurriculumUnitController::class, 'create'])->name('create');
        Route::post('/', [CurriculumUnitController::class, 'store'])->name('store');

        Route::get('/edit', [CurriculumUnitController::class, 'edit'])->name('editpage');
        Route::get('/{curriculum_unit?}/edit', [CurriculumUnitController::class, 'edit'])->name('edit');

        Route::put('/{curriculum_unit}', [CurriculumUnitController::class, 'update'])->name('update');
        Route::delete('/{curriculum_unit}', [CurriculumUnitController::class, 'destroy'])->name('destroy');

        Route::get('/search', [CurriculumUnitController::class, 'search'])->name('search');
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
        Route::get('/courses/search', [AcademicTimetableController::class, 'searchCourseMappings'])->name('courses.search');
        Route::get('/create', [AcademicTimetableController::class, 'create'])->name('create');
        Route::post('/', [AcademicTimetableController::class, 'store'])->name('store');
        Route::middleware('role:hod')->get('/create/hod', [AcademicTimetableController::class, 'createHod'])->name('hod.create');
        Route::middleware('role:hod')->get('/hod/courses/search', [AcademicTimetableController::class, 'searchHodCourses'])->name('hod.courses.search');
        Route::middleware('role:hod')->post('/hod', [AcademicTimetableController::class, 'storeHod'])->name('hod.store');
        Route::get('/{timetable}/edit', [AcademicTimetableController::class, 'edit'])->name('edit');
        Route::put('/{timetable}', [AcademicTimetableController::class, 'update'])->name('update');
        Route::delete('/{timetable}', [AcademicTimetableController::class, 'destroy'])->name('destroy');
    });

    Route::middleware('role:admin|hod|trainer')->prefix('academic/marks')->name('academic.marks.')->group(function () {
        Route::get('/', [StudentMarkController::class, 'index'])->name('index');
        Route::post('/', [StudentMarkController::class, 'store'])->name('store');
        Route::get('/marksheet', [StudentMarkController::class, 'marksheetIndex'])
            ->name('marksheet.index');
        Route::middleware('role:admin|hod')->group(function () {
            Route::get('/publish', [StudentMarkController::class, 'publishIndex'])
                ->name('publish.index');
            Route::post('/publish', [StudentMarkController::class, 'publishAssessment'])
                ->name('publish.assessment');
            Route::post('/{studentMark}/publish-toggle', [StudentMarkController::class, 'togglePublish'])
                ->name('publish.toggle');
        });
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
        Route::get('/search', [FeePlanController::class, 'search'])->name('search');

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
        Route::get('/bulk/curriculums', [FeeAssignmentController::class, 'bulkCurriculums'])->name('bulk.curriculums');
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
    Route::middleware('role:admin')->prefix('billing')->name('billing.')->group(function () {

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
        Route::get('/exam-bodies/{examBody}/curriculums', [StudentController::class, 'examBodyCurriculums'])->name('exam-body-curriculums');
        Route::get('/courses/{course}/curricula', [StudentController::class, 'curriculumMappings'])->name('course-curricula');
        Route::get('/cycles/{curriculum}/courses', [StudentController::class, 'cycleCourses'])->name('cycle-courses');
        Route::middleware('role:admin')->group(function () {
            Route::get('/course-change', [StudentCourseChangeController::class, 'index'])->name('course-change.index');
            Route::post('/course-change', [StudentCourseChangeController::class, 'store'])->name('course-change.store');
        });
        Route::middleware('role:admin')->get('/{student}/admission-letter', [StudentController::class, 'admissionLetter'])->name('admission-letter');

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
        Route::get('/executive', [ReportingController::class, 'executive'])->name('executive');
        Route::get('/finance', [ReportingController::class, 'finance'])->name('finance');
        Route::get('/academic', [ReportingController::class, 'academic'])->name('academic');
        Route::get('/admissions', [ReportingController::class, 'admissions'])->name('admissions');
        Route::get('/hostel', [ReportingController::class, 'hostel'])->name('hostel');
        Route::get('/data-quality', [ReportingController::class, 'dataQuality'])->name('data-quality');
        Route::get('/snapshots', [ReportingController::class, 'snapshots'])->name('snapshots');
    });

});

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
