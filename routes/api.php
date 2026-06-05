<?php

use App\Http\Controllers\Api\FeeManagement\FeeAssignmentController;
use App\Http\Controllers\Api\FeeManagement\FeeComponentController;
use App\Http\Controllers\Api\FeeManagement\FeePlanController;
use App\Http\Controllers\Api\AcademicLookupController;
use App\Http\Controllers\Api\PublicCourseController;
use App\Http\Controllers\Api\StaffLookupController;
use App\Http\Controllers\ReportingController;
use Illuminate\Support\Facades\Route;

Route::get('/public/courses', [PublicCourseController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::prefix('fee-plans')->group(function () {
        Route::post('/', [FeePlanController::class, 'store']);
        Route::get('/', [FeePlanController::class, 'index']);
        Route::get('/{id}', [FeePlanController::class, 'show']);
        Route::patch('/{id}', [FeePlanController::class, 'update']);
        Route::patch('/{id}/publish', [FeePlanController::class, 'publish']);
        Route::patch('/{id}/archive', [FeePlanController::class, 'archive']);
        Route::delete('/{id}', [FeePlanController::class, 'destroy']);

        Route::post('/{id}/components', [FeeComponentController::class, 'store']);
        Route::patch('/{id}/components/{cid}', [FeeComponentController::class, 'update']);
        Route::delete('/{id}/components/{cid}', [FeeComponentController::class, 'destroy']);

        Route::post('/{id}/assign', [FeeAssignmentController::class, 'assign']);
        Route::post('/{id}/bulk-assign', [FeeAssignmentController::class, 'bulkAssign']);
        Route::get('/{id}/assignments', [FeePlanController::class, 'assignments']);
        Route::get('/{id}/reuse-preview', [FeePlanController::class, 'reusePreview']);
    });

    Route::get('/curriculums/{id}/assignments', [FeeAssignmentController::class, 'curriculumAssignments']);
    Route::get('/curriculums/{id}/assignments', [FeeAssignmentController::class, 'curriculumAssignments']);
    Route::patch('/assignments/{id}/cancel', [FeeAssignmentController::class, 'cancel']);
    Route::get('/academic-years/{id}/sessions/{sid}/unassigned-curricula', [FeeAssignmentController::class, 'unassignedCurricula']);
    Route::get('/academic-years/{id}/sessions/{sid}/unassigned-curriculums', [FeeAssignmentController::class, 'unassignedCurricula']);
});

Route::middleware(['web', 'auth', 'non_student'])
    ->prefix('staffs')
    ->name('api.staffs.')
    ->group(function () {
        Route::get('/hod-search', [StaffLookupController::class, 'hods'])->name('hod-search');
    });

Route::middleware(['web', 'auth', 'non_student'])
    ->prefix('lookups')
    ->name('api.lookups.')
    ->group(function () {
        Route::get('/departments', [AcademicLookupController::class, 'departments'])->name('departments');
        Route::get('/courses', [AcademicLookupController::class, 'courses'])->name('courses');
        Route::get('/curriculums', [AcademicLookupController::class, 'curriculums'])->name('curriculums');
        Route::get('/curriculum-mappings', [AcademicLookupController::class, 'curriculumMappings'])->name('curriculum-mappings');
        Route::get('/units', [AcademicLookupController::class, 'units'])->name('units');
        Route::get('/academic-years', [AcademicLookupController::class, 'academicYears'])->name('academic-years');
        Route::get('/academic-sessions', [AcademicLookupController::class, 'academicSessions'])->name('academic-sessions');
        Route::get('/exam-bodies', [AcademicLookupController::class, 'examBodies'])->name('exam-bodies');
        Route::get('/certification-levels', [AcademicLookupController::class, 'certificationLevels'])->name('certification-levels');
        Route::get('/staffs', [AcademicLookupController::class, 'staffs'])->name('staffs');
    });

Route::middleware(['web', 'auth', 'non_student'])
    ->prefix('reports')
    ->name('reports.api.')
    ->group(function () {
        Route::get('/academic-summary', [ReportingController::class, 'academicSummary'])->name('academic-summary');
        Route::get('/admissions-summary', [ReportingController::class, 'admissionsSummary'])->name('admissions-summary');
        Route::get('/data-quality-summary', [ReportingController::class, 'dataQualitySummary'])->name('data-quality-summary');
        Route::get('/executive-summary', [ReportingController::class, 'executiveSummary'])->name('executive-summary');
        Route::get('/finance-summary', [ReportingController::class, 'financeSummary'])->name('finance-summary');
        Route::get('/hostel-summary', [ReportingController::class, 'hostelSummary'])->name('hostel-summary');
        Route::get('/snapshot-trends', [ReportingController::class, 'snapshotTrends'])->name('snapshot-trends');
        Route::get('/outstanding-balance', [ReportingController::class, 'outstandingBalance'])->name('outstanding');
        Route::get('/overdue-department', [ReportingController::class, 'overdueByDepartment'])->name('overdue');
        Route::get('/collection-performance', [ReportingController::class, 'collectionPerformance'])->name('collection');
        Route::get('/fee-plan-usage', [ReportingController::class, 'feePlanUsage'])->name('usage');
    });
