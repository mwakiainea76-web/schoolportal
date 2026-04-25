import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";

import SearchSelect from "@/Components/SearchSelect";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
export default function EditRolePermissions({
    role,
    selected_permissions: permissions,
    permissions_data,
}) {
    // ORIGINAL (for reset)
    const [originalPermissions] = useState(permissions);

    // WORKING STATE
    const [selectedPermissions, setSelectedPermissions] = useState(permissions);

    // add permission
    const handleAdd = (selected) => {
        if (!selected) return;

        setSelectedPermissions((prev) => {
            const exists = prev.find((p) => p.id === selected.id);
            if (exists) return prev;

            return [...prev, selected];
        });
    };

    // remove permission
    const removePermission = (id) => {
        setSelectedPermissions((prev) => prev.filter((p) => p.id !== id));
    };

    // save
    const submit = (e) => {
        e.preventDefault();

        router.post(route("roles.assign.permissions"), {
            role_id: role.id,
            permissions: selectedPermissions.map((p) => p.id),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Role Permissions" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white border rounded-lg shadow-sm p-8 space-y-8">
                    <div>
                        <InputLabel>Role Name</InputLabel>

                        <TextInput
                            className="cursor-not-allowed"
                            value={role.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. admin, staff, student"
                        />
                        <input type="hidden" value={role.id} />
                    </div>

                    {/* ADD PERMISSION */}
                    <div>
                        <InputLabel>Add Permission</InputLabel>

                        <SearchSelect
                            routeName="permissions.search"
                            defaultOptions={permissions_data}
                            placeholder="Search permissions..."
                            multiple={false}
                            onChange={handleAdd}
                        />
                    </div>

                    {/* TABLE */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-100">
                                <tr>
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">
                                        Permission
                                    </th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedPermissions.length > 0 ? (
                                    selectedPermissions.map((p, i) => (
                                        <tr
                                            key={p.id}
                                            className="border-t hover:bg-zinc-50"
                                        >
                                            <td className="p-3">{i + 1}</td>
                                            <td className="p-3 font-medium">
                                                {p.name}
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() =>
                                                        removePermission(p.id)
                                                    }
                                                    className="text-red-600 font-bold"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center p-4 text-zinc-400"
                                        >
                                            No permissions assigned
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("roles.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Back
                        </Link>

                        <button
                            onClick={submit}
                            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
