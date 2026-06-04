import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SearchSelect from "@/Components/SearchSelect";
import Table from "@/Components/Table/Table";
import Tbody from "@/Components/Table/Tbody";
import Tdata from "@/Components/Table/Tdata";
import THdata from "@/Components/Table/THdata";
import Thead from "@/Components/Table/Thead";
import Trow from "@/Components/Table/Trow";
import TextInput from "@/Components/TextInput";
import formatDate from "@/utils/date";

const emptyRole = {
    id: null,
    name: "",
};

const emptyPermission = {
    id: null,
    name: "",
};

export default function RolesIndex({
    roles = [],
    permissions,
    selectedRoleId = null,
    selectedPermissions = [],
    filters = {},
}) {
    const [activeRoleId, setActiveRoleId] = useState(selectedRoleId);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(emptyRole);
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(emptyPermission);
    const [permissionSearch, setPermissionSearch] = useState(
        filters.search ?? "",
    );
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    const activeRole = useMemo(() => {
        return roles.find((role) => role.id === activeRoleId) ?? null;
    }, [activeRoleId, roles]);

    const roleForm = useForm({
        name: "",
    });

    const permissionForm = useForm({
        name: "",
    });

    useEffect(() => {
        setActiveRoleId(selectedRoleId);
    }, [selectedRoleId]);

    useEffect(() => {
        setSelectedPermissionIds(
            selectedPermissions.map((permission) => permission.id),
        );
    }, [selectedPermissions]);

    useEffect(() => {
        setPermissionSearch(filters.search ?? "");
    }, [filters.search]);

    const routeWithRole = (params = {}) => ({
        role_id: activeRole?.id,
        search: filters.search ?? "",
        sort: filters.sort ?? "name",
        direction: filters.direction ?? "asc",
        ...params,
    });

    const selectRole = (role) => {
        setActiveRoleId(role.id);

        router.get(route("roles.index"), routeWithRole({ role_id: role.id }), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const openCreateRole = () => {
        setEditingRole(emptyRole);
        roleForm.reset();
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const openEditRole = (role) => {
        setEditingRole(role);
        roleForm.setData({
            name: role.name ?? "",
        });
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const closeRoleModal = () => {
        setRoleModalOpen(false);
        setEditingRole(emptyRole);
        roleForm.reset();
        roleForm.clearErrors();
    };

    const submitRole = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeRoleModal,
        };

        if (editingRole.id) {
            roleForm.put(route("roles.update", editingRole.id), options);
            return;
        }

        roleForm.post(route("roles.store"), options);
    };

    const deleteRole = (role) => {
        if (!confirm(`Delete the ${role.name} role?`)) {
            return;
        }

        router.delete(route("roles.destroy", role.id), {
            preserveScroll: true,
        });
    };

    const openCreatePermission = () => {
        setEditingPermission(emptyPermission);
        permissionForm.reset();
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const openEditPermission = (permission) => {
        setEditingPermission(permission);
        permissionForm.setData({
            name: permission.name ?? "",
        });
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const closePermissionModal = () => {
        setPermissionModalOpen(false);
        setEditingPermission(emptyPermission);
        permissionForm.reset();
        permissionForm.clearErrors();
    };

    const submitPermission = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closePermissionModal,
        };

        if (editingPermission.id) {
            permissionForm.put(
                route("permissions.update", editingPermission.id),
                options,
            );
            return;
        }

        permissionForm.post(route("permissions.store"), options);
    };

    const deletePermission = (permission) => {
        if (!confirm(`Delete the ${permission.name} permission?`)) {
            return;
        }

        router.delete(route("permissions.destroy", permission.id), {
            preserveScroll: true,
        });
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissionIds((current) => {
            if (current.includes(permissionId)) {
                return current.filter((id) => id !== permissionId);
            }

            return [...current, permissionId];
        });
    };

    const savePermissions = () => {
        if (!activeRole) {
            return;
        }

        router.post(
            route("roles.permissions.assign"),
            {
                role_id: activeRole.id,
                permissions: selectedPermissionIds,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const searchPermissions = (event) => {
        event.preventDefault();

        router.get(
            route("roles.index"),
            routeWithRole({
                search: permissionSearch,
                page: 1,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const changePermissionSearch = (permission) => {
        setPermissionSearch(permission?.name ?? "");
    };

    const toggleSort = (column) => {
        const nextDirection =
            filters.sort === column && filters.direction === "asc"
                ? "desc"
                : "asc";

        router.get(
            route("roles.index"),
            routeWithRole({
                sort: column,
                direction: nextDirection,
                page: 1,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles & Permissions" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Roles & Permissions
                    </h1>
                </div>

                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
                    <section className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[360px] xl:w-[420px]">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Roles
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {roles.length > 0 ? (
                                roles.map((role) => {
                                    const isActive = activeRole?.id === role.id;

                                    return (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            key={role.id}
                                            onClick={() => selectRole(role)}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === "Enter" ||
                                                    event.key === " "
                                                ) {
                                                    event.preventDefault();
                                                    selectRole(role);
                                                }
                                            }}
                                            className={`block w-full px-6 py-5 text-left transition ${
                                                isActive
                                                    ? "bg-emerald-50"
                                                    : "bg-white hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-semibold text-slate-700">
                                                        {role.name}
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {role.permissions_count ??
                                                            role.permissions
                                                                ?.length ??
                                                            0}{" "}
                                                        permissions assigned
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-3 text-sm">
                                                    <span
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            openEditRole(role);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (
                                                                event.key ===
                                                                    "Enter" ||
                                                                event.key ===
                                                                    " "
                                                            ) {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                openEditRole(
                                                                    role,
                                                                );
                                                            }
                                                        }}
                                                        className="cursor-pointer text-emerald-700 hover:underline"
                                                    >
                                                        Edit
                                                    </span>
                                                    <span
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            deleteRole(role);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (
                                                                event.key ===
                                                                    "Enter" ||
                                                                event.key ===
                                                                    " "
                                                            ) {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                deleteRole(role);
                                                            }
                                                        }}
                                                        className="cursor-pointer text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-6 py-10 text-center text-sm text-slate-500">
                                    No roles found.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="min-h-[260px] w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Permissions for{" "}
                                    <span className="text-slate-600">
                                        {activeRole?.name ?? "No role selected"}
                                    </span>
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Select permissions, then save changes for
                                    the active role.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={savePermissions}
                                    disabled={!activeRole}
                                    className="rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Save Permissions
                                </button>
                            </div>
                        </div>

                        {activeRole ? (
                            <>
                                <div className="px-6 pt-5">
                                    <form
                                        className="flex flex-col gap-3 md:flex-row"
                                        onSubmit={searchPermissions}
                                    >
                                        <SearchSelect
                                            routeName="permissions.search"
                                            defaultOptions={
                                                permissions?.data ?? []
                                            }
                                            placeholder="Search permission..."
                                            onChange={changePermissionSearch}
                                        />

                                        <button
                                            type="submit"
                                            className="rounded bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                        >
                                            Search
                                        </button>
                                    </form>
                                </div>

                                <div className="px-6">
                                    <Table
                                        pagination={permissions}
                                        exportable={false}
                                    >
                                        <Thead>
                                            <THdata>Assigned</THdata>
                                            <THdata>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleSort("name")
                                                    }
                                                    className="font-semibold text-slate-700 hover:text-emerald-700"
                                                >
                                                    Permission
                                                </button>
                                            </THdata>
                                            <THdata>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleSort(
                                                            "created_at",
                                                        )
                                                    }
                                                    className="font-semibold text-slate-700 hover:text-emerald-700"
                                                >
                                                    Created
                                                </button>
                                            </THdata>
                                            <THdata>
                                                <p className="text-center">
                                                    Actions
                                                </p>
                                            </THdata>
                                        </Thead>

                                        <Tbody>
                                            {permissions?.data?.length > 0 ? (
                                                permissions.data.map(
                                                    (permission) => (
                                                        <Trow
                                                            key={permission.id}
                                                        >
                                                            <Tdata>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedPermissionIds.includes(
                                                                        permission.id,
                                                                    )}
                                                                    onChange={() =>
                                                                        togglePermission(
                                                                            permission.id,
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                                                                />
                                                            </Tdata>
                                                            <Tdata className="font-semibold text-slate-700">
                                                                {
                                                                    permission.name
                                                                }
                                                            </Tdata>
                                                            <Tdata>
                                                                {formatDate(
                                                                    permission.created_at,
                                                                )}
                                                            </Tdata>
                                                            <Tdata>
                                                                <div className="flex items-center justify-center gap-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openEditPermission(
                                                                                permission,
                                                                            )
                                                                        }
                                                                        className="text-emerald-700 hover:underline"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            deletePermission(
                                                                                permission,
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:underline"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </Tdata>
                                                        </Trow>
                                                    ),
                                                )
                                            ) : (
                                                <Trow>
                                                    <Tdata
                                                        colSpan="4"
                                                        className="py-6 text-center text-slate-500"
                                                    >
                                                        No permissions found.
                                                    </Tdata>
                                                </Trow>
                                            )}
                                        </Tbody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-16 text-center text-sm text-slate-500">
                                Select a role to fetch and manage its
                                permissions.
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Modal
                show={roleModalOpen}
                onClose={closeRoleModal}
                maxWidth="3xl"
                align="top"
            >
                <form onSubmit={submitRole} className="space-y-7 p-10">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {editingRole.id ? "Edit Role" : "Add Role"}
                        </h2>
                    </div>

                    <div>
                        <InputLabel>Role Name</InputLabel>
                        <TextInput
                            value={roleForm.data.name}
                            onChange={(event) =>
                                roleForm.setData("name", event.target.value)
                            }
                            placeholder="e.g. admin, staff, student"
                            error={roleForm.errors.name}
                        />
                        <InputError message={roleForm.errors.name} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeRoleModal}
                            className="rounded bg-slate-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={roleForm.processing}
                            className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {roleForm.processing ? "Saving..." : "Save Role"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                show={permissionModalOpen}
                onClose={closePermissionModal}
                maxWidth="3xl"
                align="top"
            >
                <form onSubmit={submitPermission} className="space-y-7 p-10">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {editingPermission.id
                                ? "Edit Permission"
                                : "Add Permission"}
                        </h2>
                    </div>

                    <div>
                        <InputLabel>Permission Name</InputLabel>
                        <TextInput
                            value={permissionForm.data.name}
                            onChange={(event) =>
                                permissionForm.setData(
                                    "name",
                                    event.target.value,
                                )
                            }
                            placeholder="e.g. users.update"
                            error={permissionForm.errors.name}
                        />
                        <InputError message={permissionForm.errors.name} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closePermissionModal}
                            className="rounded bg-slate-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={permissionForm.processing}
                            className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {permissionForm.processing
                                ? "Saving..."
                                : "Save Permission"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
