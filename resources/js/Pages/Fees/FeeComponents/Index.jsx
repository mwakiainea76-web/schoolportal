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

export default function Index({ components }) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        router.get(route("fees.components.index"), {
            search: searchTerm,
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this fee component?")) return;

        router.delete(route("fees.components.destroy", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Components" />

            <div className="mx-auto w-full">
                {/* HEADER */}
                <div className="flex justify-between mb-4">
                    <Link
                        href={route("fees.components.create")}
                        className="px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700"
                    >
                        Add Component
                    </Link>
                </div>

                {/* SEARCH */}
                <form onSubmit={submit} className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search component..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    <button className="px-4 py-1 bg-emerald-600 text-white rounded">
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table pagination={components}>
                    <Thead>
                        <THdata>Name</THdata>
                        <THdata>Type</THdata>
                        <THdata>Amount</THdata>
                        <THdata>Frequency</THdata>
                        <THdata>Optional</THdata>
                        <THdata>Template</THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {components.data.length ? (
                            components.data.map((c) => (
                                <Trow key={c.id}>
                                    <Tdata>{c.name}</Tdata>
                                    <Tdata>{c.type}</Tdata>
                                    <Tdata>{c.amount}</Tdata>
                                    <Tdata>{c.frequency}</Tdata>
                                    <Tdata>
                                        {c.is_optional ? "Yes" : "No"}
                                    </Tdata>
                                    <Tdata>{c.template?.name}</Tdata>

                                    <Tdata>
                                        <div className="flex gap-4">
                                            <Link
                                                href={route(
                                                    "fees.components.edit",
                                                    c.id,
                                                )}
                                                className="text-emerald-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(c.id)
                                                }
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="7" className="text-center">
                                    No components found
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
