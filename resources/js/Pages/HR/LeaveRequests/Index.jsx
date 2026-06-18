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
import { statusClass, typeLabel } from "@/Pages/HR/LeaveRequests/shared";

export default function LeaveRequestIndex({
    leaveRequests,
    canViewAllRequests,
}) {
    return (
        <>
            <Head title="Leave Requests" />

            <div className="mx-auto w-full">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-950">
                            {canViewAllRequests
                                ? "Leave Requests"
                                : "My Leave Requests"}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Review submitted staff leave requests.
                        </p>
                    </div>

                    <Link
                        href={route("hr.leave-requests.create")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        Add Leave Request
                    </Link>
                </div>

                <Table pagination={leaveRequests}>
                    <Thead>
                        {canViewAllRequests ? <THdata>Staff</THdata> : null}
                        <THdata>Leave Type</THdata>
                        <THdata>Start Date</THdata>
                        <THdata>End Date</THdata>
                        <THdata>Days</THdata>
                        <THdata>Status</THdata>
                        <THdata>Submitted</THdata>
                    </Thead>
                    <Tbody>
                        {leaveRequests?.data?.length ? (
                            leaveRequests.data.map((request) => (
                                <Trow key={request.id}>
                                    {canViewAllRequests ? (
                                        <Tdata>
                                            <div>
                                                <p className="font-medium text-zinc-800">
                                                    {request.staff?.name ??
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {request.staff
                                                        ?.staff_number ?? "N/A"}
                                                </p>
                                            </div>
                                        </Tdata>
                                    ) : null}
                                    <Tdata>{typeLabel(request.leave_type)}</Tdata>
                                    <Tdata>{request.start_date}</Tdata>
                                    <Tdata>{request.end_date}</Tdata>
                                    <Tdata>{request.total_days}</Tdata>
                                    <Tdata>
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                                                request.status,
                                            )}`}
                                        >
                                            {request.status}
                                        </span>
                                    </Tdata>
                                    <Tdata>{request.created_at}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan={canViewAllRequests ? 7 : 6}
                                    className="py-4 text-center"
                                >
                                    No leave requests found.
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
