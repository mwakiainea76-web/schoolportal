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
import FilterPanel from "@/Components/FilterPanel";
import formatDate from "@/utils/date";
import { downloadExport } from "@/utils/exportDownload";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FILTER_DEFINITIONS = [
    {
        key: "course_id",
        label: "Course Name",
        type: "search",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
    },
    {
        key: "curriculum_id",
        label: "Curriculum",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Search curriculum...",
        selectedLabelKey: "curriculum",
    },
    {
        key: "college_id",
        label: "College",
        type: "search",
        routeName: "colleges.search",
        placeholder: "Search college...",
        selectedLabelKey: "college",
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
        key: "programme_id",
        label: "Programme",
        type: "search",
        routeName: "programmes.search",
        placeholder: "Search programme...",
        selectedLabelKey: "programme",
    },
];

export default function EditIndex({
    courses,
    filters = {},
    filters: { sort = "created_at", direction = "desc" },
}) {
    const [sortField, setSortField] = useState(sort);
    const [sortDirection, setSortDirection] = useState(direction);
    const [exportFormat, setExportFormat] = useState("pdf");

    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this course?")) {
            return;
        }
        router.delete(route("courses.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const dir =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(dir);

        const cleanFilters = Object.fromEntries(
            Object.entries(pageFilters).filter(
                ([, v]) => v !== "" && v !== null,
            ),
        );
        router.get(
            route("courses.edit.index"),
            { ...cleanFilters, sort: field, direction: dir, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "^" : "v";
    };

    const handleExport = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(pageFilters).filter(
                ([, v]) => v !== "" && v !== null,
            ),
        );
        downloadExport("courses", exportFormat, {
            ...cleanFilters,
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head title="Course Edit Index" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Course Edit Index
                    </h1>
                </div>

                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    routeName="courses.edit.index"
                    extraParams={{ sort: sortField, direction: sortDirection, page: 1 }}
                    quickKeys={["course_id", "curriculum_id"]}
                />

                <div className="mb-2 flex justify-end">
                    <div className="flex items-center">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        >
                            <option value="pdf">PDF</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                        >
                            Export
                        </button>
                    </div>
                </div>

                <Table pagination={courses}>
                    <Thead>
                        <THdata
                            onClick={() => handleSort("code")}
                            className="cursor-pointer"
                        >
                            Course Code {renderArrow("code")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Course Name {renderArrow("name")}
                        </THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>College</THdata>
                        <THdata>Department</THdata>
                        <THdata>Programme</THdata>
                        <THdata>Action</THdata>
                    </Thead>

                    <Tbody>
                        {courses?.data?.length ? (
                            courses.data.map((course) => (
                                <Trow key={course.id}>
                                    <Tdata>{course.code}</Tdata>
                                    <Tdata>{course.name}</Tdata>
                                    <Tdata>{course.curriculum ?? "-"}</Tdata>
                                    <Tdata>{course.college ?? "-"}</Tdata>
                                    <Tdata>{course.department ?? "-"}</Tdata>
                                    <Tdata>{course.programme ?? "-"}</Tdata>
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
                                                    <Link
                                                        href={route(
                                                            "courses.edit",
                                                            encodeURIComponent(course.id),
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => handleDelete(course.id)}
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
                                <Tdata colSpan="7" className="py-4 text-center">
                                    No courses found.
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
