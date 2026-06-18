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
import FilterPanel from "@/Components/FilterPanel";
import formatDate from "@/utils/date";
import { downloadExport } from "@/utils/exportDownload";

const FILTER_DEFINITIONS = [
    {
        key: "course_id",
        label: "Course Name",
        type: "search",
        routeName: "courses.hod.search",
        placeholder: "Select active course...",
        selectedLabelKey: "course",
    },
    {
        key: "curriculum_id",
        label: "Curriculum",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
    },
];

export default function HodIndex({
    courses,
    filters = {},
    selectedFilters = {},
    department_context = null,
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
    const [exportFormat, setExportFormat] = useState("pdf");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);

        const cleanFilters = Object.fromEntries(
            Object.entries(pageFilters).filter(
                ([, v]) => v !== "" && v !== null,
            ),
        );

        router.get(
            route("courses.hod.index"),
            { ...cleanFilters, sort: field, direction, page: 1 },
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
            <Head title="Department Courses" />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Department Courses -{" "}
                        <span className=" rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                            {department_context?.label}
                        </span>
                    </h1>
                </div>

                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    selectedFilters={selectedFilters}
                    routeName="courses.hod.index"
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
                            Export {exportFormat.toUpperCase()}
                        </button>
                    </div>
                </div>

                <Table
                    pagination={courses}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("code")}
                            className="cursor-pointer"
                        >
                            Code {renderArrow("code")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("certification_level_id")}
                            className="cursor-pointer"
                        >
                            Certification Level{" "}
                            {renderArrow("certification_level_id")}
                        </THdata>
                        <THdata>Department</THdata>
                        <THdata>Current Curriculum</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                    </Thead>

                    <Tbody>
                        {courses?.data?.length ? (
                            courses.data.map((course) => (
                                <Trow key={course.id}>
                                    <Tdata>{course.id}</Tdata>
                                    <Tdata>{course.code}</Tdata>
                                    <Tdata>{course.name}</Tdata>
                                    <Tdata>
                                        {course.certification_level ?? "-"}
                                    </Tdata>
                                    <Tdata>{course.department ?? "-"}</Tdata>
                                    <Tdata>{course.curriculum ?? "-"}</Tdata>
                                    <Tdata>
                                        {formatDate(course.created_at)}
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
