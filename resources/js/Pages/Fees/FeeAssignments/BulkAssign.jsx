import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";

export default function BulkAssign({ feePlans, academicYear, departments }) {
    const { data, setData, post, processing, errors } = useForm({
        fee_plan_id: "",
        academic_year_id: "",
        department_id: "",
        certification_level_id: "",
        year_of_study: "",
        session_number: "",
        selected_course_curriculum_ids: [],
        visible_course_curriculum_ids: [],
    });

    const [certificationLevels, setCertificationLevels] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingLevels, setLoadingLevels] = useState(false);
    const [loadingRows, setLoadingRows] = useState(false);

    useEffect(() => {
        if (!data.department_id) {
            setCertificationLevels([]);
            setRows([]);
            setData("certification_level_id", "");
            setData("selected_course_curriculum_ids", []);
            setData("visible_course_curriculum_ids", []);
            return;
        }

        const loadCertificationLevels = async () => {
            setLoadingLevels(true);

            try {
                const response = await fetch(
                    route("fees.assignments.bulk.certification-levels", {
                        department_id: data.department_id,
                    }),
                );
                const result = await response.json();
                setCertificationLevels(result);
            } catch (error) {
                console.error("Failed to load certification levels", error);
                setCertificationLevels([]);
            } finally {
                setLoadingLevels(false);
            }
        };

        loadCertificationLevels();
    }, [data.department_id]);

    useEffect(() => {
        if (
            !data.fee_plan_id ||
            !data.academic_year_id ||
            !data.department_id ||
            !data.certification_level_id ||
            !data.year_of_study ||
            !data.session_number
        ) {
            setRows([]);
            setData("selected_course_curriculum_ids", []);
            setData("visible_course_curriculum_ids", []);
            return;
        }

        const loadCurriculums = async () => {
            setLoadingRows(true);

            try {
                const response = await fetch(
                    route("fees.assignments.bulk.curriculums", {
                        fee_plan_id: data.fee_plan_id,
                        academic_year_id: data.academic_year_id,
                        department_id: data.department_id,
                        certification_level_id: data.certification_level_id,
                        year_of_study: data.year_of_study,
                        session_number: data.session_number,
                    }),
                );
                const result = await response.json();
                const loadedRows = result.rows ?? [];

                setRows(loadedRows);
                setData(
                    "visible_course_curriculum_ids",
                    loadedRows.map((row) => row.id),
                );
                setData(
                    "selected_course_curriculum_ids",
                    loadedRows
                        .filter((row) => row.is_assigned)
                        .map((row) => row.id),
                );
            } catch (error) {
                console.error("Failed to load curriculums", error);
                setRows([]);
                setData("selected_course_curriculum_ids", []);
                setData("visible_course_curriculum_ids", []);
            } finally {
                setLoadingRows(false);
            }
        };

        loadCurriculums();
    }, [
        data.fee_plan_id,
        data.academic_year_id,
        data.department_id,
        data.certification_level_id,
        data.year_of_study,
        data.session_number,
    ]);

    const selectedIds = data.selected_course_curriculum_ids.map(String);
    const allVisibleSelected =
        rows.length > 0 &&
        rows.every((row) => selectedIds.includes(String(row.id)));

    const toggleCurriculum = (id) => {
        const normalizedId = String(id);
        const updated = selectedIds.includes(normalizedId)
            ? data.selected_course_curriculum_ids.filter(
                  (item) => String(item) !== normalizedId,
              )
            : [...data.selected_course_curriculum_ids, id];

        setData("selected_course_curriculum_ids", updated);
    };

    const toggleAll = () => {
        setData(
            "selected_course_curriculum_ids",
            allVisibleSelected ? [] : rows.map((row) => row.id),
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.assignments.bulk.assign"), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bulk Fee Assignment" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <div className="bg-slate-600 py-2 text-center text-sm font-medium text-white">
                        Curriculum Fee Assignment
                    </div>

                    <form className="space-y-8 p-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Fee Plan" />
                                <SearchSelect
                                    routeName="fee-plans.search"
                                    defaultOptions={feePlans}
                                    placeholder="Select fee plan..."
                                    onChange={(item) =>
                                        setData("fee_plan_id", item.id)
                                    }
                                />
                                <InputError message={errors.fee_plan_id} />
                            </div>

                            <div>
                                <InputLabel value="Academic year" />
                                <SearchSelect
                                    defaultOptions={academicYear}
                                    placeholder="Select academic year..."
                                    onChange={(item) =>
                                        setData("academic_year_id", item.id)
                                    }
                                />
                                <InputError message={errors.academic_year_id} />
                            </div>

                            <div>
                                <InputLabel value="Department" />
                                <SearchSelect
                                    routeName="departments.search"
                                    defaultOptions={departments}
                                    placeholder="Select department..."
                                    onChange={(item) => {
                                        setData("department_id", item.id);
                                        setData("certification_level_id", "");
                                    }}
                                />
                                <InputError message={errors.department_id} />
                            </div>

                            <div>
                                <InputLabel value="Certification Level" />
                                <SearchSelect
                                    key={data.department_id || "no-department"}
                                    routeName={
                                        data.department_id
                                            ? "fees.assignments.bulk.certification-levels"
                                            : null
                                    }
                                    routeParams={{
                                        department_id: data.department_id,
                                    }}
                                    defaultOptions={certificationLevels}
                                    placeholder={
                                        data.department_id
                                            ? "Select certification level..."
                                            : "Choose department first..."
                                    }
                                    onChange={(item) =>
                                        setData(
                                            "certification_level_id",
                                            item.id,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.certification_level_id}
                                />
                                {loadingLevels && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        Loading certification levels...
                                    </p>
                                )}
                            </div>

                            <div>
                                <InputLabel value="Year Of Study" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.year_of_study}
                                    onChange={(e) =>
                                        setData("year_of_study", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputError message={errors.year_of_study} />
                            </div>

                            <div>
                                <InputLabel value="Session Number" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.session_number}
                                    onChange={(e) =>
                                        setData(
                                            "session_number",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full"
                                />
                                <InputError message={errors.session_number} />
                            </div>
                        </div>

                        <div className="rounded-lg border">
                            <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Curriculums
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Existing assignments for the selected
                                        fee plan and session come pre-checked.
                                    </p>
                                </div>

                                {rows.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={toggleAll}
                                        className="rounded bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
                                    >
                                        {allVisibleSelected
                                            ? "Clear All"
                                            : "Select All"}
                                    </button>
                                )}
                            </div>

                            {loadingRows ? (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Loading curriculums...
                                </div>
                            ) : rows.length === 0 ? (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    {data.fee_plan_id &&
                                    data.academic_year_id &&
                                    data.department_id &&
                                    data.certification_level_id &&
                                    data.year_of_study &&
                                    data.session_number
                                        ? "No curriculums found for the selected department and certification level."
                                        : "Select fee plan, academic year, department, certification level, year of study, and session number to load curriculums."}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            allVisibleSelected
                                                        }
                                                        onChange={toggleAll}
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Course
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Curriculum
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Certification Level
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Current Fee Plan
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Year of study
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {rows.map((row) => {
                                                const checked =
                                                    selectedIds.includes(
                                                        String(row.id),
                                                    );

                                                return (
                                                    <tr key={row.id}>
                                                        <td className="px-4 py-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={() =>
                                                                    toggleCurriculum(
                                                                        row.id,
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {row.course_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {
                                                                row.curriculum_name
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {
                                                                row.certification_level_name
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {row.assigned_fee_plan_name ||
                                                                ""}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            Year{" "}
                                                            {row.year_of_study}{" "}
                                                            Session
                                                            {row.session_number}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {row.is_assigned ? (
                                                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                                                    Already
                                                                    assigned
                                                                </span>
                                                            ) : row.has_other_fee_plan ? (
                                                                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                                                    Assigned to
                                                                    another fee
                                                                    plan
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                                    Not assigned
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <InputError
                            message={errors.visible_course_curriculum_ids}
                        />
                        <InputError
                            message={errors.selected_course_curriculum_ids}
                        />

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("fees.assignments.index")}
                                className="rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={
                                    processing ||
                                    !data.visible_course_curriculum_ids.length
                                }
                                type="submit"
                                className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {processing
                                    ? "Saving..."
                                    : "Save Curriculum Assignments"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
