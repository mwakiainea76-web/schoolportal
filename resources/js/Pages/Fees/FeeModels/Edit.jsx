import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({
    feeModel,
    templates,
    departments,
    curricula,
    academicSessions,
}) {
    const { data, setData, put, processing, errors } = useForm({
        fee_template_id: feeModel.fee_template_id || "",
        scope: feeModel.scope || "global",
        priority: feeModel.priority || "60",
        department_id: feeModel.department_id || "",
        curricula_id: feeModel.curricula_id || "",
        academic_session_id: feeModel.academic_session_id || "",
        valid_from: feeModel.valid_from || "",
        valid_until: feeModel.valid_until || "",
        is_active: feeModel.is_active || false,
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route("fees.models.update", feeModel.id), {
            preserveScroll: true,
        });
    };

    const scopeOptions = [
        { value: "global", label: "Global - Applies to all students" },
        {
            value: "department",
            label: "Department - Applies to specific department",
        },
        {
            value: "curriculum",
            label: "Curriculum - Applies to specific curriculum",
        },
    ];

    const priorityOptions = [
        { value: "60", label: "Low Priority (60)" },
        { value: "70", label: "Medium Priority (70)" },
        { value: "80", label: "High Priority (80)" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Fee Model - ${feeModel.display_name}`} />

            <div className="mx-auto max-w-5xl w-full">
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    {/* FORM GRID */}
                    <div className="space-y-6">
                        {/* BASIC INFO */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <InputLabel value="Fee Template" required />
                                <SearchSelect
                                    routeName="fee-templates.search"
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
                                        setData(
                                            "academic_session_id",
                                            session.id,
                                        )
                                    }
                                    error={errors.academic_session_id}
                                />
                                <InputError
                                    message={errors.academic_session_id}
                                />
                            </div>
                        </div>

                        {/* SCOPE & PRIORITY */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <InputLabel value="Scope" required />
                                <select
                                    name="scope"
                                    value={data.scope}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    {scopeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.scope} />
                            </div>

                            <div>
                                <InputLabel value="Priority" required />
                                <select
                                    name="priority"
                                    value={data.priority}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    {priorityOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.priority} />
                            </div>
                        </div>

                        {/* CONDITIONAL FIELDS BASED ON SCOPE */}
                        {data.scope === "department" && (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
                                    <InputError
                                        message={errors.department_id}
                                    />
                                </div>
                            </div>
                        )}

                        {data.scope === "curriculum" && (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <InputLabel value="Curriculum" required />
                                    <SearchSelect
                                        routeName="courses.curriculum.search"
                                        defaultOptions={curricula}
                                        placeholder="Search curricula..."
                                        value={data.curricula_id}
                                        onChange={(curr) =>
                                            setData("curricula_id", curr.id)
                                        }
                                        error={errors.curricula_id}
                                    />
                                    <InputError message={errors.curricula_id} />
                                </div>
                            </div>
                        )}

                        {/* VALIDITY DATES */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
                            {processing ? "Updating..." : "Update Fee Model"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
