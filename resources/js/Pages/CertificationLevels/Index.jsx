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

export default function CertificationLevels({ certificationLevels }) {
    const [sortField, setSortField] = useState(
        certificationLevels.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        certificationLevels.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("certification-levels.index"),
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
            route("certification-levels.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (
            !confirm(
                "Are you sure you want to delete this certification level?",
            )
        )
            return;
        router.delete(
            route("certification-levels.destroy", encodeURIComponent(id)),
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Certification Levels" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="certification-levels.search"
                        defaultOptions={certificationLevels.data}
                        placeholder="Type in certification level name ..."
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
                    pagination={certificationLevels}
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
                        <THdata>Exam body</THdata>
                        <THdata
                            onClick={() => handleSort("entry_grade")}
                            className="cursor-pointer"
                        >
                            Entry Grade {renderArrow("entry_grade")}
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
                        {certificationLevels?.data?.length ? (
                            certificationLevels.data.map((cert) => (
                                <Trow key={cert.id}>
                                    <Tdata>{cert.code}</Tdata>
                                    <Tdata>{cert.name}</Tdata>
                                    <Tdata>{cert.exam_body.name}</Tdata>
                                    <Tdata>{cert.entry_grade}</Tdata>

                                    <Tdata>{formatDate(cert.created_at)}</Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "certification-levels.edit",
                                                    encodeURIComponent(cert.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(cert.id)
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
                                <Tdata colSpan="7" className="text-center py-4">
                                    No certification levels found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
