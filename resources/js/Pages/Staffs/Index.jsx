import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import TextInput from "@/Components/TextInput";

export default function StaffIndex({ staffs }) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("staffs.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (staffId) => {
        if (!confirm("Are you sure you want to delete this staff?")) return;

        router.delete(route("staffs.destroy", staffId), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Staff Management" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* SEARCH */}
                <form className="w-full flex gap-x-7 mb-4" onSubmit={submit}>
                    <TextInput
                        placeholder="Type staff email here"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />

                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table pagination={staffs}>
                    <Thead>
                        <THdata>Staff No</THdata>
                        <THdata>Name</THdata>
                        <THdata>Email</THdata>
                        <THdata>Role</THdata>
                        <THdata>Department</THdata>
                        <THdata>Status</THdata>
                        <THdata>
                            <p className="text-center">Actions</p>
                        </THdata>
                    </Thead>

                    <Tbody>
                        {staffs?.data?.length > 0 ? (
                            staffs.data.map((staff) => (
                                <Trow key={staff.id}>
                                    <Tdata>{staff.staff_number}</Tdata>

                                    <Tdata className="">
                                        {staff.user.last_name}{" "}
                                        {staff.user.first_name}
                                    </Tdata>

                                    <Tdata>{staff.user.email}</Tdata>

                                    <Tdata>
                                        {staff.user?.roles?.[0]?.name ?? "N/A"}
                                    </Tdata>

                                    <Tdata>
                                        {staff.department?.name ?? "N/A"}
                                    </Tdata>

                                    <Tdata>{staff?.staff_status}</Tdata>

                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            {/* EDIT */}
                                            <Link
                                                href={route(
                                                    "staffs.edit",
                                                    staff.id,
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            {/* DELETE */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(staff.id)
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
                                <Tdata colSpan="7" className="text-center py-4">
                                    No staff found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
