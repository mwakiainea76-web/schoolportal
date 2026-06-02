<?php

namespace App\Http\Controllers;

use App\Support\RbacCache;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    // =========================
    // PERMISSION CRUD
    // =========================

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

        $query = Permission::query();
        if (! empty($request->search)) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $allowedSorts = ['name', 'created_at'];
        $sort = in_array($request->sort, $allowedSorts, true)
            ? $request->sort
            : 'name';

        $direction = $request->direction === 'desc' ? 'desc' : 'asc';

        $query->orderBy($sort, $direction);

        return inertia('Roles/Index', [
            'roles' => $roles,
            'permissions' => $query
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

    public function create()
    {
        return inertia('Permissions/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->name]);
        RbacCache::forgetAllUsers();

        return back()->with('success', 'Permission created');
    }

    public function edit(Permission $permission)
    {
        return inertia('Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name,'.$permission->id,
        ]);

        $permission->update([
            'name' => $request->name,
        ]);
        RbacCache::forgetAllUsers();

        return back()->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        RbacCache::forgetAllUsers();

        return back()->with('success', 'Permission deleted');
    }

    // =========================
    // ROLE PERMISSIONS ONLY
    // =========================

    public function roles()
    {
        return inertia('Permissions/Roles', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->query('q');

        $permissions = Permission::query()
            ->select('id', 'name')
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%");
            })
            ->orderBy('name')
            ->get();

        return response()->json($permissions);
    }

    public function syncRolePermissions(Request $request)
    {
        $role = Role::findOrFail($request->role_id);

        $role->syncPermissions($request->permissions ?? []);
        RbacCache::forgetForRole($role);

        return back()->with('success', 'Role permissions updated');
    }
}
