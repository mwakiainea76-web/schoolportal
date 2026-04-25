<?php

namespace App\Http\Controllers;

use App\Filters\StaffFilter;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
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
                'salary' => ['nullable', 'numeric'],
                'employment_type' => ['required', 'string'],
                'staff_number' => ['required', 'string'],
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

            Staff::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'staff_number' => $staffNumber,
                'salary' => $request->salary,
                'employment_type' => $request->employment_type,
                'hired_date' => now(),
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

            $staff->update([
                'department_id' => $request->department_id,
                'staff_number' => $request->staff_number,
                'salary' => $request->salary,
                'employment_type' => $request->employment_type,
                'staff_status' => $request->staff_status,
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
}
