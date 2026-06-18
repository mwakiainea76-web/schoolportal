import { Head, Link, router } from "@inertiajs/react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/Components/TablePagination";

const STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    in_review: "bg-sky-100 text-sky-700 border-sky-200",
    escalated: "bg-purple-100 text-purple-700 border-purple-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function AdminIndex({ complaints, filterStatus }) {
    const handleStatusFilter = (status) => {
        router.get(
            route("complaints.admin.index"),
            { status },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Complaints Management" />

            <div className="mx-auto w-full">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-950">
                            Complaints Management
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Review and escalate student complaints.
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    {["", "pending", "in_review", "escalated", "resolved"].map(
                        (status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusFilter(status)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    filterStatus === status
                                        ? "bg-emerald-600 text-white"
                                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                }`}
                            >
                                {status
                                    ? status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                                    : "All"}
                            </button>
                        ),
                    )}
                </div>

                <Table pagination={complaints}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Subject</THdata>
                        <THdata>Status</THdata>
                        <THdata>Escalated To</THdata>
                        <THdata>Submitted</THdata>
                        <THdata>Action</THdata>
                    </Thead>
                    <Tbody>
                        {complaints?.data?.length ? (
                            complaints.data.map((complaint) => (
                                <Trow key={complaint.id}>
                                    <Tdata>
                                        <div>
                                            <p className="font-medium text-zinc-800">
                                                {complaint.student?.name ?? "N/A"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {complaint.student?.admission_number ?? ""}
                                            </p>
                                        </div>
                                    </Tdata>
                                    <Tdata className="font-medium text-zinc-800">
                                        {complaint.subject}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                                                STATUS_STYLES[
                                                    complaint.status
                                                ] || "bg-zinc-100 text-zinc-600"
                                            }`}
                                        >
                                            {complaint.status.replace("_", " ")}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        {complaint.escalated_to
                                            ? complaint.escalated_to.name
                                            : "-"}
                                    </Tdata>
                                    <Tdata>{complaint.created_at}</Tdata>
                                    <Tdata>
                                        <Link
                                            href={route(
                                                "complaints.admin.show",
                                                complaint.id,
                                            )}
                                            className="text-sm font-medium text-sky-600 hover:text-sky-800"
                                        >
                                            View
                                        </Link>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan={6}
                                    className="py-8 text-center text-zinc-500"
                                >
                                    No complaints found.
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
