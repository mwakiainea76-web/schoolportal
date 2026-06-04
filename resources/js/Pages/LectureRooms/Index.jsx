import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

export default function Index({ lecture_rooms, departments, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("lecture-rooms.index"),
            {
                search,
                department_id: filters.department_id,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this lecture room?")) return;
        router.delete(route("lecture-rooms.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lecture Rooms" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            Lecture Rooms
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            Manage halls and classrooms used in the timetable,
                            including merged classes shared across courses.
                        </p>
                    </div>
                </div>

                <form className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px_120px]" onSubmit={submit}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search room name, code, or location..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                    />
                    <select
                        value={filters.department_id}
                        onChange={(e) =>
                            router.get(
                                route("lecture-rooms.index"),
                                {
                                    search,
                                    department_id: e.target.value,
                                },
                                { preserveState: true, replace: true },
                            )
                        }
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                    >
                        <option value="">All departments</option>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table pagination={lecture_rooms}>
                    <Thead>
                        <THdata>Code</THdata>
                        <THdata>Name</THdata>
                        <THdata>Department</THdata>
                        <THdata>Capacity</THdata>
                        <THdata>Location</THdata>
                        <THdata>Status</THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {lecture_rooms?.data?.length ? (
                            lecture_rooms.data.map((room) => (
                                <Trow key={room.id}>
                                    <Tdata>{room.code}</Tdata>
                                    <Tdata>{room.name}</Tdata>
                                    <Tdata>{room.department?.name}</Tdata>
                                    <Tdata>{room.capacity ?? "N/A"}</Tdata>
                                    <Tdata>{room.location ?? "N/A"}</Tdata>
                                    <Tdata>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                room.is_active
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-zinc-100 text-zinc-500"
                                            }`}
                                        >
                                            {room.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-8">
                                            <Link
                                                href={route("lecture-rooms.edit", room.id)}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(room.id)}
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
                                <Tdata colSpan="7" className="py-8 text-center">
                                    No lecture rooms found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
