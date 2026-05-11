<?php

use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CertificationLevelController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseCurriculumController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumUnitController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ExamBodyController;
use App\Http\Controllers\FeeAssignmentController;
use App\Http\Controllers\FeePlanController;
use App\Http\Controllers\FeePlanItemController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportingController;
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

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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
    | COURSES
    |--------------------------------------------------------------------------
    */
    Route::prefix('courses')->name('courses.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::get('/create', [CourseController::class, 'create'])->name('create');
        Route::post('/', [CourseController::class, 'store'])->name('store');

        Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
        Route::put('/{course}', [CourseController::class, 'update'])->name('update');
        Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');

        Route::get('/search', [CourseController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | CURRICULUM
    |--------------------------------------------------------------------------
    */
    Route::prefix('curriculum')->name('curriculum.')->group(function () {
        Route::get('/', [CurriculumController::class, 'index'])->name('index');
        Route::get('/create', [CurriculumController::class, 'create'])->name('create');
        Route::post('/', [CurriculumController::class, 'store'])->name('store');

        Route::get('/{curriculum}/edit', [CurriculumController::class, 'edit'])->name('edit');
        Route::put('/{curriculum}', [CurriculumController::class, 'update'])->name('update');
        Route::delete('/{curriculum}', [CurriculumController::class, 'destroy'])->name('destroy');

        Route::get('/search', [CurriculumController::class, 'search'])->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | COURSE CURRICULUM
    |--------------------------------------------------------------------------
    */
    Route::prefix('courses/curriculum')->name('courses.curriculum.')->group(function () {
        Route::get('/', [CourseCurriculumController::class, 'index'])->name('index');
        Route::get('/create', [CourseCurriculumController::class, 'create'])->name('create');
        Route::post('/', [CourseCurriculumController::class, 'store'])->name('store');

        Route::get('/search', [CourseCurriculumController::class, 'search'])->name('search');
        Route::get('/course-search', [CourseCurriculumController::class, 'courseSearch'])->name('course-search');

        Route::get('/{curriculum}/edit', [CourseCurriculumController::class, 'edit'])->name('edit');
        Route::put('/{curriculum}', [CourseCurriculumController::class, 'update'])->name('update');
        Route::delete('/{curriculum}', [CourseCurriculumController::class, 'destroy'])->name('destroy');
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

    Route::prefix('units/curriculum')->name('units.curriculum.')->group(function () {
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
    Route::prefix('billing')->name('billing.')->group(function () {

        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');

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
