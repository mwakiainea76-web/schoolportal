import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/Components/TablePagination";
import FilterPanel from "@/Components/FilterPanel";
import formatDate from "@/utils/date";

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-gray-100 text-gray-600",
};

const FILTER_DEFINITIONS = [
    {
        key: "admission_number",
        label: "Admission Number",
        type: "text",
        placeholder: "Search by Reg No...",
    },
    {
        key: "course_id",
        label: "Course Name",
        type: "search",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
        clears: ["curriculum_id"],
    },
    {
        key: "curriculum_id",
        label: "Curriculum Name",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
        dependsOn: "course_id",
        disabledPlaceholder: "Select course first",
    },
    {
        key: "department_id",
        label: "Department",
        type: "search",
        routeName: "departments.search",
        placeholder: "Search department...",
        selectedLabelKey: "department",
    },
    {
        key: "academic_year_id",
        label: "Academic Year",
        type: "search",
        routeName: "academic-years.search",
        placeholder: "Select academic year...",
        selectedLabelKey: "academic_year",
        clears: ["academic_session_id"],
    },
    {
        key: "academic_session_id",
        label: "Academic Session",
        type: "search",
        routeName: "academic-sessions.search",
        placeholder: "Select academic session...",
        selectedLabelKey: "academic_session",
        dependsOn: "academic_year_id",
        disabledPlaceholder: "Select academic year first",
        routeParams: (form) => ({
            academic_year_id: form.academic_year_id,
        }),
    },
    {
        key: "year_of_study",
        label: "Year of Study",
        type: "select",
        placeholder: "All years",
        options: [
            { value: "1", label: "Year 1" },
            { value: "2", label: "Year 2" },
            { value: "3", label: "Year 3" },
            { value: "4", label: "Year 4" },
        ],
    },
    {
        key: "status",
        label: "Status",
        type: "status",
        placeholder: "All statuses",
    },
];

const labelStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

export default function Index({
    enrollments,
    filters = {},
    selectedFilters = {},
    statuses = [],
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [sortField, setSortField] = useState(
        pageFilters.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || "desc",
    );

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("academic.sessions.enrollments.index"),
            {
                ...Object.fromEntries(
                    Object.entries(pageFilters).filter(
                        ([, v]) => v !== "" && v !== null,
                    ),
                ),
                sort: field,
                direction,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "\u2191" : "\u2193";
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to remove this enrollment?"))
            return;
        router.delete(route("academic.session.enrollments.destroy", id), {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Academic Session Enrollments" />

            <div className="mx-auto w-full max-w-7xl">
                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    selectedFilters={selectedFilters}
                    statuses={statuses}
                    routeName="academic.sessions.enrollments.index"
                    extraParams={{
                        sort: sortField,
                        direction: sortDirection,
                        page: 1,
                    }}
                    quickKeys={[
                        "admission_number",
                        "course_id",
                        "year_of_study",
                        "status",
                    ]}
                />

                <Table pagination={enrollments}>
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
                        <THdata>Student</THdata>
                        <THdata>Reg No</THdata>
                        <THdata>Department</THdata>
                        <THdata>Session</THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>Course</THdata>
                        <THdata>Year</THdata>
                        <THdata>Module</THdata>
                        <THdata>Status</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Enrolled {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {enrollments?.data?.length ? (
                            enrollments.data.map((enrollment) => (
                                <Trow key={enrollment.id}>
                                    <Tdata>{enrollment.id}</Tdata>
                                    <Tdata className="font-medium text-slate-700">
                                        {enrollment.student_name}
                                    </Tdata>
                                    <Tdata className="text-slate-500">
                                        {enrollment.admission_number}
                                    </Tdata>
                                    <Tdata>{enrollment.department}</Tdata>
                                    <Tdata>{enrollment.session}</Tdata>
                                    <Tdata>{enrollment.curriculum}</Tdata>
                                    <Tdata>{enrollment.course}</Tdata>
                                    <Tdata className="text-center">
                                        {enrollment.year_of_study}
                                    </Tdata>
                                    <Tdata className="text-center">
                                        {enrollment.module}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[enrollment.status] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {labelStatus(enrollment.status)}
                                        </span>
                                    </Tdata>
                                    <Tdata>{formatDate(enrollment.created_at)}</Tdata>
                                    <Tdata className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                >
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="left"
                                                align="start"
                                                sideOffset={8}
                                                className="w-40"
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            "academic.sessions.enrollments.edit",
                                                            enrollment.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            enrollment.id,
                                                        )
                                                    }
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
                                    colSpan="12"
                                    className="text-center py-4"
                                >
                                    No enrollments found.
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
