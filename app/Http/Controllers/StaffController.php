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

        // Edit mode: ignore the current staff's user in the unique email check
        $ignoreUserId = Staff::find($request->input('_staff_id'))?->user_id;

        $rules = match ($step) {
            1 => [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'other_name' => ['nullable', 'string', 'max:255'],
                'email' => [
                    'required', 'email',
                    $ignoreUserId
                        ? Rule::unique('users', 'email')->ignore($ignoreUserId)
                        : Rule::unique('users', 'email'),
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
                    'required',
                    'string',
                    'max:50',
                    $ignoreUserId
                        ? Rule::unique('staffs', 'national_id_number')->ignore($request->input('_staff_id'))
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
            ->apply(
                Staff::query()->with(['user.roles', 'department']),
                $request->all()
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Staffs/Index', compact('staffs'));
    }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public function create()
    {
        return inertia('Staffs/Create', [
            'departments' => Department::select('id', 'name')->orderBy('name')->limit(10)->get(),
            'roles' => Role::select('id', 'name')->orderBy('name')->limit(10)->get(),
        ]);
    }

    // ----------------------------------------------------------------
    // STORE
    // ----------------------------------------------------------------

    public function store(StoreStaffRequest $request)
    {
        DB::transaction(function () use ($request) {

            $user = User::create([
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
                'password' => bcrypt($request->phone_number),
                'is_pwd' => $request->boolean('is_pwd'),
                'is_active' => true,
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
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
                'designation' => $request->designation,
                'staff_number' => $staffNumber,
                'national_id_number' => $request->national_id_number,
                'salary' => $request->salary,
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
            'staff' => $staff,
            'departments' => Department::select('id', 'name')->orderBy('name')->limit(10)->get(),
            'roles' => Role::select('id', 'name')->orderBy('name')->limit(10)->get(),
        ]);
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    public function update(UpdateStaffRequest $request, Staff $staff)
    {
        DB::transaction(function () use ($request, $staff) {

            $staff->user->update([
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
            ]);

            $staff->user->syncRoles([$request->role_name]);
            RbacCache::forgetForUser($staff->user);

            $staff->update([
                'department_id' => $request->department_id,
                'designation' => $request->designation,
                'staff_number' => $request->staff_number,
                'national_id_number' => $request->national_id_number,
                'salary' => $request->salary,
                'employment_type' => $request->employment_type,
                'hired_date' => $request->hired_date,
                'staff_status' => $request->staff_status,
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
        //
    }

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $departmentId = $request->integer('department_id') ?: null;
        $query = trim((string) $request->query('q', ''));

        $staffs = Staff::query()
            ->with('user:id,first_name,last_name,email')
            ->where('staff_status', 'active')
            ->when($departmentId, fn ($builder) => $builder->where('department_id', $departmentId))
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($searchQuery) use ($query) {
                    $searchQuery
                        ->where('staff_number', 'like', "%{$query}%")
                        ->orWhere('designation', 'like', "%{$query}%")
                        ->orWhereHas('user', function ($userQuery) use ($query) {
                            $userQuery
                                ->where('first_name', 'like', "%{$query}%")
                                ->orWhere('last_name', 'like', "%{$query}%")
                                ->orWhere('email', 'like', "%{$query}%");
                        });
                });
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get(['id', 'user_id', 'staff_number', 'designation'])
            ->map(fn (Staff $staff) => [
                'id' => (string) $staff->id,
                'name' => collect([
                    trim(($staff->user?->first_name ?? '').' '.($staff->user?->last_name ?? '')),
                    $staff->staff_number,
                    $staff->designation,
                ])->filter()->implode(' - '),
            ])
            ->values();

        return response()->json($staffs);
    }
}
