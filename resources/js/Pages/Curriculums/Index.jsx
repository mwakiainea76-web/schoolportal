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
import useRbac from "@/Hooks/UseRBAC";
import CourseWorkspaceTabs from "@/Pages/Courses/Partials/CourseWorkspaceTabs";

export default function CurriculumIndex({
    curricula,
    curriculumOptions = [],
}) {
    const [sortField, setSortField] = useState(curricula.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        curricula.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const { can } = useRbac();

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("curriculums.index"),
            { sort: field, direction, page: 1 },
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
        <AuthenticatedLayout>
            <Head title="Curriculums" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <CourseWorkspaceTabs activeTab="curriculums" />
                </div>
                {can("curriculums.view") ? (
                    <form
                        className="w-full relative flex gap-x-7"
                        onSubmit={submit}
                    >
                        <SearchSelect
                            defaultOptions={curriculumOptions}
                            placeholder="Select curriculum ..."
                            onChange={(body) => setSearchTerm(body.name)}
                        />
                        <button
                            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
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
        </AuthenticatedLayout>
    );
}
