<?php

namespace App\Http\Controllers;

use App\Services\AuditService;
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

        $permission = Permission::create(['name' => $request->name]);

        AuditService::log([
            'module' => 'users_permissions',
            'action' => 'permission_created',
            'entity_type' => 'permission',
            'entity_id' => $permission->id,
            'entity_label' => $permission->name,
            'new_values' => [
                'name' => $permission->name,
            ],
        ]);
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

        $before = [
            'name' => $permission->name,
        ];

        $permission->update([
            'name' => $request->name,
        ]);

        AuditService::log([
            'module' => 'users_permissions',
            'action' => 'permission_modified',
            'entity_type' => 'permission',
            'entity_id' => $permission->id,
            'entity_label' => $permission->name,
            'old_values' => $before,
            'new_values' => [
                'name' => $permission->name,
            ],
            'high_risk' => true,
        ]);
        RbacCache::forgetAllUsers();

        return back()->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        AuditService::log([
            'module' => 'users_permissions',
            'action' => 'permission_deleted',
            'entity_type' => 'permission',
            'entity_id' => $permission->id,
            'entity_label' => $permission->name,
            'old_values' => [
                'name' => $permission->name,
            ],
            'high_risk' => true,
        ]);

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

        $beforePermissions = $role->permissions()->pluck('name')->values()->all();
        $role->syncPermissions($request->permissions ?? []);
        $role->load('permissions');

        AuditService::log([
            'module' => 'users_permissions',
            'action' => 'permission_modified',
            'entity_type' => 'role',
            'entity_id' => $role->id,
            'entity_label' => $role->name,
            'old_values' => [
                'permissions' => $beforePermissions,
            ],
            'new_values' => [
                'permissions' => $role->permissions->pluck('name')->values()->all(),
            ],
            'high_risk' => true,
        ]);
        RbacCache::forgetForRole($role);

        return back()->with('success', 'Role permissions updated');
    }
}
