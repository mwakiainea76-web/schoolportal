import { Head, router } from "@inertiajs/react";
import { useState } from "react";

import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import TablePagination from "@/Components/TablePagination";
import TextInput from "@/Components/TextInput";

export default function DepartmentStaffIndex({
    staffs,
    department_context = null,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("staffs.department.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    return (
        <>
            <Head title="Department Staff" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Department Staff
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        View staff linked to your department only.
                    </p>
                    <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                        {department_context?.label}
                    </div>
                </div>

                <form className="mb-4 flex w-full gap-x-7" onSubmit={submit}>
                    <TextInput
                        placeholder="Search by name, email or staff number..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />

                    <button
                        className="rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table pagination={staffs}>
                    <Thead>
                        <THdata>Staff No</THdata>
                        <THdata>Name</THdata>
                        <THdata>Email</THdata>
                        <THdata>Role</THdata>
                        <THdata>Department</THdata>
                        <THdata>Status</THdata>
                    </Thead>

                    <Tbody>
                        {staffs?.data?.length > 0 ? (
                            staffs.data.map((staff) => (
                                <Trow key={staff.id}>
                                    <Tdata>{staff.staff_number}</Tdata>
                                    <Tdata>
                                        {staff.last_name} {staff.first_name}
                                    </Tdata>
                                    <Tdata>{staff.email}</Tdata>
                                    <Tdata>{staff.roles?.[0] ?? "N/A"}</Tdata>
                                    <Tdata>
                                        {staff.department?.name ?? "N/A"}
                                    </Tdata>
                                    <Tdata>{staff?.staff_status}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="6" className="py-4 text-center">
                                    No staff found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
const Table = ({ children, pagination, ...props }) => (
    <>
        <ShadTable {...props}>{children}</ShadTable>
        <TablePagination pagination={pagination} />
    </>
);

const Thead = ({ children, ...props }) => (
    <TableHeader {...props}>
        <TableRow>{children}</TableRow>
    </TableHeader>
);

const THdata = (props) => <TableHead {...props} />;
const Tbody = (props) => <TableBody {...props} />;
const Trow = (props) => <TableRow {...props} />;
const Tdata = (props) => <TableCell {...props} />;
