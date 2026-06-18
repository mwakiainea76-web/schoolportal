import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { downloadExport } from "@/utils/exportDownload";

const FILTER_DEFINITIONS = [
    {
        key: "curriculum_id",
        label: "Curriculum",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Search curriculum...",
        selectedLabelKey: "curriculum",
    },
    {
        key: "course_id",
        label: "Course Name",
        type: "search",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
        routeParams: (form) => ({ scope: form.curriculum_id || "" }),
    },
    {
        key: "mapping_type",
        label: "Mapping Type",
        type: "select",
        options: [
            { value: "", label: "All Types" },
            { value: "core", label: "Core" },
            { value: "elective", label: "Elective" },
        ],
    },
    {
        key: "status",
        label: "Status",
        type: "status",
    },
];

export default function Index({
    curriculumMappings,
    filters = {},
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
            route("courses.curriculum-mappings.index"),
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
        downloadExport("curriculumMappings", exportFormat, {
            ...cleanFilters,
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head title="Curriculum Mappings" />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Curriculum Mappings
                    </h1>
                </div>

                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    routeName="courses.curriculum-mappings.index"
                    extraParams={{ sort: sortField, direction: sortDirection, page: 1 }}
                    quickKeys={["curriculum_id", "course_id"]}
                />

                <div className="mb-2 flex justify-end">
                    <div className="flow-root">
                        <div className="-mx-3 -my-1.5 flex items-center justify-end">
                            <Link
                                href={route("courses.curriculum-mappings.create")}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                            >
                                Add New
                            </Link>
                            <div className="ml-2 flex items-center">
                                <select
                                    value={exportFormat}
                                    onChange={(e) =>
                                        setExportFormat(e.target.value)
                                    }
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
                    </div>
                </div>

                <Table pagination={curriculumMappings}>
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>Course</THdata>
                        <THdata>Mapping Type</THdata>
                        <THdata>Status</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created At {renderArrow("created_at")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("updated_at")}
                            className="cursor-pointer"
                        >
                            Updated At {renderArrow("updated_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {curriculumMappings?.data?.length ? (
                            curriculumMappings.data.map((mapping) => (
                                <Trow key={mapping.id}>
                                    <Tdata>{mapping.id}</Tdata>
                                    <Tdata>{mapping.curriculum}</Tdata>
                                    <Tdata>{mapping.course}</Tdata>
                                    <Tdata>{mapping.mapping_type}</Tdata>
                                    <Tdata>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                mapping.status
                                                    ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                                    : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                            }`}
                                        >
                                            {mapping.status ? "Active" : "Inactive"}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        {formatDate(mapping.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        {formatDate(mapping.updated_at)}
                                    </Tdata>
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
                                                            "courses.curriculum-mappings.edit",
                                                            mapping.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            "units.index",
                                                            {
                                                                curriculum_mapping_id:
                                                                    mapping.id,
                                                            },
                                                        )}
                                                    >
                                                        Units
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="8" className="py-4 text-center">
                                    No curriculum mappings found.
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
