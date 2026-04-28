import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";

export default function FeeModelsIndex({
    feeModels,
    templates,
    departments,
    curricula,
    academicSessions,
}) {
    const [sortField, setSortField] = useState(feeModels.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        feeModels.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        scope: "",
        priority: "",
        template: "",
        department: "",
        curriculum: "",
        academic_session: "",
        valid: "",
    });

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("fees.models.index"),
            { sort: field, direction, page: 1, ...filters },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);

        router.get(
            route("fees.models.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...newFilters,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("fees.models.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...filters,
            },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this fee model?")) return;

        router.delete(route("fees.models.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadge = (isActive, isValid) => {
        if (!isActive)
            return (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    Inactive
                </span>
            );
        if (!isValid)
            return (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    Expired
                </span>
            );
        return (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                Active
            </span>
        );
    };

    const getScopeBadge = (scope) => {
        const colors = {
            global: "bg-blue-100 text-blue-800",
            department: "bg-purple-100 text-purple-800",
            curriculum: "bg-orange-100 text-orange-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs rounded capitalize ${colors[scope] || "bg-gray-100 text-gray-800"}`}
            >
                {scope}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            60: "bg-green-100 text-green-800",
            70: "bg-yellow-100 text-yellow-800",
            80: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs rounded ${colors[priority] || "bg-gray-100 text-gray-800"}`}
            >
                {priority}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Models" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* CREATE */}
                <Link
                    href={route("fees.models.create")}
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                >
                    Add Fee Model
                </Link>

                {/* SEARCH */}
                <form className="w-full flex gap-x-6 mb-4" onSubmit={submit}>
                    <SearchSelect
                        routeName="fee-templates.search"
                        defaultOptions={templates}
                        placeholder="Search templates..."
                        onChange={(t) => setSearchTerm(t.name)}
                    />

                    <button
                        type="submit"
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                    >
                        Search
                    </button>
                </form>

                {/* FILTERS */}
                <div className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={filters.scope}
                        onChange={(e) =>
                            handleFilterChange("scope", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Scopes</option>
                        <option value="global">Global</option>
                        <option value="department">Department</option>
                        <option value="curriculum">Curriculum</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) =>
                            handleFilterChange("priority", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Priorities</option>
                        <option value="60">Low (60)</option>
                        <option value="70">Medium (70)</option>
                        <option value="80">High (80)</option>
                    </select>

                    <select
                        value={filters.valid}
                        onChange={(e) =>
                            handleFilterChange("valid", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Validity</option>
                        <option value="valid">Valid</option>
                        <option value="expired">Expired</option>
                        <option value="upcoming">Upcoming</option>
                    </select>

                    <select
                        value={filters.template}
                        onChange={(e) =>
                            handleFilterChange("template", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Templates</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.department}
                        onChange={(e) =>
                            handleFilterChange("department", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.curriculum}
                        onChange={(e) =>
                            handleFilterChange("curriculum", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Curricula</option>
                        {curricula.map((curr) => (
                            <option key={curr.id} value={curr.id}>
                                {curr.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.academic_session}
                        onChange={(e) =>
                            handleFilterChange(
                                "academic_session",
                                e.target.value,
                            )
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Sessions</option>
                        {academicSessions.map((session) => (
                            <option key={session.id} value={session.id}>
                                {session.session_No}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <Table
                    pagination={feeModels}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            ID {renderArrow("id")}
                        </THdata>

                        <THdata>Template</THdata>

                        <THdata
                            onClick={() => handleSort("scope")}
                            className="cursor-pointer"
                        >
                            Scope {renderArrow("scope")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("priority")}
                            className="cursor-pointer"
                        >
                            Priority {renderArrow("priority")}
                        </THdata>

                        <THdata>Department</THdata>

                        <THdata>Curriculum</THdata>

                        <THdata>Valid From</THdata>

                        <THdata>Valid Until</THdata>

                        <THdata
                            onClick={() => handleSort("is_active")}
                            className="cursor-pointer"
                        >
                            Status {renderArrow("is_active")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>

                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {feeModels?.data?.length ? (
                            feeModels.data.map((feeModel) => (
                                <Trow key={feeModel.id}>
                                    <Tdata>{feeModel.id}</Tdata>

                                    <Tdata>
                                        <div>
                                            <div className="font-medium">
                                                {feeModel.template?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {feeModel.display_name}
                                            </div>
                                        </div>
                                    </Tdata>

                                    <Tdata>
                                        {getScopeBadge(feeModel.scope)}
                                    </Tdata>

                                    <Tdata>
                                        {getPriorityBadge(feeModel.priority)}
                                    </Tdata>

                                    <Tdata>
                                        {feeModel.department?.name || "—"}
                                    </Tdata>

                                    <Tdata>
                                        {feeModel.curriculum?.name || "—"}
                                    </Tdata>

                                    <Tdata>
                                        {formatDate(feeModel.valid_from)}
                                    </Tdata>

                                    <Tdata>
                                        {feeModel.valid_until
                                            ? formatDate(feeModel.valid_until)
                                            : "No end date"}
                                    </Tdata>

                                    <Tdata>
                                        {getStatusBadge(
                                            feeModel.is_active,
                                            feeModel.is_valid,
                                        )}
                                    </Tdata>

                                    <Tdata>
                                        {formatDate(feeModel.created_at)}
                                    </Tdata>

                                    <Tdata>
                                        <div className="flex justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "fees.models.edit",
                                                    encodeURIComponent(
                                                        feeModel.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        encodeURIComponent(
                                                            feeModel.id,
                                                        ),
                                                    )
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
                                <Tdata
                                    colSpan="11"
                                    className="text-center py-4"
                                >
                                    No fee models found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
