<?php

namespace App\Http\Controllers;

use App\Filters\DepartmentFilter;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    protected $service;

    public function __construct(DepartmentService $service)
    {
        $this->service = $service;
    }

    public function index(DepartmentFilter $filter)
    {
        $departments = Department::query()
            ->with('hod.user:id,first_name,last_name,email')
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Department $department) => [
                'id' => $department->id,
                'code' => $department->code,
                'name' => $department->name,
                'description' => $department->description,
                'hod_staff_id' => $department->hod_staff_id,
                'hod' => $department->hod
                    ? [
                        'id' => $department->hod->id,
                        'name' => $this->staffLabel($department->hod),
                    ]
                    : null,
                'created_at' => $department->created_at,
            ]);

        return inertia('Departments/Index', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        return inertia('Departments/Create');
    }

    public function store(StoreDepartmentRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('departments.create')
            ->with('success', 'Department created successfully');
    }

    public function edit(Department $department)
    {
        $department->load('hod.user:id,first_name,last_name,email');

        return inertia('Departments/Edit', [
            'department' => $department,
            'selectedHod' => $department->hod
                ? [
                    'id' => $department->hod->id,
                    'name' => $this->staffLabel($department->hod),
                ]
                : null,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        $this->service->update($department, $request->validated());

        return redirect()
            ->route('departments.edit', ['department' => $department])
            ->with('success', 'Department updated successfully');
    }

    public function destroy(Department $department)
    {
        $result = $this->service->delete($department);

        if (! $result['status']) {
            return redirect()
                ->route('departments.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('departments.index')
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        return $this->service->search($request->q);
    }

    protected function staffLabel($staff): string
    {
        return collect([
            trim(($staff->user?->first_name ?? '').' '.($staff->user?->last_name ?? '')),
            $staff->staff_number,
            $staff->designation,
        ])->filter()->implode(' - ');
    }
}
