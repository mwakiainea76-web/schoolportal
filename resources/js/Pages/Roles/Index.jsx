import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";
export default function RolesIndex({ roles }) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("roles.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (roleId) => {
        if (!confirm("Are you sure you want to delete this role?")) return;

        router.delete(route("roles.destroy", roleId), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles Management" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* ACTION BAR */}
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href={route("roles.create")}
                        className="px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700"
                    >
                        Add Role
                    </Link>
                </div>

                {/* SEARCH */}
                <form className="w-full flex gap-x-7 mb-4" onSubmit={submit}>
                    <SearchSelect
                        routeName="roles.search"
                        defaultOptions={roles.data}
                        placeholder="Type here role name ..."
                        onChange={(rol) => setSearchTerm(rol.name)}
                    />

                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table pagination={roles}>
                    <Thead>
                        <THdata>Id</THdata>
                        <THdata>Name</THdata>
                        <THdata>Permissions Count</THdata>
                        <THdata>Created</THdata>
                        <THdata>
                            <p className=" text-center">Actions</p>
                        </THdata>
                    </Thead>

                    <Tbody>
                        {roles?.data?.length > 0 ? (
                            roles.data.map((role) => (
                                <Trow key={role.id}>
                                    <Tdata>{role.id}</Tdata>
                                    <Tdata className="font-semibold">
                                        {role.name}
                                    </Tdata>

                                    <Tdata>
                                        {role.permissions?.length ?? 0}
                                    </Tdata>

                                    <Tdata>{formatDate(role.created_at)}</Tdata>

                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            {/* EDIT PERMISSIONS */}
                                            <Link
                                                href={route(
                                                    "roles.edit",
                                                    encodeURIComponent(role.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit role
                                            </Link>
                                            <Link
                                                href={route(
                                                    "roles.permissions.edit",
                                                    encodeURIComponent(role.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit permissions
                                            </Link>
                                            {/* DELETE */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(role.id)
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="5" className="text-center py-4">
                                    No roles found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
