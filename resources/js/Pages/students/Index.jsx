import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import TextInput from "@/Components/TextInput";
import formatDate from "@/utils/date";

const STATUS_STYLES = {
    active: "bg-emerald-50 text-emerald-700",
    suspended: "bg-amber-50 text-amber-700",
    graduated: "bg-blue-50 text-blue-700",
    dropped: "bg-red-50 text-red-700",
};

export default function StudentIndex({ students }) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("students.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (studentId) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        router.delete(route("students.destroy", studentId), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Student Management" />

            <div className="mx-auto w-full">
                {/* Action bar */}
                <div className="flex items-center justify-between mb-4">
                    <form className="flex gap-2 w-full" onSubmit={submit}>
                        <TextInput
                            className="w-full"
                            placeholder="Search by email or admission number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <Table pagination={students}>
                    <Thead>
                        <THdata>Admission Number</THdata>
                        <THdata>Name</THdata>
                        <THdata>Email</THdata>
                        <THdata>Module</THdata>
                        <THdata>Admission Date</THdata>
                        <THdata>Status</THdata>
                        <THdata>
                            <p className="text-center">Actions</p>
                        </THdata>
                    </Thead>

                    <Tbody>
                        {students?.data?.length > 0 ? (
                            students.data.map((student) => (
                                <Trow key={student.id}>
                                    <Tdata className="font-mono text-xs">
                                        {student.admission_number}
                                    </Tdata>

                                    <Tdata>
                                        {student.last_name}{" "}
                                        {student.first_name}
                                    </Tdata>

                                    <Tdata>{student.email}</Tdata>

                                    <Tdata>
                                        Module {student.current_module}
                                    </Tdata>

                                    <Tdata>{formatDate(student.admission_date)}</Tdata>

                                    <Tdata>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize
                                            ${STATUS_STYLES[student.student_status] ?? "bg-zinc-100 text-zinc-600"}`}
                                        >
                                            {student.student_status ?? "—"}
                                        </span>
                                    </Tdata>

                                    <Tdata>
                                        <div className="flex items-center justify-center gap-4">
                                            <a
                                                href={route(
                                                    "students.admission-letter",
                                                    student.id,
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sky-600 hover:underline text-sm"
                                            >
                                                Letter
                                            </a>
                                            <Link
                                                href={route(
                                                    "students.edit",
                                                    student.id,
                                                )}
                                                className="text-emerald-600 hover:underline text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(student.id)
                                                }
                                                className="text-red-500 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan="7"
                                    className="text-center py-6 text-zinc-400"
                                >
                                    No students found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
