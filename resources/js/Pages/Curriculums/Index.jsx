import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import SearchSelect from "@/Components/SearchSelect";
import useRbac from "@/Hooks/UseRBAC";
import { downloadExport } from "@/utils/exportDownload";

export default function CurriculumIndex({
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

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("curriculums.index"),
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
            route("curriculums.index"),
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

    return (
        <>
            <Head title="Curriculums" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {can("curriculums.view") ? (
                    <form
                        className="mb-2 flex w-full flex-wrap items-center gap-3"
                        onSubmit={submit}
                    >
                        <div className="min-w-[200px] flex-1">
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
                            className="whitespace-nowrap rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                ) : null}

                {can("curriculums.view") ? (
                    <div className="flex justify-end">
                        <div className="flex items-center">
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
                                Export {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </div>
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

                        {can("curriculums.edit") ||
                        can("curriculums.delete") ? (
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
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-semibold ${
                                                curriculum.is_active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-zinc-200 text-zinc-700"
                                            }`}
                                        >
                                            {curriculum.is_active
                                                ? "Active"
                                                : "Disabled"}
                                        </span>
                                    </Tdata>

                                    {can("curriculums.edit") ||
                                    can("curriculums.delete") ? (
                                        <Tdata>
                                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                                                {can("curriculums.edit") ? (
                                                    <Link
                                                        href={route(
                                                            "curriculums.edit",
                                                            {
                                                                curriculum:
                                                                    curriculum.id,
                                                            },
                                                        )}
                                                        className="whitespace-nowrap text-emerald-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                ) : null}

                                                {can("curriculums.edit") ? (
                                                    curriculum.is_active ? (
                                                        <button
                                                            onClick={() =>
                                                                handleDisable(
                                                                    curriculum.id,
                                                                )
                                                            }
                                                            className="whitespace-nowrap text-amber-600 hover:underline"
                                                        >
                                                            Disable
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleReactivate(
                                                                    curriculum.id,
                                                                )
                                                            }
                                                            className="whitespace-nowrap text-emerald-600 hover:underline"
                                                        >
                                                            Activate
                                                        </button>
                                                    )
                                                ) : null}

                                                {can("curriculums.delete") ? (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                curriculum.id,
                                                            )
                                                        }
                                                        className="whitespace-nowrap text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                ) : null}
                                            </div>
                                        </Tdata>
                                    ) : null}
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="5" className="text-center py-4">
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
