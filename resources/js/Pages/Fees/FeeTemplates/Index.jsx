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

export default function FeeTemplatesIndex({ templates }) {
    const [sortField, setSortField] = useState(templates.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        templates.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("fee-templates.index"),
            { sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("fees.templates.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
            },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this fee template?")) return;

        router.delete(route("fees.templates.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Templates" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* CREATE */}
                <Link
                    href={route("fees.templates.create")}
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                >
                    Add Template
                </Link>

                {/* SEARCH */}
                <form className="w-full flex gap-x-6 mb-4" onSubmit={submit}>
                    <SearchSelect
                        routeName="fee-templates.search"
                        defaultOptions={templates.data}
                        placeholder="Search template..."
                        onChange={(t) => setSearchTerm(t.name)}
                    />

                    <button
                        type="submit"
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table
                    pagination={templates}
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

                        <THdata
                            onClick={() => handleSort("is_active")}
                            className="cursor-pointer"
                        >
                            Active {renderArrow("is_active")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("is_reusable")}
                            className="cursor-pointer"
                        >
                            Reusable {renderArrow("is_reusable")}
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
                        {templates?.data?.length ? (
                            templates.data.map((template) => (
                                <Trow key={template.id}>
                                    <Tdata>{template.name}</Tdata>

                                    <Tdata>
                                        {template.is_active ? "Yes" : "No"}
                                    </Tdata>

                                    <Tdata>
                                        {template.is_reusable ? "Yes" : "No"}
                                    </Tdata>

                                    <Tdata>
                                        {formatDate(template.created_at)}
                                    </Tdata>

                                    <Tdata>
                                        <div className="flex justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "fees.templates.edit",
                                                    encodeURIComponent(
                                                        template.id,
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
                                                            template.id,
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
                                <Tdata colSpan="5" className="text-center py-4">
                                    No templates found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
