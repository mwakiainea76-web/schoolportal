<?php

use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CertificationLevelController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumUnitController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ExamBodyController;
use App\Http\Controllers\FeeComponentController;
use App\Http\Controllers\FeeModelController;
use App\Http\Controllers\FeeTemplateController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         // 'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('login');
});
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('/exam-bodies')->name('exam.bodies.')->group(function () {
        Route::get('/', [ExamBodyController::class, 'index'])->name('index');
        Route::post('/', [ExamBodyController::class, 'store'])->name('store');
        Route::get('/{exam_body}/edit', [ExamBodyController::class, 'edit'])->name('edit');
        Route::get('/edit', [ExamBodyController::class, 'edit'])->name('editpage');
        Route::put('/{exam_body}', [ExamBodyController::class, 'update'])->name('update');
        Route::delete('/{exam_body}', [ExamBodyController::class, 'destroy'])->name('destroy');
        Route::get('/create', [ExamBodyController::class, 'create'])->name('create');
        Route::get('/search', [ExamBodyController::class, 'search'])->name('search');
        Route::get('/reports', [ExamBodyController::class, 'showReports'])
            ->name('reports');
    });

    Route::prefix('/exam-bodies/certification-levels')->name('certification-levels.')->group(function () {
        Route::get('/', [CertificationLevelController::class, 'index'])->name('index');
        Route::post('/', [CertificationLevelController::class, 'store'])->name('store');
        Route::get('/{certification_level}/edit', [CertificationLevelController::class, 'edit'])->name('edit');
        Route::put('/{certification_level}', [CertificationLevelController::class, 'update'])->name('update');
        Route::delete('/{certification_level}', [CertificationLevelController::class, 'destroy'])->name('destroy');
        Route::get('/create', [CertificationLevelController::class, 'create'])->name('create');
        Route::get('/search', [CertificationLevelController::class, 'search'])->name('/search');
    });

    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
        Route::get('/{department}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
        Route::get('/create', [DepartmentController::class, 'create'])->name('create');
        Route::get('/search', [DepartmentController::class, 'search'])->name('search');
    });

    Route::prefix('courses')->name('courses.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::post('/', [CourseController::class, 'store'])->name('store');
        Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
        Route::put('/{course}', [CourseController::class, 'update'])->name('update');
        Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
        Route::get('/create', [CourseController::class, 'create'])->name('create');
        Route::get('/search', [CourseController::class, 'search'])->name('search');
    });

    Route::prefix('/courses/curriculum')->name('courses.curriculum.')->group(function () {
        Route::get('/', [CurriculumController::class, 'index'])->name('index');
        Route::post('/', [CurriculumController::class, 'store'])->name('store');
        Route::get('/create', [CurriculumController::class, 'create'])->name('create');
        Route::get('/search', [CurriculumController::class, 'search'])->name('search');
        Route::put('/{curriculum}', [CurriculumController::class, 'update'])->name('update');
        Route::delete('/{curriculum}', [CurriculumController::class, 'destroy'])->name('destroy');
        Route::get('/{curriculum}/edit', [CurriculumController::class, 'edit'])->name('edit');

    });

    Route::prefix('/units)')->name('units.')->group(function () {
        Route::get('/', [UnitController::class, 'index'])->name('index');
        Route::post('/', [UnitController::class, 'store'])->name('store');
        Route::get('/{unit?}/edit', [UnitController::class, 'edit'])->name('edit');
        Route::get('/edit', [UnitController::class, 'edit'])->name('editpage');
        Route::put('/{unit}', [UnitController::class, 'update'])->name('update');
        Route::delete('/{unit}', [UnitController::class, 'destroy'])->name('destroy');
        Route::get('/create', [UnitController::class, 'create'])->name('create');
        Route::get('/search', [UnitController::class, 'search'])->name('search');
    });
    Route::prefix('/units/curriculum')->name('units.curriculum.')->group(function () {
        Route::get('/', [CurriculumUnitController::class, 'index'])->name('index');
        Route::post('/', [CurriculumUnitController::class, 'store'])->name('store');
        Route::get('/{curriculum_unit?}/edit', [CurriculumUnitController::class, 'edit'])->name('edit');
        Route::get('/edit', [CurriculumUnitController::class, 'edit'])->name('editpage');
        Route::put('/{curriculum_unit}', [CurriculumUnitController::class, 'update'])->name('update');
        Route::delete('/{curriculum_unit}', [CurriculumUnitController::class, 'destroy'])->name('destroy');
        Route::get('/create', [CurriculumUnitController::class, 'create'])->name('create');
        Route::get('/search', [CurriculumUnitController::class, 'search'])->name('search');
    });

    Route::prefix('/academic/years')->name('academic.years.')->group(function () {
        Route::get('/', [AcademicYearController::class, 'index'])->name('index');
        Route::get('/create', [AcademicYearController::class, 'create'])->name('create');
        Route::post('/', [AcademicYearController::class, 'store'])->name('store');
        Route::get('/{academic_year}/edit', [AcademicYearController::class, 'edit'])->name('edit');
        Route::put('/{academic_year}', [AcademicYearController::class, 'update'])->name('update');
        Route::delete('/{academic_year}', [AcademicYearController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('/academic/sessions')->name('academic.sessions.')->group(function () {
        Route::get('/', [AcademicSessionController::class, 'index'])->name('index');
        Route::get('/create', [AcademicSessionController::class, 'create'])->name('create');
        Route::post('/', [AcademicSessionController::class, 'store'])->name('store');
        Route::get('/{academic_session}/edit', [AcademicSessionController::class, 'edit'])->name('edit');
        Route::put('/{academic_session}', [AcademicSessionController::class, 'update'])->name('update');
        Route::delete('/{academic_session}', [AcademicSessionController::class, 'destroy'])->name('destroy');
        Route::get('/search', [AcademicSessionController::class, 'search'])->name('search');
    });

    Route::prefix('/permissions')->name('permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');
        Route::get('/create', [PermissionController::class, 'create'])->name('create');
        Route::post('/', [PermissionController::class, 'store'])->name('store');
        Route::get('/{permission}/edit', [PermissionController::class, 'edit'])->name('edit');
        Route::put('/{permission}', [PermissionController::class, 'update'])->name('update');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
        Route::get('/roles', [PermissionController::class, 'roles'])->name('roles.permissions');
        Route::post('/roles/sync', [PermissionController::class, 'syncRolePermissions'])->name('roles.permissions.sync');
        Route::get('/search', [PermissionController::class, 'search'])->name('search');
    });

    Route::prefix('/roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/create', [RoleController::class, 'create'])->name('create');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
        Route::get('/search', [RoleController::class, 'search'])->name('search');
        Route::get('/{role}/permissions', [RoleController::class, 'editpermission'])->name('permissions.edit');
        Route::post('/assign-permissions', [RoleController::class, 'assignPermissions'])->name('assign.permissions');
    });

    Route::prefix('/staffs')->name('staffs.')->group(function () {
        Route::get('/', [StaffController::class, 'index'])->name('index');
        Route::get('/create', [StaffController::class, 'create'])->name('create');
        Route::post('/', [StaffController::class, 'store'])->name('store');
        Route::get('/{staff}/edit', [StaffController::class, 'edit'])->name('edit');
        Route::put('/{staff}', [StaffController::class, 'update'])->name('update');
        Route::delete('/{staff}', [StaffController::class, 'destroy'])->name('destroy');
        Route::get('/search', [StaffController::class, 'search'])->name('search');
        Route::post('/validate/step', [StaffController::class, 'validateStep'])->name('validateStep');
    });

    Route::prefix('/students')->name('students.')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/create', [StudentController::class, 'create'])->name('create');
        Route::post('/', [StudentController::class, 'store'])->name('store');
        Route::get('/{student}/edit', [StudentController::class, 'edit'])->name('edit');
        Route::put('/{student}', [StudentController::class, 'update'])->name('update');
        Route::delete('/{student}', [StudentController::class, 'destroy'])->name('destroy');
        Route::get('/search', [StudentController::class, 'search'])->name('search');
        Route::post('/validate/step', [StudentController::class, 'validateStep'])->name('validateStep');
    });

    Route::prefix('/fees/templates')->name('fees.templates.')->group(function () {
        Route::get('/', [FeeTemplateController::class, 'index'])->name('index');
        Route::get('/create', [FeeTemplateController::class, 'create'])->name('create');
        Route::post('/', [FeeTemplateController::class, 'store'])->name('store');
        Route::get('/{template}/edit', [FeeTemplateController::class, 'edit'])->name('edit');
        Route::put('/{template}', [FeeTemplateController::class, 'update'])->name('update');
        Route::delete('/{template}', [FeeTemplateController::class, 'destroy'])->name('destroy');
        Route::get('/search', [FeeTemplateController::class, 'search'])->name('search');

    });

    Route::prefix('fees/components')->name('fees.components.')->group(function () {
        Route::get('/', [FeeComponentController::class, 'index'])->name('index');
        Route::get('/create', [FeeComponentController::class, 'create'])->name('create');
        Route::post('/', [FeeComponentController::class, 'store'])->name('store');
        Route::get('/{feeComponent}/edit', [FeeComponentController::class, 'edit'])->name('edit');
        Route::put('/{feeComponent}', [FeeComponentController::class, 'update'])->name('update');
        Route::delete('/{feeComponent}', [FeeComponentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('fees/models')->name('fees.models.')->group(function () {
        Route::get('/', [FeeModelController::class, 'index'])->name('index');
        Route::get('/create', [FeeModelController::class, 'create'])->name('create');
        Route::post('/', [FeeModelController::class, 'store'])->name('store');
        Route::get('/{feeModel}/edit', [FeeModelController::class, 'edit'])->name('edit');
        Route::put('/{feeModel}', [FeeModelController::class, 'update'])->name('update');
        Route::delete('/{feeModel}', [FeeModelController::class, 'destroy'])->name('destroy');
    });

    Route::get('/academic/schedules', function () {
        return Inertia::render('Academic/Schedules');
    })->name('academic.schedules');
    Route::get('/academic/exams', function () {
        return Inertia::render('Academic/Exams');
    })->name('academic.exams');

});

require __DIR__.'/auth.php';
