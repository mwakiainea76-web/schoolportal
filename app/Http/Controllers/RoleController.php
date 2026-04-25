<?php

namespace App\Http\Controllers;

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
        $query = Role::with('permissions')->orderBy('name');

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return inertia('Roles/Index', [
            'roles' => $query->paginate(10),
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

        return redirect()
            ->route('roles.index')
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

        // FULL SYNC (remove old + assign new)
        $role->syncPermissions($request->permissions ?? []);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role updated successfully');
    }

    /**
     * DELETE ROLE
     */
    public function destroy(Role $role)
    {
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

        $role->syncPermissions($request->permissions);

        return back()->with('success', 'Permissions assigned successfully');
    }
}
