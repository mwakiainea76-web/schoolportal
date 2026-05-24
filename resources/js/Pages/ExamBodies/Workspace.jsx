import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import SearchSelect from "@/Components/SearchSelect";

export default function Workspace({
    activeTab = "exam-bodies",
    examBodies,
    certificationLevels,
    selectedExamBody,
    filters = {},
}) {
    const isExamBodies = activeTab === "exam-bodies";
    const dataset = isExamBodies ? examBodies : certificationLevels;
    const [sortField, setSortField] = useState(filters.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const indexRoute = isExamBodies
        ? "exam.bodies.index"
        : "certification-levels.index";
    const createRoute = isExamBodies
        ? "exam.bodies.create"
        : "certification-levels.create";
    const searchRoute = isExamBodies
        ? "exam.bodies.search"
        : "certification-levels.search";
    const selectedExamBodyId = filters.exam_body_id || selectedExamBody?.id;

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route(indexRoute),
            {
                sort: field,
                direction,
                page: 1,
                search: searchTerm || undefined,
                exam_body_id: selectedExamBodyId || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route(indexRoute),
            {
                search: searchTerm || undefined,
                sort: sortField,
                direction: sortDirection,
                exam_body_id: selectedExamBodyId || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        const confirmed = confirm(
            isExamBodies
                ? "Are you sure you want to delete this exam body?"
                : "Are you sure you want to delete this certification level?",
        );

        if (!confirmed) return;

        router.delete(
            route(
                isExamBodies ? "exam.bodies.destroy" : "certification-levels.destroy",
                encodeURIComponent(id),
            ),
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? "↑" : "↓";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Exams & Certifications" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-5 flex flex-col gap-4 rounded-[1.75rem] bg-[#132238] px-6 py-6 text-white shadow-lg md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Academic Setup
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Exams & Certifications
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Manage exam bodies and the certification levels under them from one workspace.
                        </p>
                    </div>

                    <Link
                        href={route(createRoute)}
                        data={
                            !isExamBodies && selectedExamBodyId
                                ? { exam_body_id: selectedExamBodyId }
                                : undefined
                        }
                        className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        {isExamBodies ? "Add Exam Body" : "Add Certification Level"}
                    </Link>
                </div>

                <div className="mb-5 flex flex-wrap gap-3">
                    <Link
                        href={route("exam.bodies.index")}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isExamBodies
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
                        }`}
                    >
                        Exam Bodies
                    </Link>
                    <Link
                        href={route("certification-levels.index")}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            !isExamBodies
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
                        }`}
                    >
                        Certification Levels
                    </Link>
                </div>

                <form className="mb-4 flex w-full gap-x-7" onSubmit={submit}>
                    <SearchSelect
                        routeName={searchRoute}
                        defaultOptions={dataset?.data ?? []}
                        placeholder={
                            isExamBodies
                                ? "Search exam body..."
                                : "Search certification level..."
                        }
                        onChange={(item) =>
                            setSearchTerm(
                                item?.name ?? item?.code ?? "",
                            )
                        }
                    />

                    <button
                        className="rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {!isExamBodies && selectedExamBody ? (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        <p>
                            Viewing certification levels for{" "}
                            <span className="font-semibold">
                                {selectedExamBody.name}
                            </span>
                            {selectedExamBody.code
                                ? ` (${selectedExamBody.code})`
                                : ""}
                            .
                        </p>
                        <Link
                            href={route("certification-levels.index")}
                            className="font-semibold text-emerald-700 hover:underline"
                        >
                            Clear filter
                        </Link>
                    </div>
                ) : null}

                <Table
                    pagination={dataset}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
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

                        {isExamBodies ? (
                            <THdata
                                onClick={() => handleSort("description")}
                                className="cursor-pointer"
                            >
                                Description {renderArrow("description")}
                            </THdata>
                        ) : (
                            <>
                                <THdata>Exam Body</THdata>
                                <THdata
                                    onClick={() => handleSort("entry_grade")}
                                    className="cursor-pointer"
                                >
                                    Entry Grade {renderArrow("entry_grade")}
                                </THdata>
                            </>
                        )}

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {dataset?.data?.length ? (
                            dataset.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>{item.code}</Tdata>
                                    <Tdata>{item.name}</Tdata>

                                    {isExamBodies ? (
                                        <Tdata>{item.description}</Tdata>
                                    ) : (
                                        <>
                                            <Tdata>{item.exam_body?.name}</Tdata>
                                            <Tdata>{item.entry_grade}</Tdata>
                                        </>
                                    )}

                                    <Tdata>{formatDate(item.created_at)}</Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    isExamBodies
                                                        ? "exam.bodies.edit"
                                                        : "certification-levels.edit",
                                                    encodeURIComponent(item.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            {isExamBodies ? (
                                                <Link
                                                    href={route(
                                                        "certification-levels.index",
                                                        {
                                                            exam_body_id: item.id,
                                                        },
                                                    )}
                                                    className="text-emerald-600 hover:underline"
                                                >
                                                    View certifications
                                                </Link>
                                            ) : null}

                                            <button
                                                onClick={() => handleDelete(item.id)}
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
                                    colSpan={isExamBodies ? "5" : "6"}
                                    className="py-4 text-center"
                                >
                                    {isExamBodies
                                        ? "No exam bodies found."
                                        : "No certification levels found."}
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
