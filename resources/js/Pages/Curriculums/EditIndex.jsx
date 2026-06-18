import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Download, ListChecks, Search } from "lucide-react";
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
import SearchSelect from "@/Components/SearchSelect";
import useRbac from "@/Hooks/UseRBAC";
import { downloadExport } from "@/utils/exportDownload";

export default function CurriculumEditIndex({
    curricula,
    filters = {},
    curriculumOptions = [],
}) {
    const pageFilters =
        filters && typeof filters === "object" && !Array.isArray(filters)
            ? filters
            : {};
    const [sortField, setSortField] = useState(
        pageFilters.sort || curricula.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || curricula.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState(pageFilters.search || "");
    const [exportFormat, setExportFormat] = useState("pdf");
    const { can } = useRbac();
    const canManage = can("curriculums.edit") || can("curriculums.delete");
    const routeName = "curriculums.edit.index";

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route(routeName),
            {
                search: searchTerm || pageFilters.search || "",
                sort: field,
                direction,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? "^" : "v";
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route(routeName),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
    };

    const handleExport = () => {
        downloadExport("curriculums", exportFormat, {
            search: searchTerm || pageFilters.search || "",
            sort: sortField,
            direction: sortDirection,
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this curriculum?")) {
            return;
        }

        router.delete(route("curriculums.destroy", { curriculum: id }), {
            preserveState: true,
            replace: true,
        });
    };

    const handleDisable = (id) => {
        if (!confirm("Disable this curriculum?")) {
            return;
        }

        router.patch(route("curriculums.disable", { curriculum: id }), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleReactivate = (id) => {
        if (!confirm("Reactivate this curriculum?")) {
            return;
        }

        router.patch(route("curriculums.reactivate", { curriculum: id }), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const emptyColSpan = canManage ? 4 : 3;

    return (
        <>
            <Head title="Edit Curriculums" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {can("curriculums.view") ? (
                    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-700">
                                    <ListChecks className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Operations
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Search, export, and manage curriculum status.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <form
                                    className="flex min-w-0 flex-1 gap-2 sm:min-w-[360px]"
                                    onSubmit={submit}
                                >
                                    <div className="min-w-0 flex-1">
                                        <SearchSelect
                                            routeName="curriculums.search"
                                            defaultOptions={curriculumOptions}
                                            placeholder="Select curriculum ..."
                                            onChange={(body) =>
                                                setSearchTerm(body?.name || "")
                                            }
                                        />
                                    </div>
                                    <button
                                        className="inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                                        type="submit"
                                    >
                                        <Search className="h-4 w-4" aria-hidden="true" />
                                        Search
                                    </button>
                                </form>

                                <div className="flex items-center">
                                    <select
                                        value={exportFormat}
                                        onChange={(e) =>
                                            setExportFormat(e.target.value)
                                        }
                                        className="h-[38px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="csv">CSV</option>
                                        <option value="excel">Excel</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleExport}
                                        className="inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-r bg-slate-500 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                                    >
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                <Table
                    pagination={curricula}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>

                        <THdata>Exam Body</THdata>
                        <THdata>Status</THdata>

                        {canManage ? (
                            <THdata>
                                <p className="text-center">Actions</p>
                            </THdata>
                        ) : null}
                    </Thead>

                    <Tbody>
                        {curricula?.data?.length ? (
                            curricula.data.map((curriculum) => (
                                <Trow key={curriculum.id}>
                                    <Tdata>{curriculum.name}</Tdata>

                                    <Tdata>
                                        {curriculum.exam_body
                                            ? [curriculum.exam_body.name]
                                                  .filter(Boolean)
                                                  .join(" - ")
                                            : "-"}
                                    </Tdata>
                                    <Tdata>
                                        <StatusPill active={curriculum.is_active} />
                                    </Tdata>

                                    {canManage ? (
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
                                                    className="w-44"
                                                >
                                                    {can("curriculums.edit") ? (
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route(
                                                                    "curriculums.edit",
                                                                    {
                                                                        curriculum:
                                                                            curriculum.id,
                                                                    },
                                                                )}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ) : null}

                                                    {can("curriculums.edit") ? (
                                                        curriculum.is_active ? (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDisable(
                                                                        curriculum.id,
                                                                    )
                                                                }
                                                            >
                                                                Disable
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleReactivate(
                                                                        curriculum.id,
                                                                    )
                                                                }
                                                            >
                                                                Activate
                                                            </DropdownMenuItem>
                                                        )
                                                    ) : null}

                                                    {can("curriculums.delete") ? (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        curriculum.id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : null}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </Tdata>
                                    ) : null}
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan={emptyColSpan} className="py-6 text-center text-slate-400">
                                    No curriculums found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}

function StatusPill({ active }) {
    return (
        <span
            className={`rounded px-2 py-1 text-xs font-semibold ${
                active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-700"
            }`}
        >
            {active ? "Active" : "Disabled"}
        </span>
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
