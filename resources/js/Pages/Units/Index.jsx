import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import SearchSelect from "@/Components/SearchSelect";
import useRbac from "@/Hooks/useRbac";
export default function UnitsIndex({ units }) {
    const [sortField, setSortField] = useState(units.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        units.direction || "desc",
    );
    const { can } = useRbac();

    const [searchTerm, setSearchTerm] = useState("");
    const { url, props } = usePage();
    const user = props.auth.user;

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("units.index"),
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
            route("units.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (code) => {
        if (!confirm("Are you sure you want to delete this unit?")) return;
        router.delete(route("units.destroy", { unit: code }), {
            preserveState: true,
            replace: true,
        });
    };
    useEffect(() => {
        console.log("TEST:", props.auth.permissions_test);
        console.log("TYPE:", typeof props.auth.permissions_test);
        console.log("ARRAY?", Array.isArray(props.auth.permissions_test));
    });
    return (
        <AuthenticatedLayout>
            <Head title="Units" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {can("units.create") ? (
                    <Link
                        className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                        href={route("units.create")}
                    >
                        Add Unit
                    </Link>
                ) : null}

                {can("units.edit") ? (
                    <form
                        className="w-full relative flex gap-x-7"
                        onSubmit={submit}
                    >
                        <SearchSelect
                            routeName="units.search"
                            defaultOptions={units.data}
                            placeholder="Type in unit name ..."
                            onChange={(body) => setSearchTerm(body.code)}
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
                    pagination={units}
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
                            onClick={() => handleSort("credit_factor")}
                            className="cursor-pointer"
                        >
                            Credits {renderArrow("credit_factor")}
                        </THdata>
                        <THdata>Training Hours</THdata>

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>

                        {can("units.edit") || can("units.delete") ? (
                            <THdata>
                                <p className="text-center">Actions</p>
                            </THdata>
                        ) : null}
                    </Thead>
                    <Tbody>
                        {units?.data?.length ? (
                            units.data.map((unit) => (
                                <Trow key={unit.id}>
                                    <Tdata>{unit.id}</Tdata>
                                    <Tdata>{unit.code}</Tdata>
                                    <Tdata>{unit.name}</Tdata>
                                    <Tdata>{unit.credit_factor}</Tdata>
                                    <Tdata>{unit.training_hours} hrs</Tdata>
                                    <Tdata>{formatDate(unit.created_at)}</Tdata>

                                    {can("units.edit") ||
                                    can("units.delete") ? (
                                        <Tdata>
                                            <div className="flex items-center justify-center gap-x-10">
                                                {can("units.edit") ? (
                                                    <Link
                                                        href={route(
                                                            "units.edit",
                                                            encodeURIComponent(
                                                                unit.id,
                                                            ),
                                                        )}
                                                        className="text-emerald-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                ) : null}

                                                {can("units.delete") ? (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                unit.code,
                                                            )
                                                        }
                                                        className="text-red-600 hover:underline"
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
                                <Tdata colSpan="9" className="text-center py-4">
                                    No units found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
