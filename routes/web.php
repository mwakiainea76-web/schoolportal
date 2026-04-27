<?php

use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CertificationLevelController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumUnitController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ExamBodyController;
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

    Route::get('/exam-bodies', [ExamBodyController::class, 'index'])->name('exam-bodies.index');
    Route::post('/exam-bodies', [ExamBodyController::class, 'store'])->name('exam-bodies.store');
    Route::get('/exam-bodies/{exam_body}/edit', [ExamBodyController::class, 'edit'])
        ->name('exam-bodies.edit');
    Route::get('/exam-bodies/edit', [ExamBodyController::class, 'edit'])->name('exam-bodies.editpage');
    Route::put('/exam-bodies/{exam_body}', [ExamBodyController::class, 'update'])->name('exam-bodies.update');
    Route::delete('/exam-bodies/{exam_body}', [ExamBodyController::class, 'destroy'])->name('exam-bodies.destroy');
    Route::get('/exam-bodies/create', [ExamBodyController::class, 'create'])->name('exam-bodies.create');
    Route::get('/exam-bodies/search', [ExamBodyController::class, 'search'])
        ->name('exam-bodies.search');
    Route::get('/exam-bodies/reports', [ExamBodyController::class, 'showReports'])
        ->name('exam-bodies.reports');

    Route::get('/exam-bodies/certification-levels', [CertificationLevelController::class, 'index'])->name('certification-levels.index');
    Route::post('/exam-bodies/certification-levels', [CertificationLevelController::class, 'store'])->name('certification-levels.store');
    Route::get('/exam-bodies/certification-levels/{certification_level}/edit', [CertificationLevelController::class, 'edit'])
        ->name('certification-levels.edit');
    Route::put('/exam-bodies/certification-levels/{certification_level}', [CertificationLevelController::class, 'update'])->name('certification-levels.update');
    Route::delete('/exam-bodies/certification-levels/{certification_level}', [CertificationLevelController::class, 'destroy'])->name('certification-levels.destroy');
    Route::get('/exam-bodies/certification-levels/create', [CertificationLevelController::class, 'create'])->name('certification-levels.create');
    Route::get('/exam-bodies/certification-levels/search', [CertificationLevelController::class, 'search'])
        ->name('certification-levels.search');

    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::get('/departments/{department}/edit', [DepartmentController::class, 'edit'])->name('departments.edit');
    Route::get('/departments/edit', [DepartmentController::class, 'edit'])->name('departments.editpage');
    Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');
    Route::get('/departments/create', [DepartmentController::class, 'create'])->name('departments.create');
    Route::get('/departments/search', [DepartmentController::class, 'search'])
        ->name('departments.search');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::get('/courses/search', [CourseController::class, 'search'])
        ->name('courses.search');

    Route::get('/courses/curriculum', [CurriculumController::class, 'index'])->name('courses.curriculum.index');
    Route::post('/courses/curriculum', [CurriculumController::class, 'store'])->name('courses.curriculum.store');
    Route::get('/courses/curriculum/create', [CurriculumController::class, 'create'])->name('courses.curriculum.create');
    Route::get('/courses/curriculum/search', [CurriculumController::class, 'search'])
        ->name('courses/curriculum.search');
    Route::put('/courses/curriculum/{curriculum}', [CurriculumController::class, 'update'])->name('courses.curriculum.update');
    Route::delete('/courses/curriculum/{curriculum}', [CurriculumController::class, 'destroy'])->name('courses.curriculum.destroy');
    Route::get('/courses/curriculum/{curriculum}/edit', [CurriculumController::class, 'edit'])->name('courses.curriculum.edit');

    Route::get('/units', [UnitController::class, 'index'])->name('units.index');
    Route::post('/units', [UnitController::class, 'store'])->name('units.store');
    Route::get('/units/{unit?}/edit', [UnitController::class, 'edit'])->name('units.edit');
    Route::get('/units/edit', [UnitController::class, 'edit'])->name('units.editpage');
    Route::put('/units/{unit}', [UnitController::class, 'update'])->name('units.update');
    Route::delete('/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');
    Route::get('/units/create', [UnitController::class, 'create'])->name('units.create');
    Route::get('/units/search', [UnitController::class, 'search'])->name('units.search');

    Route::get('/units/curriculum', [CurriculumUnitController::class, 'index'])->name('units.curriculum.index');
    Route::post('/units/curriculum', [CurriculumUnitController::class, 'store'])->name('units.curriculum.store');
    Route::get('/units/curriculum/{curriculum_unit?}/edit', [CurriculumUnitController::class, 'edit'])->name('units.curriculum.edit');
    Route::get('/units/curriculum/edit', [CurriculumUnitController::class, 'edit'])->name('units.curriculum.editpage');
    Route::put('/units/curriculum/{curriculum_unit}', [CurriculumUnitController::class, 'update'])->name('units.curriculum.update');
    Route::delete('/units/currulum/{curriculum_unit}', [CurriculumUnitController::class, 'destroy'])->name('units.curriculum.destroy');
    Route::get('/units/curriculum/create', [CurriculumUnitController::class, 'create'])->name('units.curriculum.create');
    Route::get('/units/curriculum/search', [CurriculumUnitController::class, 'search'])->name('units.curriculum.search');

    Route::get('/academic/years', [AcademicYearController::class, 'index'])->name('academic.years.index');
    Route::get('/academic/years/create', [AcademicYearController::class, 'create'])->name('academic.years.create');
    Route::post('/academic/years', [AcademicYearController::class, 'store'])->name('academic.years.store');
    Route::get('/academic/years/{academic_year}/edit', [AcademicYearController::class, 'edit'])->name('academic.years.edit');
    Route::put('/academic/years/{academic_year}', [AcademicYearController::class, 'update'])->name('academic.years.update');
    Route::delete('/academic/years/{academic_year}', [AcademicYearController::class, 'destroy'])->name('academic.years.destroy');

    Route::get('/academic/sessions', [AcademicSessionController::class, 'index'])->name('academic.sessions.index');
    Route::get('/academic/sessions/create', [AcademicSessionController::class, 'create'])->name('academic.sessions.create');
    Route::post('/academic/sessions', [AcademicSessionController::class, 'store'])->name('academic.sessions.store');
    Route::get('/academic/sessions/{academic_session}/edit', [AcademicSessionController::class, 'edit'])->name('academic.sessions.edit');
    Route::put('/academic/sessions/{academic_session}', [AcademicSessionController::class, 'update'])->name('academic.sessions.update');
    Route::delete('/academic/sessions/{academic_session}', [AcademicSessionController::class, 'destroy'])->name('academic.sessions.destroy');

    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::get('/permissions/create', [PermissionController::class, 'create'])->name('permissions.create');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    Route::get('/roles/permissions', [PermissionController::class, 'roles'])->name('roles.permissions');
    Route::post('/roles/permissions/sync', [PermissionController::class, 'syncRolePermissions'])->name('roles.permissions.sync');
    Route::get('/permissions/search', [PermissionController::class, 'search'])->name('permissions.search');

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    Route::get('/roles/search', [RoleController::class, 'search'])->name('roles.search');
    Route::get('/roles/{role}/permissions', [RoleController::class, 'editpermission'])
        ->name('roles.permissions.edit');
    Route::post('/roles/assign-permissions', [RoleController::class, 'assignPermissions'])
        ->name('roles.assign.permissions');

    Route::get('/staffs', [StaffController::class, 'index'])->name('staffs.index');
    Route::get('/staffs/create', [StaffController::class, 'create'])->name('staffs.create');
    Route::post('/staffs', [StaffController::class, 'store'])->name('staffs.store');
    Route::get('/staffs/{staff}/edit', [StaffController::class, 'edit'])->name('staffs.edit');
    Route::put('/staffs/{staff}', [StaffController::class, 'update'])->name('staffs.update');
    Route::delete('/staffs/{staff}', [StaffController::class, 'destroy'])->name('staffs.destroy');
    Route::get('/staffs/search', [StaffController::class, 'search'])->name('staffs.search');
    Route::post('/staffs/validate/step', [StaffController::class, 'validateStep'])
        ->name('staffs.validateStep');

    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
    Route::get('/students/search', [StudentController::class, 'search'])->name('students.search');
    Route::post('/students/validate/step', [StudentController::class, 'validateStep'])
        ->name('students.validateStep');

    Route::get('/fees/templates', [FeeTemplateController::class, 'index'])->name('fees.templates.index');
    Route::get('/fees/templates/create', [FeeTemplateController::class, 'create'])->name('fees.templates.create');
    Route::post('/fees/templates', [FeeTemplateController::class, 'store'])->name('fees.templates.store');
    Route::get('/fees/templates/{template}/edit', [FeeTemplateController::class, 'edit'])->name('fees.templates.edit');
    Route::put('/fees/templates/{template}', [FeeTemplateController::class, 'update'])->name('fees.templates.update');
    Route::delete('/fees/templates/{template}', [FeeTemplateController::class, 'destroy'])->name('fees.templates.destroy');
    Route::get('/fees/templates/search', [FeeTemplateController::class, 'search'])->name('fees.templates.search');

    Route::get('/academic/schedules', function () {
        return Inertia::render('Academic/Schedules');
    })->name('academic.schedules');
    Route::get('/academic/exams', function () {
        return Inertia::render('Academic/Exams');
    })->name('academic.exams');

});

require __DIR__.'/auth.php';
