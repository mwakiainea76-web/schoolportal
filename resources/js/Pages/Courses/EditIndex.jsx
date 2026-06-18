import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import FilterPanel from "@/Components/FilterPanel";
import formatDate from "@/utils/date";
import { downloadExport } from "@/utils/exportDownload";

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
                                    <Tdata>
                                        <div className="flex items-center gap-x-4">
                                            <Link
                                                href={route(
                                                    "courses.edit",
                                                    encodeURIComponent(
                                                        course.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(course.id)
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
