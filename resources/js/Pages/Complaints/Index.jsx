import { Head, Link } from "@inertiajs/react";
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

export default function Index({ complaints }) {
    return (
        <>
            <Head title="My Complaints" />

            <div className="mx-auto w-full">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-950">
                            My Complaints
                        </h1>
                        <p className="text-sm text-zinc-500">
                            View and track your submitted complaints.
                        </p>
                    </div>

                    <Link
                        href={route("student.complaints.create")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        Submit Complaint
                    </Link>
                </div>

                <Table pagination={complaints}>
                    <Thead>
                        <THdata>Subject</THdata>
                        <THdata>Status</THdata>
                        <THdata>Escalated To</THdata>
                        <THdata>Submitted</THdata>
                    </Thead>
                    <Tbody>
                        {complaints?.data?.length ? (
                            complaints.data.map((complaint) => (
                                <Trow key={complaint.id}>
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
                                            ? `${complaint.escalated_to.name} (${complaint.escalated_to.designation})`
                                            : "-"}
                                    </Tdata>
                                    <Tdata>{complaint.created_at}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan={4}
                                    className="py-8 text-center text-zinc-500"
                                >
                                    No complaints yet.
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
