<?php

namespace App\Http\Controllers;

use App\Filters\StaffFilter;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use App\Support\RbacCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    // ----------------------------------------------------------------
    // STEP VALIDATION (shared by create & edit)
    // ----------------------------------------------------------------

    public function validateStep(Request $request): \Illuminate\Http\JsonResponse
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        $step = (int) $request->input('step');

        $staff = $request->filled('_staff_id')
            ? Staff::find($request->input('_staff_id'))
            : null;

        $rules = $staff
            ? UpdateStaffRequest::stepRules($staff)
            : StoreStaffRequest::stepRules();

        $request->validate($rules[$step] ?? []);

        return response()->json(['ok' => true]);
    }

    // ----------------------------------------------------------------
    // STAFF NUMBER GENERATION
    // ----------------------------------------------------------------

    private function generateStaffNumber(int $departmentId): string
    {
        $dept = Department::findOrFail($departmentId);
        $deptCode = strtoupper(Str::limit($dept->name, 3, ''));
        $year = now()->year;

        $last = Staff::where('department_id', $departmentId)
            ->whereYear('created_at', $year)
            ->lockForUpdate()
            ->latest('id')
            ->value('staff_number');

        $next = $last ? ((int) substr($last, -4)) + 1 : 1;
        $sequence = str_pad($next, 4, '0', STR_PAD_LEFT);

        return "STAFF/{$deptCode}/{$year}/{$sequence}";
    }

    // ----------------------------------------------------------------
    // INDEX
    // ----------------------------------------------------------------

    public function index(Request $request, StaffFilter $filter)
    {
        $filters = $request->all();
        $hodDepartmentId = $this->shouldScopeToHodDepartment($request)
            ? $this->currentDepartmentId($request)
            : null;

        if ($hodDepartmentId) {
            $filters['department_id'] = $hodDepartmentId;
        }

        $staffs = $filter
            ->apply(Staff::query(), $filters)
            ->select([
                'staffs.id',
                'staffs.user_id',
                'staffs.department_id',
                'staffs.staff_number',
                'staffs.first_name',
                'staffs.last_name',
                'staffs.email',
                'staffs.designation',
                'staffs.staff_status',
                'staffs.created_at',
            ])
            ->latest('staffs.id')
            ->paginate(10)
            ->withQueryString();

        // load after pagination — fully isolated from the filter query
        $staffs->getCollection()->load([
            'department:id,name',
            'user:id',
            'user.roles:id,name',
        ]);

        $staffs->through(fn ($staff) => [
            'id' => $staff->id,
            'staff_number' => $staff->staff_number,
            'first_name' => $staff->first_name,
            'last_name' => $staff->last_name,
            'email' => $staff->email,
            'designation' => $staff->designation,
            'staff_status' => $staff->staff_status,
            'department' => $staff->department ? ['id' => $staff->department->id, 'name' => $staff->department->name] : null,
            'roles' => $staff->user?->roles->pluck('name'),
        ]);

        return inertia('Staffs/Index', [
            'staffs' => $staffs,
            'can_manage_staffs' => ! $this->shouldScopeToHodDepartment($request),
        ]);
    }  // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public function create()
    {
        abort_if($this->shouldScopeToHodDepartment(request()), 403);

        return inertia('Staffs/Create', [
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'roles' => Role::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    // ----------------------------------------------------------------
    // STORE
    // ----------------------------------------------------------------

    public function store(StoreStaffRequest $request)
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        DB::transaction(function () use ($request) {

            $user = User::create([
                'email' => $request->email,
                'password' => bcrypt($request->phone_number),
                'is_active' => true,
            ]);

            $user->assignRole($request->role_name);
            RbacCache::forgetForUser($user);

            // Generate a unique staff number (retry up to 5 times on collision)
            $staffNumber = null;
            for ($i = 0; $i < 5; $i++) {
                $candidate = $this->generateStaffNumber($request->department_id);
                if (! Staff::where('staff_number', $candidate)->exists()) {
                    $staffNumber = $candidate;
                    break;
                }
            }

            throw_if(! $staffNumber, \RuntimeException::class, 'Failed to generate a unique staff number.');

            $staff = Staff::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'other_name' => $request->other_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'date_of_birth' => $request->date_of_birth,
                'county' => $request->county,
                'address' => $request->address,
                'gender' => $request->gender,
                'religion' => $request->religion,
                'is_pwd' => $request->boolean('is_pwd'),
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
                'designation' => $request->designation,
                'staff_number' => $staffNumber,
                'national_id_number' => $request->national_id_number,
                'salary' => $request->salary ?? 0,
                'employment_type' => $request->employment_type,
                'hired_date' => $request->hired_date,
                'staff_status' => $request->staff_status ?: 'active',
                'highest_qualification' => $request->highest_qualification,
                'specialization' => $request->specialization,
                'kra_pin' => $request->kra_pin,
                'nhif_number' => $request->nhif_number,
                'nssf_number' => $request->nssf_number,
            ]);

            $user->update([
                'login_id' => trim($staff->staff_number),
            ]);

            $user->nextOfKin()->create([
                'first_name' => $request->kin_first_name,
                'last_name' => $request->kin_last_name,
                'relationship' => $request->kin_relationship,
                'phone_number' => $request->kin_phone,
                'alternate_phone_number' => $request->kin_alt_phone,
                'email' => $request->kin_email,
            ]);
        });

        return redirect()->route('staffs.index')->with('success', 'Staff created successfully.');
    }

    // ----------------------------------------------------------------
    // EDIT
    // ----------------------------------------------------------------

    public function edit(Staff $staff)
    {
        abort_if($this->shouldScopeToHodDepartment(request()), 403);

        $staff->load(['user.roles', 'user.nextofkin', 'department']);

        return inertia('Staffs/Edit', [
            'staff' => [
                'id' => $staff->id,
                'staff_number' => $staff->staff_number,
                'first_name' => $staff->first_name,
                'last_name' => $staff->last_name,
                'other_name' => $staff->other_name,
                'email' => $staff->email,
                'phone_number' => $staff->phone_number,
                'gender' => $staff->gender,
                'date_of_birth' => $staff->date_of_birth,
                'county' => $staff->county,
                'address' => $staff->address,
                'religion' => $staff->religion,
                'is_pwd' => $staff->is_pwd,
                'disability_type' => $staff->disability_type,
                'medical_condition' => $staff->medical_condition,
                'designation' => $staff->designation,
                'national_id_number' => $staff->national_id_number,
                'salary' => $staff->salary,
                'employment_type' => $staff->employment_type,
                'hired_date' => $staff->hired_date,
                'staff_status' => $staff->staff_status,
                'highest_qualification' => $staff->highest_qualification,
                'specialization' => $staff->specialization,
                'kra_pin' => $staff->kra_pin,
                'nhif_number' => $staff->nhif_number,
                'nssf_number' => $staff->nssf_number,
                'department_id' => $staff->department_id,
                'department' => $staff->department?->name,
                'role_name' => $staff->user?->roles->first()?->name,
                'next_of_kin' => $staff->user?->nextofkin->map(fn ($kin) => [
                    'first_name' => $kin->first_name,
                    'last_name' => $kin->last_name,
                    'relationship' => $kin->relationship,
                    'phone_number' => $kin->phone_number,
                    'alternate_phone_number' => $kin->alternate_phone_number,
                    'email' => $kin->email,
                ]),
            ],
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'roles' => Role::select('id', 'name')->orderBy('name')->get(),
        ]);

    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    public function update(UpdateStaffRequest $request, Staff $staff)
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        DB::transaction(function () use ($request, $staff) {

            $staff->user->update([
                'email' => $request->email,
                'is_active' => $request->boolean('is_active'),
            ]);

            $staff->user->syncRoles([$request->role_name]);
            RbacCache::forgetForUser($staff->user);

            $staff->update([
                'department_id' => $request->department_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'other_name' => $request->other_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'county' => $request->county,
                'address' => $request->address,
                'religion' => $request->religion,
                'is_pwd' => $request->boolean('is_pwd'),
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
                'designation' => $request->designation,
                'national_id_number' => $request->national_id_number,
                'salary' => $request->salary ?? 0,
                'employment_type' => $request->employment_type,
                'hired_date' => $request->hired_date,
                'staff_status' => $request->staff_status ?: 'active',
                'highest_qualification' => $request->highest_qualification,
                'specialization' => $request->specialization,
                'kra_pin' => $request->kra_pin,
                'nhif_number' => $request->nhif_number,
                'nssf_number' => $request->nssf_number,
            ]);

            $staff->user->update([
                'login_id' => trim((string) $staff->staff_number),
            ]);

            $staff->user->nextOfKin()->updateOrCreate(
                ['user_id' => $staff->user_id],
                [
                    'first_name' => $request->kin_first_name,
                    'last_name' => $request->kin_last_name,
                    'relationship' => $request->kin_relationship,
                    'phone_number' => $request->kin_phone,
                    'alternate_phone_number' => $request->kin_alt_phone,
                    'email' => $request->kin_email,
                ]
            );
        });

        return redirect()->route('staffs.index')->with('success', 'Staff updated successfully.');
    }

    // ----------------------------------------------------------------
    // DESTROY
    // ----------------------------------------------------------------

    public function destroy(Staff $staff)
    {
        abort_if($this->shouldScopeToHodDepartment(request()), 403);

        $staff->delete();

        return redirect()->route('staffs.index')->with('success', 'Staff deleted successfully.');
    }

    // ----------------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------------

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 10), 25);
        $departmentId = $this->shouldScopeToHodDepartment($request)
            ? $this->currentDepartmentId($request)
            : ($request->integer('department_id') ?: null);
        $query = trim((string) $request->query('q', ''));

        $staffs = Staff::query()
            ->where('staff_status', 'active')
            ->when($departmentId, fn ($builder) => $builder->where('department_id', $departmentId))
            ->when($query !== '', function ($builder) use ($query) {
                $term = '%'.Str::lower($query).'%';

                $builder->where(function ($q) use ($term) {
                    $q->whereRaw('LOWER(staff_number) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(designation) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(first_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(last_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term]);
                });
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get(['id', 'staff_number', 'designation', 'first_name', 'last_name', 'other_name', 'email'])
            ->map(fn (Staff $staff) => [
                'id' => $staff->staff_number,
                'staff_id' => $staff->id,
                'staff_number' => $staff->staff_number,
                'name' => collect([
                    $staff->full_name,
                    $staff->staff_number,
                    $staff->designation,
                ])->filter()->implode(' - '),
                'email' => $staff->email,
            ])
            ->values();

        return response()->json($staffs);
    }

    protected function shouldScopeToHodDepartment(Request $request): bool
    {
        return (bool) (
            $request->user()?->hasRole('hod')
            && ! $request->user()?->hasRole('admin')
            && $this->currentDepartmentId($request)
        );
    }

    protected function currentDepartmentId(Request $request): ?int
    {
        return $request->user()?->staff?->department_id
            ? (int) $request->user()->staff->department_id
            : null;
    }
}
