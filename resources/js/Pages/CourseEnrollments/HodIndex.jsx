import { Head } from "@inertiajs/react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import FilterPanel from "@/Components/FilterPanel";
import formatDate from "@/utils/date";

const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700",
    deferred: "bg-amber-100 text-amber-700",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-zinc-100 text-zinc-600",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    deactivated: "bg-slate-100 text-slate-600",
};

const FILTER_DEFINITIONS = [
    {
        key: "admission_number",
        label: "Admission Number",
        type: "text",
        placeholder: "Search by Reg No...",
    },
    {
        key: "course_id",
        label: "Course",
        type: "search",
        routeName: "courses.hod.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
        clears: ["curriculum_id"],
    },
    {
        key: "curriculum_id",
        label: "Curriculum",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
        dependsOn: "course_id",
        disabledPlaceholder: "Select course first",
        routeParams: (form) => ({ course_id: form.course_id }),
    },
    {
        key: "academic_year_id",
        label: "Academic Year",
        type: "search",
        routeName: "academic-years.search",
        placeholder: "Select academic year...",
        selectedLabelKey: "academic_year",
        clears: ["academic_session_id"],
    },
    {
        key: "academic_session_id",
        label: "Academic Session",
        type: "search",
        routeName: "academic-sessions.search",
        placeholder: "Select academic session...",
        selectedLabelKey: "academic_session",
        dependsOn: "academic_year_id",
        disabledPlaceholder: "Select academic year first",
        routeParams: (form) => ({ academic_year_id: form.academic_year_id }),
    },
    {
        key: "year_of_study",
        label: "Year of Study",
        type: "select",
        placeholder: "All years",
        options: [
            { value: "1", label: "Year 1" },
            { value: "2", label: "Year 2" },
            { value: "3", label: "Year 3" },
            { value: "4", label: "Year 4" },
        ],
    },
    {
        key: "status",
        label: "Status",
        type: "status",
        placeholder: "All statuses",
    },
];

const labelStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

export default function HodIndex({
    courseEnrollments,
    filters = {},
    selectedFilters = {},
    statuses = [],
}) {
    return (
        <>
            <Head title="Department Enrollments" />

            <div className="mx-auto w-full max-w-6xl">
                <FilterPanel
                    definitions={FILTER_DEFINITIONS}
                    filters={filters}
                    selectedFilters={selectedFilters}
                    statuses={statuses}
                    routeName="courses.enrollments.hod.index"
                    extraParams={{ page: 1 }}
                    quickKeys={[
                        "admission_number",
                        "course_id",
                        "year_of_study",
                        "status",
                    ]}
                />

                <Table pagination={courseEnrollments}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Reg No</THdata>
                        <THdata>Department</THdata>
                        <THdata>Course</THdata>
                        <THdata>Year</THdata>
                        <THdata>Session</THdata>
                        <THdata>Status</THdata>
                        <THdata>Admitted</THdata>
                    </Thead>
                    <Tbody>
                        {courseEnrollments?.data?.length ? (
                            courseEnrollments.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>{item.student_name || "-"}</Tdata>
                                    <Tdata>
                                        {item.admission_number || "-"}
                                    </Tdata>
                                    <Tdata>{item.department ?? "-"}</Tdata>
                                    <Tdata>{item.course ?? "-"}</Tdata>
                                    <Tdata>{item.year_of_study ?? "-"}</Tdata>
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
                                <Tdata colSpan="8" className="py-6 text-center">
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
