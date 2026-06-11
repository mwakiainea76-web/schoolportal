import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import SearchSelect from "@/Components/SearchSelect";

export default function ExamBody({ examBodies }) {
    const [sortField, setSortField] = useState(examBodies.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        examBodies.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("exam.bodies.index"),
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
            route("exam.bodies.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this exam body?")) return;
        router.delete(route("exam-bodies.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Exam Bodies" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="exam.bodies.search"
                        defaultOptions={examBodies.data}
                        placeholder="Type  exam body name ..."
                        onChange={(body) => setSearchTerm(body.code)}
                    />
                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table
                    pagination={examBodies}
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
                        <THdata
                            onClick={() => handleSort("description")}
                            className="cursor-pointer"
                        >
                            Description {renderArrow("description")}
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
                        {examBodies?.data?.length ? (
                            examBodies.data.map((examBody) => (
                                <Trow key={examBody.id}>
                                    <Tdata>{examBody.code}</Tdata>
                                    <Tdata>{examBody.name}</Tdata>
                                    <Tdata>{examBody.description}</Tdata>
                                    <Tdata>
                                        {formatDate(examBody.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "exam.bodies.edit",
                                                    examBody.id,
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(examBody.id)
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
                                <Tdata colSpan="6" className="text-center py-4">
                                    No exam bodies found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
