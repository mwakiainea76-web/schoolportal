import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({
    templates,
    departments,
    courseCurricula,
    academicSessions,
}) {
    const { data, setData, post, processing, errors } = useForm({
        fee_template_id: "",
        scope: "",
        department_id: "",
        course_curriculum_id: "",
        academic_session_id: "",
        valid_from: "",
        valid_until: "",
        is_active: true,
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.models.store"), {
            preserveScroll: true,
        });
    };

    const scopeOptions = [
        { id: "global", name: "Global - Applies to all students" },
        {
            id: "department",
            name: "Department - Applies to specific department",
        },
        {
            id: "curriculum",
            name: "Curriculum - Applies to specific curriculum",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Fee Model" />

            <div className="mx-auto max-w-5xl w-full">
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Fee Template" required />
                            <SearchSelect
                                routeName="fees.templates.search"
                                defaultOptions={templates}
                                placeholder="Search fee templates..."
                                value={data.fee_template_id}
                                onChange={(template) =>
                                    setData("fee_template_id", template.id)
                                }
                                error={errors.fee_template_id}
                            />
                            <InputError message={errors.fee_template_id} />
                        </div>

                        <div>
                            <InputLabel value="Academic Session" required />
                            <SearchSelect
                                routeName="academic.sessions.search"
                                defaultOptions={academicSessions}
                                placeholder="Search academic sessions..."
                                value={data.academic_session_id}
                                onChange={(session) =>
                                    setData("academic_session_id", session.id)
                                }
                                error={errors.academic_session_id}
                            />
                            <InputError message={errors.academic_session_id} />
                        </div>

                        <div>
                            <InputLabel value="Scope" required />
                            <SearchSelect
                                defaultOptions={scopeOptions}
                                placeholder="Search scope..."
                                value={data.scope}
                                onChange={(opt) => setData("scope", opt.id)}
                                error={errors.scope_id}
                            />
                            <InputError message={errors.scope_id} />
                        </div>

                        {/* CONDITIONAL FIELDS BASED ON SCOPE */}
                        {data.scope === "department" && (
                            <div>
                                <InputLabel value="Department" required />
                                <SearchSelect
                                    routeName="departments.search"
                                    defaultOptions={departments}
                                    placeholder="Search departments..."
                                    value={data.department_id}
                                    onChange={(dept) =>
                                        setData("department_id", dept.id)
                                    }
                                    error={errors.department_id}
                                />
                                <InputError message={errors.department_id} />
                            </div>
                        )}

                        {data.scope === "curriculum" && (
                            <div>
                                <InputLabel
                                    value="Course Curriculum"
                                    required
                                />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={courseCurricula}
                                    placeholder="Search active course curricula..."
                                    value={data.course_curriculum_id}
                                    onChange={(curr) =>
                                        setData("course_curriculum_id", curr.id)
                                    }
                                    error={errors.course_curriculum_id}
                                />
                                <InputError
                                    message={errors.course_curriculum_id}
                                />
                            </div>
                        )}

                        {/* VALIDITY DATES */}

                        <div>
                            <InputLabel value="Valid From" required />
                            <TextInput
                                type="date"
                                name="valid_from"
                                value={data.valid_from}
                                onChange={handleChange}
                                error={errors.valid_from}
                            />
                            <InputError message={errors.valid_from} />
                        </div>

                        <div>
                            <InputLabel value="Valid Until (Optional)" />
                            <TextInput
                                type="date"
                                name="valid_until"
                                value={data.valid_until}
                                onChange={handleChange}
                                error={errors.valid_until}
                            />
                            <InputError message={errors.valid_until} />
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty for no expiration date
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="flex justify-start">
                            <ToggleSwitch
                                label="Active Fee Model"
                                checked={data.is_active}
                                onChange={(val) => setData("is_active", val)}
                            />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-6">
                        <Link
                            href={route("fees.models.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing ? "Creating..." : "Create Fee Model"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
