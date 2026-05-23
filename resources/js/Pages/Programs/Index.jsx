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

export default function ProgramsIndex({ programs }) {
    const [sortField, setSortField] = useState(programs.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        programs.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("programs.index"),
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
            route("programs.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this program?")) {
            return;
        }

        router.delete(route("programs.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Programs" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link
                    className="mb-4 inline-block rounded bg-slate-400 px-4 py-1 text-white hover:bg-slate-700"
                    href={route("programs.create")}
                >
                    Add Program
                </Link>

                <form
                    className="relative flex w-full gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="programs.search"
                        defaultOptions={programs.data}
                        placeholder="Type in program name ..."
                        onChange={(body) => setSearchTerm(body.code ?? "")}
                    />
                    <button
                        className="rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table
                    pagination={programs}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
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
                            onClick={() => handleSort("certification_level_id")}
                            className="cursor-pointer"
                        >
                            Certification Level{" "}
                            {renderArrow("certification_level_id")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("department_id")}
                            className="cursor-pointer"
                        >
                            Department {renderArrow("department_id")}
                        </THdata>
                        <THdata>Current Program Version</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {programs?.data?.length ? (
                            programs.data.map((program) => (
                                <Trow key={program.id}>
                                    <Tdata>{program.id}</Tdata>
                                    <Tdata>{program.code}</Tdata>
                                    <Tdata>{program.name}</Tdata>
                                    <Tdata>
                                        {program.certification_level ?? "-"}
                                    </Tdata>
                                    <Tdata>{program.department ?? "-"}</Tdata>
                                    <Tdata>{program.curriculum ?? "-"}</Tdata>
                                    <Tdata>
                                        {formatDate(program.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "programs.edit",
                                                    encodeURIComponent(program.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(program.id)}
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
                                <Tdata colSpan="8" className="py-4 text-center">
                                    No programs found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
