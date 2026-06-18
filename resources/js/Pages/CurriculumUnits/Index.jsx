import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import FilterPanel from "@/Components/FilterPanel";
import { downloadExport } from "@/utils/exportDownload";

const FILTER_DEFINITIONS = [
    {
        key: "curriculum_mapping_id",
        label: "Curriculum Mapping",
        type: "search",
        routeName: "curriculum.mappings.search",
        placeholder: "Search mapping...",
        selectedLabelKey: "mapping",
        minSearchLength: 2,
    },
    {
        key: "unit_id",
        label: "Unit Name",
        type: "search",
        routeName: "units.search",
        placeholder: "Type in unit name...",
        selectedLabelKey: "unit",
        routeParams: (form) => ({
            curriculum_mapping_id: form.curriculum_mapping_id || "",
            module_taught: form.module_taught || "",
        }),
        dependsOn: "curriculum_mapping_id",
        minSearchLength: 2,
    },
    {
        key: "module_taught",
        label: "Module Taught",
        type: "select",
        options: [
            { value: "", label: "All" },
            { value: "Semester", label: "Semester" },
            { value: "Yearly", label: "Yearly" },
        ],
        dependsOn: "curriculum_mapping_id",
    },
    {
        key: "scope",
        label: "Scope",
        type: "select",
        options: [
            { value: "", label: "All" },
            { value: "exam", label: "Exam" },
            { value: "coursework", label: "Coursework" },
            { value: "practical", label: "Practical" },
            { value: "other", label: "Other" },
        ],
        dependsOn: "curriculum_mapping_id",
    },
];

export default function Index({
    curriculumUnits,
    filters = {},
    selected_mapping_option = null,
    curriculum_mapping = null,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [sortField, setSortField] = useState(
        pageFilters.sort || "id",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || "asc",
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
            route("units.index"),
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
        downloadExport("units", exportFormat, {
            ...cleanFilters,
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head title="Curriculum Units" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Curriculum Units
                    </h1>
                    {(selected_mapping_option || curriculum_mapping) && (
                        <p className="mt-1 text-sm text-zinc-500">
                            Mapping:{" "}
                            {selected_mapping_option?.label ??
                                curriculum_mapping?.name ??
                                "N/A"}
                        </p>
                    )}
                </div>

                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    routeName="units.index"
                    extraParams={{ sort: sortField, direction: sortDirection, page: 1 }}
                    quickKeys={["curriculum_mapping_id", "unit_id"]}
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

                <Table pagination={curriculumUnits}>
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("unit")}
                            className="cursor-pointer"
                        >
                            Unit {renderArrow("unit")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("module_taught")}
                            className="cursor-pointer"
                        >
                            Module Taught {renderArrow("module_taught")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("scope")}
                            className="cursor-pointer"
                        >
                            Scope {renderArrow("scope")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("coefficient")}
                            className="cursor-pointer"
                        >
                            Coefficient {renderArrow("coefficient")}
                        </THdata>
                        <THdata>Curriculum Mapping</THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {curriculumUnits?.data?.length ? (
                            curriculumUnits.data.map((unit) => (
                                <Trow key={unit.id}>
                                    <Tdata>{unit.id}</Tdata>
                                    <Tdata>{unit.unit ?? "-"}</Tdata>
                                    <Tdata>{unit.module_taught ?? "-"}</Tdata>
                                    <Tdata>{unit.scope ?? "-"}</Tdata>
                                    <Tdata>{unit.coefficient ?? "-"}</Tdata>
                                    <Tdata>
                                        {unit.curriculum_mapping ?? "-"}
                                    </Tdata>
                                    <Tdata>
                                        <a
                                            href={route(
                                                "curriculum-units.edit",
                                                unit.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </a>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="7" className="py-4 text-center">
                                    No curriculum units found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
