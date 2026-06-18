import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/Components/TablePagination";
import TextInput from "@/Components/TextInput";
import formatDate from "@/utils/date";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

                                    <Tdata className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left" align="start" sideOffset={8} className="w-40">
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={route(
                                                            "students.admission-letter",
                                                            student.id,
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Letter
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route("students.edit", student.id)}>
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => handleDelete(student.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
