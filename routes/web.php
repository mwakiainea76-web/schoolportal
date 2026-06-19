<?php

use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\AcademicSessionEnrollmentController;
use App\Http\Controllers\AcademicTimetableController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminPasswordResetController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\CertificationLevelController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumMappingController;
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
use App\Http\Controllers\ReportingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SecurityMonitoringController;
use App\Http\Controllers\SchoolIdCardController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StaffLeaveRequestController;
use App\Http\Controllers\StaffPayslipController;
use App\Http\Controllers\StaffSalaryController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentCourseChangeController;
use App\Http\Controllers\StudentHostelBookingController;
use App\Http\Controllers\StudentMarkController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserMonitorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public & Root Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => redirect()->route('login'));

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Universal Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Student Specific Actions
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::post('/dashboard/register-session', [AcademicSessionEnrollmentController::class, 'registerCurrentStudent'])->name('dashboard.register-session');
        Route::post('/dashboard/register-units', [AcademicSessionEnrollmentController::class, 'registerCurrentStudentUnits'])->name('dashboard.register-units');
        Route::get('/course-units', [UnitController::class, 'studentIndex'])->name('course-units.index');
        Route::get('/registered-units', [UnitController::class, 'registeredUnitsIndex'])->name('registered-units.index');
        Route::get('/results', [StudentMarkController::class, 'studentResultsIndex'])->name('results.index');
        Route::get('/fee-statements', [InvoiceController::class, 'studentStatementsIndex'])->name('fee-statements.index');
        Route::get('/fee-statements/{invoice}', [InvoiceController::class, 'studentStatementShow'])->name('fee-statements.show');
        Route::get('/hostel-booking', [StudentHostelBookingController::class, 'index'])->name('hostel-booking.index');
        Route::post('/hostel-booking', [StudentHostelBookingController::class, 'store'])->name('hostel-booking.store');

        Route::prefix('complaints')->name('complaints.')->group(function () {
            Route::get('/', [ComplaintController::class, 'studentIndex'])->name('index');
            Route::get('/create', [ComplaintController::class, 'create'])->name('create');
            Route::post('/', [ComplaintController::class, 'store'])->name('store');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | User Profile & Global Tools
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    Route::get('/online-users', [OnlineUsersController::class, 'index'])->name('online-users.index');

    Route::get('/export/{resource}', [ExportController::class, 'export'])
         ->middleware('throttle:5,1')
         ->name('export.resource');

    /*
    |--------------------------------------------------------------------------
    | Staff & Admin Exclusive Routes (Non-Students)
    |--------------------------------------------------------------------------
    */
    Route::middleware('non_student')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | System Administration & Settings
        |--------------------------------------------------------------------------
        */
        Route::middleware('role:admin')->prefix('settings')->name('settings.')->group(function () {
            Route::prefix('performance')->name('performance.')->group(function () {
                Route::get('/', [PerformanceDashboardController::class, 'index'])->name('index');
                Route::patch('/errors/{appRequestMetric}/status', [PerformanceDashboardController::class, 'updateErrorStatus'])->name('errors.update-status');
                Route::patch('/endpoints/status', [PerformanceDashboardController::class, 'updateEndpointStatus'])->name('endpoints.update-status');
            });

            Route::prefix('audit-logs')->name('audit-logs.')->group(function () {
                Route::get('/', [AuditLogController::class, 'index'])->name('index');
                Route::get('/{auditLog}', [AuditLogController::class, 'show'])->name('show');
            });

            Route::get('/logs', [LogViewerController::class, 'index'])->name('logs.index');
            Route::post('/logs/clear', [LogViewerController::class, 'clear'])->name('logs.clear');
            Route::get('/user-monitor', [UserMonitorController::class, 'index'])->name('user-monitor.index');

            Route::prefix('security')->name('security.')->group(function () {
                Route::get('/', [SecurityMonitoringController::class, 'index'])->name('index');
                Route::post('/blocks', [SecurityMonitoringController::class, 'storeBlock'])->name('blocks.store');
                Route::put('/blocks/{securityBlock}/lift', [SecurityMonitoringController::class, 'liftBlock'])->name('blocks.lift');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Academic Structure (Exam Bodies, Departments, Courses)
        |--------------------------------------------------------------------------
        */
        Route::prefix('exam-bodies')->name('exam.bodies.')->group(function () {
            Route::get('/', [ExamBodyController::class, 'index'])->name('index');
            Route::get('/search', [ExamBodyController::class, 'search'])->name('search');
            Route::get('/create', [ExamBodyController::class, 'create'])->name('create');
            Route::post('/', [ExamBodyController::class, 'store'])->name('store');
            Route::get('/{exam_body}/edit', [ExamBodyController::class, 'edit'])->name('edit');
            Route::put('/{exam_body}', [ExamBodyController::class, 'update'])->name('update');
            Route::delete('/{exam_body}', [ExamBodyController::class, 'destroy'])->name('destroy');
            Route::get('/reports', [ExamBodyController::class, 'showReports'])->name('reports');
        });

        Route::prefix('exam-bodies/certification-levels')->name('certification-levels.')->group(function () {
            Route::get('/', [CertificationLevelController::class, 'index'])->name('index');
            Route::get('/search', [CertificationLevelController::class, 'search'])->name('search');
            Route::get('/create', [CertificationLevelController::class, 'create'])->name('create');
            Route::post('/', [CertificationLevelController::class, 'store'])->name('store');
            Route::get('/{certification_level}/edit', [CertificationLevelController::class, 'edit'])->name('edit');
            Route::put('/{certification_level}', [CertificationLevelController::class, 'update'])->name('update');
            Route::delete('/{certification_level}', [CertificationLevelController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('departments')->name('departments.')->group(function () {
            Route::get('/', [DepartmentController::class, 'index'])->name('index');
            Route::get('/search', [DepartmentController::class, 'search'])->name('search');
            Route::get('/create', [DepartmentController::class, 'create'])->name('create');
            Route::post('/', [DepartmentController::class, 'store'])->name('store');
            Route::get('/{department}/edit', [DepartmentController::class, 'edit'])->name('edit');
            Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
            Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('courses')->name('courses.')->group(function () {
            Route::get('/', [CourseController::class, 'index'])->name('index');
            Route::middleware('role:hod')->get('/department-courses', [CourseController::class, 'hodIndex'])->name('hod.index');
            Route::get('/create', [CourseController::class, 'create'])->name('create');
            Route::post('/', [CourseController::class, 'store'])->name('store');
            Route::get('/enrollments', [CourseEnrollmentController::class, 'index'])->name('enrollments.index');
            Route::middleware('role:hod')->get('/department-enrolments', [CourseEnrollmentController::class, 'hodIndex'])->name('enrollments.hod.index');
            Route::get('/search', [CourseController::class, 'search'])->name('search');
            Route::middleware('role:hod')->get('/department-courses/search', [CourseController::class, 'hodSearch'])->name('hod.search');
            Route::get('/edit', [CourseController::class, 'editIndex'])->name('edit.index');
            Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
            Route::put('/{course}', [CourseController::class, 'update'])->name('update');
            Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');

            Route::prefix('curriculums')->name('curriculum-mappings.')->group(function () {
                Route::get('/', [CurriculumMappingController::class, 'index'])->name('index');
                Route::get('/search', [CurriculumMappingController::class, 'search'])->name('search');
                Route::get('/create', [CurriculumMappingController::class, 'create'])->name('create');
                Route::post('/', [CurriculumMappingController::class, 'store'])->name('store');
                Route::get('/{curriculumMapping}/edit', [CurriculumMappingController::class, 'edit'])->name('edit');
                Route::put('/{curriculumMapping}', [CurriculumMappingController::class, 'update'])->name('update');
                Route::patch('/{curriculumMapping}/activate', [CurriculumMappingController::class, 'activate'])->name('activate');
                Route::patch('/{curriculumMapping}/deactivate', [CurriculumMappingController::class, 'deactivate'])->name('deactivate');
                Route::delete('/{curriculumMapping}', [CurriculumMappingController::class, 'destroy'])->name('destroy');
            });
        });

        Route::prefix('units')->name('units.')->group(function () {
            Route::get('/', [UnitController::class, 'index'])->name('index');
            Route::get('/search', [UnitController::class, 'search'])->name('search');
            Route::get('/create', [UnitController::class, 'create'])->name('create');
            Route::post('/', [UnitController::class, 'store'])->name('store');
            Route::get('/{unit}/edit', [UnitController::class, 'edit'])->name('edit');
            Route::put('/{unit}', [UnitController::class, 'update'])->name('update');
            Route::delete('/{unit}', [UnitController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('curriculums')->name('curriculums.')->group(function () {
            Route::get('/', [CurriculumController::class, 'index'])->name('index');
            Route::get('/edit', [CurriculumController::class, 'editIndex'])->name('edit.index');
            Route::get('/create', [CurriculumController::class, 'create'])->name('create');
            Route::post('/', [CurriculumController::class, 'store'])->name('store');
            Route::get('/search', [CurriculumController::class, 'search'])->name('search');
            Route::patch('/{curriculum}/disable', [CurriculumController::class, 'disable'])->name('disable');
            Route::patch('/{curriculum}/reactivate', [CurriculumController::class, 'reactivate'])->name('reactivate');
            Route::get('/{curriculum}/edit', [CurriculumController::class, 'edit'])->name('edit');
            Route::put('/{curriculum}', [CurriculumController::class, 'update'])->name('update');
            Route::delete('/{curriculum}', [CurriculumController::class, 'destroy'])->name('destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | Academic Operations (Calendar, Timetables, Marks)
        |--------------------------------------------------------------------------
        */
        Route::prefix('academic')->name('academic.')->group(function () {
            Route::prefix('years')->name('years.')->group(function () {
                Route::get('/', [AcademicYearController::class, 'index'])->name('index');
                Route::get('/search', [AcademicYearController::class, 'search'])->name('search');
                Route::get('/create', [AcademicYearController::class, 'create'])->name('create');
                Route::post('/', [AcademicYearController::class, 'store'])->name('store');
                Route::get('/{academic_year}/edit', [AcademicYearController::class, 'edit'])->name('edit');
                Route::put('/{academic_year}', [AcademicYearController::class, 'update'])->name('update');
                Route::patch('/{academic_year}/status', [AcademicYearController::class, 'updateStatus'])->name('status');
                Route::delete('/{academic_year}', [AcademicYearController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('sessions')->name('sessions.')->group(function () {
                Route::get('/', [AcademicSessionController::class, 'index'])->name('index');
                Route::get('/create', [AcademicSessionController::class, 'create'])->name('create');
                Route::post('/', [AcademicSessionController::class, 'store'])->name('store');
                Route::get('/search', [AcademicSessionController::class, 'search'])->name('search');
                Route::get('/{academic_session}/edit', [AcademicSessionController::class, 'edit'])->name('edit');
                Route::put('/{academic_session}', [AcademicSessionController::class, 'update'])->name('update');
                Route::patch('/{academic_session}/status', [AcademicSessionController::class, 'updateStatus'])->name('status');
                Route::delete('/{academic_session}', [AcademicSessionController::class, 'destroy'])->name('destroy');

                Route::prefix('enrollments')->name('enrollments.')->group(function () {
                    Route::get('/', [AcademicSessionEnrollmentController::class, 'index'])->name('index');
                    Route::get('/{academicSessionEnrollment}/edit', [AcademicSessionEnrollmentController::class, 'edit'])->name('edit');
                    Route::patch('/{academicSessionEnrollment}', [AcademicSessionEnrollmentController::class, 'update'])->name('update');
                    Route::delete('/{academicSessionEnrollment}', [AcademicSessionEnrollmentController::class, 'destroy'])->name('destroy');

                    Route::middleware('role:admin')->group(function () {
                        Route::get('/create', [AcademicSessionEnrollmentController::class, 'create'])->name('create');
                        Route::post('/', [AcademicSessionEnrollmentController::class, 'store'])->name('store');
                    });
                });
            });

            Route::prefix('timetables')->name('timetables.')->group(function () {
                Route::get('/', [AcademicTimetableController::class, 'index'])->name('index');
                Route::get('/courses/search', [AcademicTimetableController::class, 'searchCourseMappings'])->name('courses.search');
                Route::middleware('role:hod|admin')->group(function () {
                    Route::get('/create', [AcademicTimetableController::class, 'createHod'])->name('create');
                    Route::get('/{timetable}/edit', [AcademicTimetableController::class, 'edit'])->name('edit');
                    Route::put('/{timetable}', [AcademicTimetableController::class, 'update'])->name('update');
                    Route::delete('/{timetable}', [AcademicTimetableController::class, 'destroy'])->name('destroy');
                    Route::get('/hod/courses/search', [AcademicTimetableController::class, 'searchHodCourses'])->name('hod.courses.search');
                    Route::post('/hod', [AcademicTimetableController::class, 'storeHod'])->name('hod.store');
                });
            });

            Route::middleware('role:admin|hod|trainer')->prefix('marks')->name('marks.')->group(function () {
                Route::get('/', [StudentMarkController::class, 'index'])->name('index');
                Route::get('/add', [StudentMarkController::class, 'addIndex'])->name('add.index');
                Route::post('/add', [StudentMarkController::class, 'store'])->name('add.store');
                Route::get('/view', [StudentMarkController::class, 'viewIndex'])->name('view.index');
                Route::get('/export', [StudentMarkController::class, 'export'])->middleware('throttle:4,1')->name('export');
                Route::get('/marksheet', [StudentMarkController::class, 'marksheetIndex'])->name('marksheet.index');
                Route::get('/marksheet/export', [StudentMarkController::class, 'marksheetExport'])->middleware('throttle:4,1')->name('marksheet.export');

                Route::middleware('role:admin|hod')->group(function () {
                    Route::get('/publish', [StudentMarkController::class, 'publishIndex'])->name('publish.index');
                    Route::post('/publish', [StudentMarkController::class, 'publishAssessment'])->name('publish.assessment');
                    Route::post('/{studentMark}/publish-toggle', [StudentMarkController::class, 'togglePublish'])->name('publish.toggle');
                });
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

        /*
        |--------------------------------------------------------------------------
        | Hostels
        |--------------------------------------------------------------------------
        */
        Route::middleware('role:admin')->group(function () {
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
        });

        /*
        |--------------------------------------------------------------------------
        | Finance & Fees
        |--------------------------------------------------------------------------
        */
        Route::prefix('fees')->name('fees.')->group(function () {
            Route::prefix('plans')->name('plans.')->group(function () {
                Route::get('/', [FeePlanController::class, 'index'])->name('index');
                Route::get('/create', [FeePlanController::class, 'create'])->name('create');
                Route::post('/', [FeePlanController::class, 'store'])->name('store');
                Route::get('/search', [FeePlanController::class, 'search'])->name('search');
                Route::get('/{feePlan}/edit', [FeePlanController::class, 'edit'])->name('edit');
                Route::get('/{feePlan}/items', [FeePlanController::class, 'items'])->name('items');
                Route::put('/{feePlan}', [FeePlanController::class, 'update'])->name('update');
                Route::delete('/{feePlan}', [FeePlanController::class, 'destroy'])->name('destroy');
                Route::post('/{feePlan}/approval', [FeePlanController::class, 'approval'])->name('approval');

                Route::prefix('items')->name('items.')->group(function () {
                    Route::get('/', [FeePlanItemController::class, 'index'])->name('index');
                    Route::get('/create', [FeePlanItemController::class, 'create'])->name('create');
                    Route::post('/', [FeePlanItemController::class, 'store'])->name('store');
                    Route::get('/search', [FeePlanItemController::class, 'search'])->name('search');
                    Route::get('/{feePlanItem}/edit', [FeePlanItemController::class, 'edit'])->name('edit');
                    Route::put('/{feePlanItem}', [FeePlanItemController::class, 'update'])->name('update');
                    Route::delete('/{feePlanItem}', [FeePlanItemController::class, 'destroy'])->name('destroy');
                    Route::post('/bulk-destroy', [FeePlanItemController::class, 'bulkDestroy'])->name('bulk-destroy');
                });
            });

            Route::prefix('assignments')->name('assignments.')->group(function () {
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

                Route::prefix('bulk')->name('bulk.')->group(function () {
                    Route::get('/', [FeeAssignmentController::class, 'bulk'])->name('index');
                    Route::get('/certification-levels', [FeeAssignmentController::class, 'bulkCertificationLevels'])->name('certification-levels');
                    Route::get('/curriculums', [FeeAssignmentController::class, 'bulkCurriculums'])->name('curriculums');
                    Route::post('/assign', [FeeAssignmentController::class, 'bulkAssign'])->name('assign');
                    Route::post('/replace', [FeeAssignmentController::class, 'bulkReplace'])->name('replace');
                    Route::post('/preview', [FeeAssignmentController::class, 'bulkPreview'])->name('preview');
                });
            });
        });

        Route::middleware('role:admin|bursar')->prefix('billing')->name('billing.')->group(function () {
            Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
            Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
            Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
            Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
            Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
            Route::post('/invoices/{invoice}/approval', [InvoiceController::class, 'approval'])->name('invoices.approval');

            Route::get('/ledger', [LedgerTransactionController::class, 'index'])->name('ledger.index');

            Route::prefix('manual-operations')->name('manual.')->group(function () {
                Route::get('/', [InvoiceController::class, 'manualOperations'])->name('index');
                Route::get('/additional-invoice', [InvoiceController::class, 'manualInvoiceCreate'])->name('invoices.create');
                Route::get('/record-payment', [InvoiceController::class, 'manualPaymentCreate'])->name('payments.create');
                Route::get('/post-penalty', [InvoiceController::class, 'manualPenaltyCreate'])->name('penalties.create');
                Route::get('/apply-adjustment', [InvoiceController::class, 'manualAdjustmentCreate'])->name('adjustments.create');
                Route::post('/invoices', [InvoiceController::class, 'storeManualInvoice'])->name('invoices.store');
                Route::post('/payments', [InvoiceController::class, 'storePayment'])->name('payments.store');
                Route::post('/penalties', [InvoiceController::class, 'storePenalty'])->name('penalties.store');
                Route::post('/adjustments', [InvoiceController::class, 'storeAdjustment'])->name('adjustments.store');
            });

            Route::prefix('bulk')->name('bulk.')->group(function () {
                Route::get('/operations', [InvoiceController::class, 'bulkOperations'])->name('operations');
                Route::post('/invoices', [InvoiceController::class, 'bulkGenerate'])->name('invoices');
                Route::post('/discounts', [InvoiceController::class, 'bulkApplyDiscount'])->name('discounts');
                Route::post('/generate-from-plans', [InvoiceController::class, 'store'])->name('generate.from.plans');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Human Resource
        |--------------------------------------------------------------------------
        */
        Route::prefix('hr')->name('hr.')->group(function () {
            Route::prefix('leave-requests')->name('leave-requests.')->group(function () {
                Route::get('/', [StaffLeaveRequestController::class, 'index'])->name('index');
                Route::get('/create', [StaffLeaveRequestController::class, 'create'])->name('create');
                Route::post('/', [StaffLeaveRequestController::class, 'store'])->name('store');
            });

            Route::middleware('role:admin')->prefix('salaries')->name('salaries.')->group(function () {
                Route::get('/', [StaffSalaryController::class, 'index'])->name('index');
                Route::patch('/', [StaffSalaryController::class, 'update'])->name('update');
                Route::post('/loan-reductions', [StaffSalaryController::class, 'storeLoanReduction'])->name('loan-reductions.store');
            });

            Route::middleware('role:admin')->prefix('payslips')->name('payslips.')->group(function () {
                Route::get('/', [StaffPayslipController::class, 'index'])->name('index');
            });

            Route::middleware('role:admin')->prefix('id-cards')->name('id-cards.')->group(function () {
                Route::get('/', [SchoolIdCardController::class, 'index'])->name('index');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Staff Management
        |--------------------------------------------------------------------------
        */
        Route::prefix('staffs')->name('staffs.')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('index');
            Route::middleware('role:hod')->get('/department-staff', [StaffController::class, 'departmentIndex'])->name('department.index');
            Route::get('/search', [StaffController::class, 'search'])->name('search');
            Route::get('/create', [StaffController::class, 'create'])->name('create');
            Route::post('/', [StaffController::class, 'store'])->name('store');
            Route::get('/{staff}/edit', [StaffController::class, 'edit'])->name('edit');
            Route::put('/{staff}', [StaffController::class, 'update'])->name('update');
            Route::delete('/{staff}', [StaffController::class, 'destroy'])->name('destroy');
            Route::post('/validate-step', [StaffController::class, 'validateStep'])->name('validateStep');

            Route::middleware('role:admin')->group(function () {
                Route::get('/reset-password', [AdminPasswordResetController::class, 'createStaff'])->name('password-reset.create');
                Route::post('/reset-password', [AdminPasswordResetController::class, 'storeStaff'])->name('password-reset.store');
                Route::get('/status', [StaffController::class, 'createStatusPage'])->name('status.create');
                Route::post('/status', [StaffController::class, 'updateStatusByStaffNumber'])->name('status.store');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Student Management
        |--------------------------------------------------------------------------
        */
        Route::prefix('students')->name('students.')->group(function () {
            Route::get('/', fn () => redirect()->route('courses.enrollments.index'))->name('index');
            Route::get('/create', [StudentController::class, 'create'])->name('create');
            Route::post('/', [StudentController::class, 'store'])->name('store');
            Route::get('/search', [StudentController::class, 'search'])->name('search');
            Route::get('/{student}/edit', [StudentController::class, 'edit'])->name('edit');
            Route::put('/{student}', [StudentController::class, 'update'])->name('update');
            Route::delete('/{student}', [StudentController::class, 'destroy'])->name('destroy');
            Route::post('/validate-step', [StudentController::class, 'validateStep'])->name('validateStep');

            Route::get('/exam-bodies/{examBody}/curriculums', [StudentController::class, 'examBodyCurriculums'])->name('exam-body-curriculums');
            Route::get('/courses/{course}/curricula', [StudentController::class, 'curriculumMappings'])->name('course-curricula');
            Route::get('/cycles/{curriculum}/courses', [StudentController::class, 'cycleCourses'])->name('cycle-courses');

            Route::middleware('role:admin')->group(function () {
                Route::get('/reset-password', [AdminPasswordResetController::class, 'createStudent'])->name('password-reset.create');
                Route::post('/reset-password', [AdminPasswordResetController::class, 'storeStudent'])->name('password-reset.store');
                Route::get('/session-enrollment', [AcademicSessionEnrollmentController::class, 'create'])->name('session-enrollment.create');
                Route::post('/session-enrollment', [AcademicSessionEnrollmentController::class, 'store'])->name('session-enrollment.store');
                Route::get('/session-enrollment-status', [AcademicSessionEnrollmentController::class, 'createStatusPage'])->name('session-enrollment-status.create');
                Route::post('/session-enrollment-status', [AcademicSessionEnrollmentController::class, 'updateStatusByAdmission'])->name('session-enrollment-status.store');
                Route::get('/course-change', [StudentCourseChangeController::class, 'index'])->name('course-change.index');
                Route::post('/course-change', [StudentCourseChangeController::class, 'store'])->name('course-change.store');
                Route::get('/{student}/admission-letter', [StudentController::class, 'admissionLetter'])->name('admission-letter');
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Complaints Management
        |--------------------------------------------------------------------------
        */
        Route::middleware('role:admin')->prefix('complaints')->name('complaints.admin.')->group(function () {
            Route::get('/', [ComplaintController::class, 'adminIndex'])->name('index');
            Route::get('/{complaint}', [ComplaintController::class, 'show'])->name('show');
            Route::post('/{complaint}/escalate', [ComplaintController::class, 'escalate'])->name('escalate');
            Route::post('/{complaint}/resolve', [ComplaintController::class, 'resolve'])->name('resolve');
        });

        /*
        |--------------------------------------------------------------------------
        | Roles & Permissions
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
        | Reports & Analytics
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

    }); // End non_student group

}); // End auth group

/*
|--------------------------------------------------------------------------
| Authentication Routes (Breeze/Fortify style)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
