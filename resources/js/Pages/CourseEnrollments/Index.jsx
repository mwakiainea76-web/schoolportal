import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700",
    deferred: "bg-amber-100 text-amber-700",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-zinc-100 text-zinc-600",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    deactivated: "bg-slate-100 text-slate-600",
};

const labelStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

export default function Index({
    courseEnrollments,
    filters = {},
    selectedFilters = {},
    statuses = [],
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [form, setForm] = useState({
        course_id: pageFilters.course_id || "",
        curriculum_id: pageFilters.curriculum_id || "",
        academic_year_id: pageFilters.academic_year_id || "",
        academic_session_id: pageFilters.academic_session_id || "",
        status: pageFilters.status || "",
    });

    const setFilter = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("courses.enrollments.index"),
            { ...form, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        const emptyFilters = {
            course_id: "",
            curriculum_id: "",
            academic_year_id: "",
            academic_session_id: "",
            status: "",
        };

        setForm(emptyFilters);

        router.get(
            route("courses.enrollments.index"),
            { page: 1 },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Course Enrollments" />

            <div className="max-w-6xl mx-auto w-full">
                <form
                    className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <InputLabel value="Course Name" />
                            <SearchSelect
                                routeName="courses.search"
                                defaultOptions={[]}
                                value={form.course_id}
                                selectedLabel={selectedFilters.course}
                                placeholder="Select course..."
                                preloadOptions
                                onChange={(course) =>
                                    setFilter("course_id", course.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Curriculum Name" />
                            <SearchSelect
                                routeName="curriculums.search"
                                defaultOptions={[]}
                                value={form.curriculum_id}
                                selectedLabel={selectedFilters.curriculum}
                                placeholder="Select curriculum..."
                                preloadOptions
                                onChange={(curriculum) =>
                                    setFilter("curriculum_id", curriculum.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Year" />
                            <SearchSelect
                                routeName="academic-years.search"
                                defaultOptions={[]}
                                value={form.academic_year_id}
                                selectedLabel={selectedFilters.academic_year}
                                placeholder="Select academic year..."
                                preloadOptions
                                onChange={(academicYear) => {
                                    setForm((current) => ({
                                        ...current,
                                        academic_year_id: academicYear.id,
                                        academic_session_id: "",
                                    }));
                                }}
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Session" />
                            <SearchSelect
                                routeName="academic-sessions.search"
                                routeParams={{
                                    academic_year_id: form.academic_year_id,
                                }}
                                defaultOptions={[]}
                                value={form.academic_session_id}
                                selectedLabel={
                                    selectedFilters.academic_session
                                }
                                placeholder="Select academic session..."
                                preloadOptions
                                onChange={(academicSession) =>
                                    setFilter(
                                        "academic_session_id",
                                        academicSession.id,
                                    )
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Status" />
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setFilter("status", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-emerald-200"
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {labelStatus(status)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded bg-zinc-400 px-4 py-2 text-sm text-white hover:bg-zinc-600"
                        >
                            Clear
                        </button>
                        <button
                            className="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-slate-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <Table pagination={courseEnrollments}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Reg No</THdata>
                        <THdata>Course</THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>Academic Year</THdata>
                        <THdata>Academic Session</THdata>
                        <THdata>Status</THdata>
                        <THdata>Admitted</THdata>
                    </Thead>
                    <Tbody>
                        {courseEnrollments?.data?.length ? (
                            courseEnrollments.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>
                                        {item.student_name || "-"}
                                    </Tdata>
                                    <Tdata>
                                        {item.admission_number || "-"}
                                    </Tdata>
                                    <Tdata>{item.course ?? "-"}</Tdata>
                                    <Tdata>{item.curriculum ?? "-"}</Tdata>
                                    <Tdata>{item.academic_year ?? "-"}</Tdata>
                                    <Tdata>
                                        {item.academic_session ?? "-"}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {labelStatus(item.status)}
                                        </span>
                                    </Tdata>
                                    <Tdata>{formatDate(item.created_at)}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="8" className="text-center py-6">
                                    No course enrollments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
