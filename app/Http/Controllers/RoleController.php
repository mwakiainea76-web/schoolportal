<?php

namespace App\Http\Controllers;

use App\Support\RbacCache;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * LIST ROLES
     */
    public function index(Request $request)
    {
        $roles = Role::withCount('permissions')
            ->orderBy('name')
            ->get();
        $selectedRoleId = $request->integer('role_id') ?: null;
        $selectedPermissions = $selectedRoleId
            ? Role::find($selectedRoleId)?->permissions()
                ->select('permissions.id', 'permissions.name')
                ->orderBy('permissions.name')
                ->get() ?? collect()
            : collect();

        $permissionsQuery = Permission::query();
        if (! empty($request->search)) {
            $permissionsQuery->where('name', 'like', '%'.$request->search.'%');
        }

        $allowedSorts = ['name', 'created_at'];
        $sort = in_array($request->sort, $allowedSorts, true)
            ? $request->sort
            : 'name';
        $direction = $request->direction === 'desc' ? 'desc' : 'asc';

        $permissionsQuery->orderBy($sort, $direction);

        return inertia('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissionsQuery
                ->paginate(10)
                ->withQueryString(),
            'selectedRoleId' => $selectedRoleId,
            'selectedPermissions' => $selectedPermissions,
            'filters' => [
                'search' => $request->search,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    /**
     * SHOW CREATE FORM
     */
    public function create()
    {
        return inertia('Roles/Create', [
            'permissions' => Permission::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * STORE ROLE
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create([
            'name' => $request->name,
        ]);

        // assign permissions (Spatie expects array of names or ids)
        $role->syncPermissions($request->permissions ?? []);
        RbacCache::forgetForRole($role);

        return redirect()
            ->route('roles.index', ['role_id' => $role->id])
            ->with('success', 'Role created successfully');
    }

    /**
     * SHOW EDIT FORM
     */
    public function edit(Role $role)
    {
        return inertia('Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * UPDATE ROLE
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,'.$role->id,
            'permissions' => 'array',
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions ?? []);
        }
        RbacCache::forgetForRole($role);

        return redirect()
            ->route('roles.index', ['role_id' => $role->id])
            ->with('success', 'Role updated successfully');
    }

    /**
     * DELETE ROLE
     */
    public function destroy(Role $role)
    {
        RbacCache::forgetForRole($role);
        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role deleted successfully');
    }

    public function search(Request $request)
    {
        $q = $request->query('q');

        $roles = Role::query()
            ->select('id', 'name')
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', '%'.$q.'%');
            })
            ->orderBy('name')
            ->limit(10)
            ->get();

        return response()->json($roles);
    }

    public function editpermission(Role $role)
    {
        return inertia('Roles/EditPermissions', [
            'role' => $role,
            'selected_permissions' => $role->permissions()
                ->select('id', 'name')
                ->get(),
            'permissions_data' => Permission::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function assignPermissions(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'array',
        ]);

        $role = Role::findOrFail($request->role_id);

        $role->syncPermissions($request->permissions ?? []);
        RbacCache::forgetForRole($role);

        return back()->with('success', 'Permissions assigned successfully');
    }
}
