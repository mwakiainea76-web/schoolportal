import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import ToggleSwitch from "@/Components/ToggleSwitch";
import {
    disability_types,
    gender_types,
    modules,
    relation_type,
    religion,
} from "@/constants/constants";

const STORAGE_KEY = "student_form_draft";

export default function CreateStudent({
    courseVersions = [],
    courseCurricula = [],
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        other_name: "",
        email: "",
        phone_number: "",
        gender: "",
        date_of_birth: "",
        county: "",
        address: "",
        religion: "",
        is_pwd: false,
        disability_type: "",
        medical_condition: "",
        previous_school: "",
        course_id: "",
        exam_body_id: "",
        course_version_id: "",
        course_curriculum_id: "",
        current_module: "",
        study_mode: "full_time",
        fee_discount_percentage: "",
        kin_first_name: "",
        kin_last_name: "",
        kin_relationship: "",
        kin_phone: "",
        kin_alt_phone: "",
        kin_email: "",
    });
    const [curriculumOptions, setCurriculumOptions] =
        useState(courseVersions);
    const [loadingCurricula, setLoadingCurricula] = useState(false);
    const hasCourseVersions = curriculumOptions.length > 0;
    const handleChange = (e) => setData(e.target.name, e.target.value);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        setCurriculumOptions(courseVersions);
    }, [courseVersions]);

    useEffect(() => {
        if (!data.course_id) {
            setCurriculumOptions([]);
            setData({
                ...data,
                exam_body_id: "",
                course_version_id: "",
                course_curriculum_id: "",
            });
            return;
        }

        setLoadingCurricula(true);
        axios
            .get(route("students.course-curricula", data.course_id))
            .then((response) => {
                const curricula = response.data ?? [];
                setCurriculumOptions(curricula);

                const selectedCurriculumStillExists = curricula.some(
                    (curriculum) =>
                        String(curriculum.id) ===
                        String(data.course_version_id),
                );

                if (curricula.length === 1) {
                    const curriculum = curricula[0];

                    setData({
                        ...data,
                        exam_body_id: curriculum.exam_body_id ?? data.exam_body_id,
                        course_version_id: curriculum.id,
                        course_curriculum_id:
                            curriculum.course_version_mapping_id ?? "",
                    });
                    return;
                }

                if (!selectedCurriculumStillExists) {
                    setData({
                        ...data,
                        course_version_id: "",
                        course_curriculum_id: "",
                    });
                }
            })
            .finally(() => setLoadingCurricula(false));
    }, [data.course_id]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            Object.entries(JSON.parse(saved)).forEach(([key, value]) =>
                setData(key, value),
            );
        } catch (_) {}
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("students.store"), {
            onSuccess: () => {
                localStorage.removeItem(STORAGE_KEY);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Admission" />

            <div className="mx-auto w-full">
                <div className="rounded-xl pt-2">
                    <div className="overflow-visible rounded-xl border bg-white shadow-sm">
                        <form onSubmit={submit} className="space-y-5 p-0">
                            <section className="overflow-visible rounded-lg">
                                <div className="bg-zinc-200 px-5 py-3 text-center">
                                    <h2 className="text-sm font-semibold text-zinc-800">
                                        Personal Details
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        <div>
                                            <InputLabel value="First Name" required />
                                            <TextInput
                                                name="first_name"
                                                value={data.first_name}
                                                onChange={handleChange}
                                                error={errors.first_name}
                                            />
                                            <InputError message={errors.first_name} />
                                        </div>

                                        <div>
                                            <InputLabel value="Last Name" required />
                                            <TextInput
                                                name="last_name"
                                                value={data.last_name}
                                                onChange={handleChange}
                                                error={errors.last_name}
                                            />
                                            <InputError message={errors.last_name} />
                                        </div>

                                        <div>
                                            <InputLabel value="Other Name" />
                                            <TextInput
                                                name="other_name"
                                                value={data.other_name}
                                                onChange={handleChange}
                                                error={errors.other_name}
                                            />
                                            <InputError message={errors.other_name} />
                                        </div>

                                        <div>
                                            <InputLabel value="Email" required />
                                            <TextInput
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div>
                                            <InputLabel value="Phone Number" required />
                                            <TextInput
                                                name="phone_number"
                                                value={data.phone_number}
                                                onChange={handleChange}
                                                error={errors.phone_number}
                                            />
                                            <InputError message={errors.phone_number} />
                                        </div>

                                        <div>
                                            <InputLabel value="Gender" required />
                                            <SearchSelect
                                                defaultOptions={gender_types}
                                                value={data.gender}
                                                onChange={(gender) =>
                                                    setData("gender", gender.name)
                                                }
                                                error={errors.gender}
                                            />
                                            <InputError message={errors.gender} />
                                        </div>

                                        <div>
                                            <InputLabel value="Date of Birth" required />
                                            <TextInput
                                                type="date"
                                                name="date_of_birth"
                                                value={data.date_of_birth}
                                                onChange={handleChange}
                                                error={errors.date_of_birth}
                                            />
                                            <InputError message={errors.date_of_birth} />
                                        </div>

                                        <div>
                                            <InputLabel value="County" required />
                                            <TextInput
                                                name="county"
                                                value={data.county}
                                                onChange={handleChange}
                                                error={errors.county}
                                            />
                                            <InputError message={errors.county} />
                                        </div>

                                        <div>
                                            <InputLabel value="Address" required />
                                            <TextInput
                                                name="address"
                                                value={data.address}
                                                onChange={handleChange}
                                                error={errors.address}
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <div>
                                            <InputLabel value="Religion" required />
                                            <SearchSelect
                                                defaultOptions={religion}
                                                value={data.religion}
                                                onChange={(selectedReligion) =>
                                                    setData(
                                                        "religion",
                                                        selectedReligion.name,
                                                    )
                                                }
                                                error={errors.religion}
                                            />
                                            <InputError message={errors.religion} />
                                        </div>

                                        <div>
                                            <InputLabel value="Medical Condition" />
                                            <TextInput
                                                name="medical_condition"
                                                placeholder="e.g. Allergies"
                                                value={data.medical_condition}
                                                onChange={handleChange}
                                                error={errors.medical_condition}
                                            />
                                            <InputError
                                                message={errors.medical_condition}
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <ToggleSwitch
                                                label="Person with disability"
                                                checked={data.is_pwd}
                                                onChange={(value) =>
                                                    setData("is_pwd", value)
                                                }
                                            />
                                        </div>

                                        {data.is_pwd && (
                                            <div>
                                                <InputLabel value="Disability Type" />
                                                <SearchSelect
                                                    defaultOptions={disability_types}
                                                    value={data.disability_type}
                                                    onChange={(disability) =>
                                                        setData(
                                                            "disability_type",
                                                            disability.name,
                                                        )
                                                    }
                                                    error={errors.disability_type}
                                                />
                                                <InputError
                                                    message={errors.disability_type}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-visible rounded-lg">
                                <div className="bg-zinc-200 px-5 py-3 text-center">
                                    <h2 className="text-sm font-semibold text-zinc-800">
                                        Academic Details
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {data.course_id &&
                                        !hasCourseVersions &&
                                        !loadingCurricula ? (
                                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:col-span-2 xl:col-span-3">
                                                No active curriculum versions are
                                                available for the selected course.
                                            </div>
                                        ) : null}

                                        <div>
                                            <InputLabel value="Previous School" required />
                                            <TextInput
                                                name="previous_school"
                                                placeholder="e.g. Nairobi School"
                                                value={data.previous_school}
                                                onChange={handleChange}
                                                error={errors.previous_school}
                                            />
                                            <InputError
                                                message={errors.previous_school}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Course" required />
                                            <SearchSelect
                                                routeName="courses.search"
                                                defaultOptions={[]}
                                                value={data.course_id}
                                                preloadOptions
                                                minSearchLength={3}
                                                onChange={(course) =>
                                                    setData({
                                                        ...data,
                                                        course_id: course.id,
                                                        exam_body_id:
                                                            course.exam_body_id ??
                                                            "",
                                                        course_version_id: "",
                                                        course_curriculum_id: "",
                                                    })
                                                }
                                                placeholder="Search course..."
                                                error={errors.course_id}
                                            />
                                            <InputError
                                                message={errors.course_id}
                                            />
                                            <InputError message={errors.exam_body_id} />
                                        </div>

                                        <div>
                                            <InputLabel value="Curriculum" required />
                                            <SearchSelect
                                                key={`curriculum-${data.course_id}-${curriculumOptions.length}`}
                                                defaultOptions={curriculumOptions}
                                                value={data.course_version_id}
                                                disabled={
                                                    !data.course_id ||
                                                    loadingCurricula
                                                }
                                                onChange={(curriculum) =>
                                                    setData({
                                                        ...data,
                                                        course_version_id:
                                                            curriculum.id,
                                                        exam_body_id:
                                                            curriculum.exam_body_id ??
                                                            data.exam_body_id,
                                                        course_curriculum_id:
                                                            curriculum.course_version_mapping_id ??
                                                            "",
                                                    })
                                                }
                                                placeholder={
                                                    loadingCurricula
                                                        ? "Loading curricula..."
                                                        : "Select curriculum..."
                                                }
                                                error={errors.course_version_id}
                                            />
                                            {data.course_id &&
                                            curriculumOptions.length > 1 ? (
                                                <p className="mt-1 text-xs text-amber-600">
                                                    Multiple active curriculum
                                                    versions exist. Select one for
                                                    this student.
                                                </p>
                                            ) : null}
                                            <InputError
                                                message={errors.course_version_id}
                                            />
                                            <InputError
                                                message={errors.course_curriculum_id}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Current Module" required />
                                            <SearchSelect
                                                defaultOptions={modules}
                                                value={data.current_module}
                                                onChange={(module) =>
                                                    setData(
                                                        "current_module",
                                                        module.name,
                                                    )
                                                }
                                                error={errors.current_module}
                                            />
                                            <InputError
                                                message={errors.current_module}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Fee Discount (%)" />
                                            <TextInput
                                                type="number"
                                                name="fee_discount_percentage"
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                                value={data.fee_discount_percentage}
                                                onChange={handleChange}
                                                error={errors.fee_discount_percentage}
                                            />
                                            <InputError
                                                message={
                                                    errors.fee_discount_percentage
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-visible rounded-lg">
                                <div className="bg-zinc-200 px-5 py-3 text-center">
                                    <h2 className="text-sm font-semibold text-zinc-800">
                                        Next of Kin
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        <div>
                                            <InputLabel value="First Name" required />
                                            <TextInput
                                                name="kin_first_name"
                                                value={data.kin_first_name}
                                                onChange={handleChange}
                                                error={errors.kin_first_name}
                                            />
                                            <InputError
                                                message={errors.kin_first_name}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Last Name" required />
                                            <TextInput
                                                name="kin_last_name"
                                                value={data.kin_last_name}
                                                onChange={handleChange}
                                                error={errors.kin_last_name}
                                            />
                                            <InputError
                                                message={errors.kin_last_name}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Relationship" required />
                                            <SearchSelect
                                                defaultOptions={relation_type}
                                                value={data.kin_relationship}
                                                onChange={(relationship) =>
                                                    setData(
                                                        "kin_relationship",
                                                        relationship.name,
                                                    )
                                                }
                                                error={errors.kin_relationship}
                                            />
                                            <InputError
                                                message={errors.kin_relationship}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Phone" required />
                                            <TextInput
                                                name="kin_phone"
                                                value={data.kin_phone}
                                                onChange={handleChange}
                                                error={errors.kin_phone}
                                            />
                                            <InputError message={errors.kin_phone} />
                                        </div>

                                        <div>
                                            <InputLabel value="Alternative Phone" />
                                            <TextInput
                                                name="kin_alt_phone"
                                                value={data.kin_alt_phone}
                                                onChange={handleChange}
                                                error={errors.kin_alt_phone}
                                            />
                                            <InputError
                                                message={errors.kin_alt_phone}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Email" />
                                            <TextInput
                                                name="kin_email"
                                                value={data.kin_email}
                                                onChange={handleChange}
                                                error={errors.kin_email}
                                            />
                                            <InputError message={errors.kin_email} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-between px-4 pb-4 pt-0">
                                <Link
                                    href={route("students.index")}
                                    className="rounded-lg bg-zinc-400 px-5 py-2 text-sm text-white transition hover:bg-zinc-500"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
