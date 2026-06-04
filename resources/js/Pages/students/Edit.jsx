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
    student_status,
} from "@/constants/constants";

export default function EditStudent({
    student,
    courseVersions = [],
    coursesForVersion = [],
}) {
    const existingCourseVersionMappingId =
        student.course_enrollment?.course_version_mapping_id ||
        student.courseEnrollment?.course_version_mapping_id ||
        "";

    const existingcourseId =
        student.course_enrollment?.course_id ||
        student.courseEnrollment?.course_id ||
        student.course_enrollment?.course_version_mapping?.course?.id ||
        student.courseEnrollment?.courseVersionMapping?.course?.id ||
        "";

    const existingExamBodyId =
        student.course_enrollment?.exam_body_id ||
        student.courseEnrollment?.exam_body_id ||
        student.course_enrollment?.course_version_mapping?.course
            ?.certification_level?.exam_body_id ||
        student.courseEnrollment?.courseVersionMapping?.course
            ?.certificationLevel?.exam_body_id ||
        "";

    const existingCourseVersionId =
        student.course_enrollment?.course_version_mapping
            ?.course_version_id ||
        student.courseEnrollment?.courseVersionMapping?.course_version_id ||
        student.course_enrollment?.course_version_mapping?.courseVersion
            ?.id ||
        student.courseEnrollment?.courseVersionMapping?.courseVersion?.id ||
        "";

    const selectedExamBodyLabel =
        [
            student.course_enrollment?.exam_body?.code,
            student.course_enrollment?.exam_body?.name,
            student.courseEnrollment?.examBody?.code,
            student.courseEnrollment?.examBody?.name,
        ].filter(Boolean).join(" - ") || "";

    const { data, setData, put, processing, errors } = useForm({
        first_name: student.user?.first_name || "",
        last_name: student.user?.last_name || "",
        other_name: student.user?.other_name || "",
        email: student.user?.email || "",
        phone_number: student.user?.phone_number || "",
        gender: student.user?.gender || "",
        date_of_birth: student.user?.date_of_birth || "",
        county: student.user?.county || "",
        address: student.user?.address || "",
        religion: student.user?.religion || "",
        is_pwd: student.user?.is_pwd ?? false,
        disability_type: student.user?.disability_type || "",
        medical_condition: student.user?.medical_condition || "",
        previous_school: student.previous_school || "",
        course_id: existingcourseId,
        exam_body_id: existingExamBodyId,
        course_version_id: existingCourseVersionId,
        course_curriculum_id: existingCourseVersionMappingId,
        study_mode:
            student.course_enrollment?.study_mode ||
            student.courseEnrollment?.study_mode ||
            "fulltime",
        admission_date: student.admission_date || "",
        current_module: student.current_module || "",
        fee_discount_percentage: student.fee_discount_percentage || "",
        student_status: student.student_status || "active",
        kin_first_name: student.user?.nextofkin?.first_name || "",
        kin_last_name: student.user?.nextofkin?.last_name || "",
        kin_relationship: student.user?.nextofkin?.relationship || "",
        kin_phone: student.user?.nextofkin?.phone_number || "",
        kin_alt_phone:
            student.user?.nextofkin?.alternate_phone_number || "",
        kin_email: student.user?.nextofkin?.email || "",
    });
    const [courseVersionOptions, setCourseVersionOptions] =
        useState(courseVersions);
    const [courseOptions, setCourseOptions] = useState(coursesForVersion);
    const [loadingCourseVersions, setLoadingCourseVersions] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const hasCourseVersionMappings = courseOptions.length > 0;
    const hasLockedCourseEnrollment = Boolean(existingCourseVersionId);
    const selectedcourseLabel =
        student.course_enrollment?.course?.display_name ||
        student.courseEnrollment?.course?.display_name ||
        student.course_enrollment?.course?.name ||
        student.courseEnrollment?.course?.name ||
        student.course_enrollment?.course_version_mapping?.course?.name ||
        student.courseEnrollment?.courseVersionMapping?.course?.name ||
        "";
    const selectedCourseVersionLabel =
        student.course_enrollment?.course_version?.name ||
        student.courseEnrollment?.courseVersion?.name ||
        student.course_enrollment?.course_version_mapping?.course_version
            ?.name ||
        student.courseEnrollment?.courseVersionMapping?.courseVersion?.name ||
        "";
    const handleChange = (e) => setData(e.target.name, e.target.value);

    useEffect(() => {
        if (!data.course_version_id && existingCourseVersionId) {
            setData("course_version_id", existingCourseVersionId);
        }

        if (!data.course_curriculum_id && existingCourseVersionMappingId) {
            setData("course_curriculum_id", existingCourseVersionMappingId);
        }
    }, [
        data.course_version_id,
        data.course_curriculum_id,
        existingCourseVersionId,
        existingCourseVersionMappingId,
        setData,
    ]);

    useEffect(() => {
        setCourseVersionOptions(courseVersions);
    }, [courseVersions]);

    useEffect(() => {
        setCourseOptions(coursesForVersion);
    }, [coursesForVersion]);

    useEffect(() => {
        if (hasLockedCourseEnrollment) {
            return;
        }

        if (!data.exam_body_id) {
            setCourseVersionOptions([]);
            setCourseOptions([]);
            setData({
                ...data,
                course_version_id: "",
                course_curriculum_id: "",
                course_id: "",
            });
            return;
        }

        setLoadingCourseVersions(true);
        axios
            .get(
                route("students.exam-body-course-versions", data.exam_body_id),
            )
            .then((response) => {
                const versions = response.data ?? [];
                setCourseVersionOptions(versions);

                const selectedVersionStillExists = versions.some(
                    (courseVersion) =>
                        String(courseVersion.id) ===
                        String(data.course_version_id),
                );

                if (versions.length === 1) {
                    const courseVersion = versions[0];

                    setData({
                        ...data,
                        course_version_id: courseVersion.id,
                        course_curriculum_id: "",
                        course_id: "",
                    });
                    return;
                }

                if (!selectedVersionStillExists) {
                    setData({
                        ...data,
                        course_version_id: "",
                        course_curriculum_id: "",
                        course_id: "",
                    });
                }
            })
            .finally(() => setLoadingCourseVersions(false));
    }, [data.exam_body_id, hasLockedCourseEnrollment]);

    useEffect(() => {
        if (hasLockedCourseEnrollment) {
            return;
        }

        if (!data.course_version_id) {
            setCourseOptions([]);
            setData({
                ...data,
                course_curriculum_id: "",
                course_id: "",
            });
            return;
        }

        setLoadingCourses(true);
        axios
            .get(route("students.cycle-courses", data.course_version_id))
            .then((response) => {
                const courses = response.data ?? [];
                setCourseOptions(courses);

                const selectedCourseStillExists = courses.some(
                    (course) =>
                        String(course.id) === String(data.course_curriculum_id),
                );

                if (courses.length === 1) {
                    const course = courses[0];

                    setData({
                        ...data,
                        course_curriculum_id: course.id,
                        course_id: course.course_id ?? "",
                    });
                    return;
                }

                if (!selectedCourseStillExists) {
                    setData({
                        ...data,
                        course_curriculum_id: "",
                        course_id: "",
                    });
                }
            })
            .finally(() => setLoadingCourses(false));
    }, [data.course_version_id, hasLockedCourseEnrollment]);

    const submit = (e) => {
        e.preventDefault();
        put(route("students.update", student.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Student" />

            <div className="mx-auto w-full">
                <div className="mb-4 flex justify-end">
                    <a
                        href={route("students.admission-letter", student.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm text-white transition hover:bg-sky-700"
                    >
                        Print Admission Letter
                    </a>
                </div>

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
                                        {data.exam_body_id &&
                                        !hasCourseVersionMappings &&
                                        !loadingCourses &&
                                        !hasLockedCourseEnrollment ? (
                                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:col-span-2 xl:col-span-3">
                                                No active curriculum versions are
                                                available for the selected exam body.
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
                                            <InputLabel value="Exam Body" required />
                                            {hasLockedCourseEnrollment ? (
                                                <TextInput
                                                    value={selectedExamBodyLabel}
                                                    disabled
                                                    className="cursor-not-allowed bg-gray-100"
                                                />
                                            ) : (
                                                <SearchSelect
                                                    routeName="exam-bodies.search"
                                                    defaultOptions={[]}
                                                    value={data.exam_body_id}
                                                    preloadOptions
                                                    minSearchLength={3}
                                                    onChange={(examBody) =>
                                                        setData({
                                                            ...data,
                                                            exam_body_id: examBody.id,
                                                            course_version_id: "",
                                                            course_curriculum_id: "",
                                                            course_id: "",
                                                        })
                                                    }
                                                    placeholder="Search exam body..."
                                                    error={errors.exam_body_id}
                                                />
                                            )}
                                            <InputError message={errors.exam_body_id} />
                                        </div>

                                        <div>
                                            <InputLabel value="Course Version" required />
                                            {hasLockedCourseEnrollment ? (
                                                <TextInput
                                                    value={selectedCourseVersionLabel}
                                                    disabled
                                                    className="cursor-not-allowed bg-gray-100"
                                                />
                                            ) : (
                                                <SearchSelect
                                                    key={`course-version-${data.exam_body_id || data.course_version_id}-${courseVersionOptions.length}`}
                                                    defaultOptions={courseVersionOptions}
                                                    value={data.course_version_id}
                                                    disabled={
                                                        !data.exam_body_id ||
                                                        loadingCourseVersions
                                                    }
                                                    onChange={(courseVersion) =>
                                                        setData({
                                                            ...data,
                                                            course_version_id:
                                                                courseVersion.id,
                                                            course_curriculum_id: "",
                                                            course_id: "",
                                                        })
                                                    }
                                                    placeholder={
                                                        loadingCourseVersions
                                                            ? "Loading course versions..."
                                                            : "Select course version..."
                                                    }
                                                    error={errors.course_version_id}
                                                />
                                            )}
                                            {hasLockedCourseEnrollment ? (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Enrollment exam body and course version are locked after admission.
                                                </p>
                                            ) : data.exam_body_id &&
                                              courseVersionOptions.length > 1 ? (
                                                <p className="mt-1 text-xs text-amber-600">
                                                    Multiple active course versions exist. Select one for this student.
                                                </p>
                                            ) : null}
                                            <InputError
                                                message={errors.course_version_id}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Course" required />
                                            {hasLockedCourseEnrollment ? (
                                                <TextInput
                                                    value={selectedcourseLabel}
                                                    disabled
                                                    className="cursor-not-allowed bg-gray-100"
                                                />
                                            ) : (
                                                <SearchSelect
                                                    key={`course-${data.course_version_id || data.course_curriculum_id}-${courseOptions.length}`}
                                                    defaultOptions={courseOptions}
                                                    value={data.course_curriculum_id}
                                                    disabled={
                                                        !data.course_version_id ||
                                                        loadingCourses
                                                    }
                                                    onChange={(course) =>
                                                        setData({
                                                            ...data,
                                                            course_curriculum_id:
                                                                course.id,
                                                            course_id:
                                                                course.course_id ?? "",
                                                        })
                                                    }
                                                    placeholder={
                                                        loadingCourses
                                                            ? "Loading courses..."
                                                            : "Select course..."
                                                    }
                                                    error={errors.course_curriculum_id}
                                                />
                                            )}
                                            {!hasLockedCourseEnrollment &&
                                            data.course_version_id &&
                                            !hasCourseVersionMappings &&
                                            !loadingCourses ? (
                                                <p className="mt-1 text-xs text-amber-600">
                                                    No active courses are mapped to
                                                    this course version yet.
                                                </p>
                                            ) : null}
                                            <InputError message={errors.course_id} />
                                            <InputError message={errors.course_curriculum_id} />
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

                                        <div>
                                            <InputLabel value="Student Status" />
                                            <SearchSelect
                                                defaultOptions={student_status}
                                                value={data.student_status}
                                                onChange={(status) =>
                                                    setData(
                                                        "student_status",
                                                        status.name,
                                                    )
                                                }
                                                error={errors.student_status}
                                            />
                                            <InputError
                                                message={errors.student_status}
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
                                            Updating...
                                        </>
                                    ) : (
                                        "Update"
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
