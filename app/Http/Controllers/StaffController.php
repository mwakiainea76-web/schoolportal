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
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    // ----------------------------------------------------------------
    // STEP VALIDATION (shared by create & edit)
    // ----------------------------------------------------------------

    public function validateStep(Request $request): \Illuminate\Http\JsonResponse
    {
        $step = (int) $request->input('step');

        $staffId = $request->input('_staff_id');
        $ignoreStaffId = Staff::find($staffId)?->id;

        $rules = match ($step) {
            1 => [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'other_name' => ['nullable', 'string', 'max:255'],
                'email' => [
                    'required', 'email', 'max:255',
                    $ignoreStaffId
                        ? Rule::unique('staffs', 'email')->ignore($ignoreStaffId)
                        : Rule::unique('staffs', 'email'),
                ],
                'phone_number' => ['required', 'string', 'max:15'],
                'gender' => ['required', 'string'],
                'date_of_birth' => ['required', 'date'],
                'county' => ['required', 'string', 'max:70'],
                'address' => ['required', 'string', 'min:3'],
                'religion' => ['required', 'string', 'min:3'],
                'is_pwd' => ['boolean'],
                'disability_type' => ['nullable', 'string', 'max:255'],
                'medical_condition' => ['nullable', 'string', 'max:255'],
            ],
            2 => [
                'department_id' => ['required', 'exists:departments,id'],
                'role_name' => ['required', 'exists:roles,name'],
                'designation' => ['required', 'string', 'max:255'],
                'national_id_number' => [
                    'required', 'string', 'max:50',
                    $ignoreStaffId
                        ? Rule::unique('staffs', 'national_id_number')->ignore($ignoreStaffId)
                        : Rule::unique('staffs', 'national_id_number'),
                ],
                'salary' => ['nullable', 'numeric'],
                'employment_type' => ['required', 'string'],
                'hired_date' => ['required', 'date'],
                'staff_status' => ['nullable', 'in:active,suspended,onleave,exited'],
                'highest_qualification' => ['required', 'string', 'max:255'],
                'specialization' => ['nullable', 'string', 'max:255'],
                'kra_pin' => ['nullable', 'string', 'max:50'],
                'nhif_number' => ['nullable', 'string', 'max:50'],
                'nssf_number' => ['nullable', 'string', 'max:50'],
            ],
            3 => [
                'kin_first_name' => ['required', 'string', 'max:255'],
                'kin_last_name' => ['required', 'string', 'max:255'],
                'kin_relationship' => ['required', 'string', 'max:255'],
                'kin_phone' => ['required', 'string', 'max:15'],
                'kin_alt_phone' => ['nullable', 'string', 'max:15'],
                'kin_email' => ['nullable', 'email', 'max:255'],
            ],
            default => [],
        };

        $request->validate($rules);

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
        $staffs = $filter
            ->apply(Staff::query(), $request->all())
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

        return inertia('Staffs/Index', compact('staffs'));
    }  // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public function create()
    {
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
        DB::transaction(function () use ($request) {

            $user = User::create([
                'email' => $request->email,
                'password' => bcrypt($request->phone_number),
                'is_active' => true,
                'role' => $request->role_name ?? 'trainer', // Store role for quick access (optional)
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
        DB::transaction(function () use ($request, $staff) {

            $staff->user->update([
                'email' => $request->email,
                'is_active' => $request->boolean('is_active'),
                'role' => $request->role_name, // Update role field if used
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
                    $staff->user->syncRoles([$request->role_name]);
RbacCache::forgetForUser($staff->user);
        });

        return redirect()->route('staffs.index')->with('success', 'Staff updated successfully.');
    }

    // ----------------------------------------------------------------
    // DESTROY
    // ----------------------------------------------------------------

    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()->route('staffs.index')->with('success', 'Staff deleted successfully.');
    }

    // ----------------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------------

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $departmentId = $request->integer('department_id') ?: null;
        $query = trim((string) $request->query('q', ''));

        $staffs = Staff::query()
            ->where('staff_status', 'active')
            ->when($departmentId, fn ($builder) => $builder->where('department_id', $departmentId))
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($q) use ($query) {
                    $q->where('staff_number', 'like', "%{$query}%")
                        ->orWhere('designation', 'like', "%{$query}%")
                        ->orWhere('first_name', 'like', "%{$query}%")
                        ->orWhere('last_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                });
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get(['id', 'staff_number', 'designation', 'first_name', 'last_name', 'email'])
            ->values();

        return response()->json($staffs);
    }
}
