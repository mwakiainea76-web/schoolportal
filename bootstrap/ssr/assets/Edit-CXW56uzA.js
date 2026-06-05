import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import axios from "axios";
import { A as AuthenticatedLayout } from "../app.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-8eQtXAlf.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { g as gender_types, r as religion, d as disability_types, m as modules, b as student_status, a as relation_type } from "./constants-Cy-OTT5f.js";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function EditStudent({
  student,
  curriculums = [],
  coursesForVersion = []
}) {
  const existingCurriculumMappingId = student.course_enrollment?.curriculum_mapping_id || student.courseEnrollment?.curriculum_mapping_id || "";
  const existingcourseId = student.course_enrollment?.course_id || student.courseEnrollment?.course_id || student.course_enrollment?.curriculum_mapping?.course?.id || student.courseEnrollment?.curriculumMapping?.course?.id || "";
  const existingExamBodyId = student.course_enrollment?.exam_body_id || student.courseEnrollment?.exam_body_id || student.course_enrollment?.curriculum_mapping?.course?.certification_level?.exam_body_id || student.courseEnrollment?.curriculumMapping?.course?.certificationLevel?.exam_body_id || "";
  const existingCurriculumId = student.course_enrollment?.curriculum_mapping?.curriculum_id || student.courseEnrollment?.curriculumMapping?.curriculum_id || student.course_enrollment?.curriculum_mapping?.curriculum?.id || student.courseEnrollment?.curriculumMapping?.curriculum?.id || "";
  const selectedExamBodyLabel = [
    student.course_enrollment?.exam_body?.code,
    student.course_enrollment?.exam_body?.name,
    student.courseEnrollment?.examBody?.code,
    student.courseEnrollment?.examBody?.name
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
    curriculum_id: existingCurriculumId,
    curriculum_mapping_id: existingCurriculumMappingId,
    study_mode: student.course_enrollment?.study_mode || student.courseEnrollment?.study_mode || "fulltime",
    admission_date: student.admission_date || "",
    current_module: student.current_module || "",
    fee_discount_percentage: student.fee_discount_percentage || "",
    student_status: student.student_status || "active",
    kin_first_name: student.user?.nextofkin?.first_name || "",
    kin_last_name: student.user?.nextofkin?.last_name || "",
    kin_relationship: student.user?.nextofkin?.relationship || "",
    kin_phone: student.user?.nextofkin?.phone_number || "",
    kin_alt_phone: student.user?.nextofkin?.alternate_phone_number || "",
    kin_email: student.user?.nextofkin?.email || ""
  });
  const [curriculumOptions, setCurriculumOptions] = useState(curriculums);
  const [courseOptions, setCourseOptions] = useState(coursesForVersion);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const hasCurriculumMappings = courseOptions.length > 0;
  const hasLockedCourseEnrollment = Boolean(existingCurriculumId);
  const selectedcourseLabel = student.course_enrollment?.course?.display_name || student.courseEnrollment?.course?.display_name || student.course_enrollment?.course?.name || student.courseEnrollment?.course?.name || student.course_enrollment?.curriculum_mapping?.course?.name || student.courseEnrollment?.curriculumMapping?.course?.name || "";
  const selectedCurriculumLabel = student.course_enrollment?.curriculum?.name || student.courseEnrollment?.curriculum?.name || student.course_enrollment?.curriculum_mapping?.curriculum?.name || student.courseEnrollment?.curriculumMapping?.curriculum?.name || "";
  const handleChange = (e) => setData(e.target.name, e.target.value);
  useEffect(() => {
    if (!data.curriculum_id && existingCurriculumId) {
      setData("curriculum_id", existingCurriculumId);
    }
    if (!data.curriculum_mapping_id && existingCurriculumMappingId) {
      setData("curriculum_mapping_id", existingCurriculumMappingId);
    }
  }, [
    data.curriculum_id,
    data.curriculum_mapping_id,
    existingCurriculumId,
    existingCurriculumMappingId,
    setData
  ]);
  useEffect(() => {
    setCurriculumOptions(curriculums);
  }, [curriculums]);
  useEffect(() => {
    setCourseOptions(coursesForVersion);
  }, [coursesForVersion]);
  useEffect(() => {
    if (hasLockedCourseEnrollment) {
      return;
    }
    if (!data.exam_body_id) {
      setCurriculumOptions([]);
      setCourseOptions([]);
      setData({
        ...data,
        curriculum_id: "",
        curriculum_mapping_id: "",
        course_id: ""
      });
      return;
    }
    setLoadingCurriculums(true);
    axios.get(
      route("students.exam-body-curriculums", data.exam_body_id)
    ).then((response) => {
      const versions = response.data ?? [];
      setCurriculumOptions(versions);
      const selectedVersionStillExists = versions.some(
        (curriculum) => String(curriculum.id) === String(data.curriculum_id)
      );
      if (versions.length === 1) {
        const curriculum = versions[0];
        setData({
          ...data,
          curriculum_id: curriculum.id,
          curriculum_mapping_id: "",
          course_id: ""
        });
        return;
      }
      if (!selectedVersionStillExists) {
        setData({
          ...data,
          curriculum_id: "",
          curriculum_mapping_id: "",
          course_id: ""
        });
      }
    }).finally(() => setLoadingCurriculums(false));
  }, [data.exam_body_id, hasLockedCourseEnrollment]);
  useEffect(() => {
    if (hasLockedCourseEnrollment) {
      return;
    }
    if (!data.curriculum_id) {
      setCourseOptions([]);
      setData({
        ...data,
        curriculum_mapping_id: "",
        course_id: ""
      });
      return;
    }
    setLoadingCourses(true);
    axios.get(route("students.cycle-courses", data.curriculum_id)).then((response) => {
      const courses = response.data ?? [];
      setCourseOptions(courses);
      const selectedCourseStillExists = courses.some(
        (course) => String(course.id) === String(data.curriculum_mapping_id)
      );
      if (courses.length === 1) {
        const course = courses[0];
        setData({
          ...data,
          curriculum_mapping_id: course.id,
          course_id: course.course_id ?? ""
        });
        return;
      }
      if (!selectedCourseStillExists) {
        setData({
          ...data,
          curriculum_mapping_id: "",
          course_id: ""
        });
      }
    }).finally(() => setLoadingCourses(false));
  }, [data.curriculum_id, hasLockedCourseEnrollment]);
  const submit = (e) => {
    e.preventDefault();
    put(route("students.update", student.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Student" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-end", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: route("students.admission-letter", student.id),
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm text-white transition hover:bg-sky-700",
          children: "Print Admission Letter"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl pt-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-visible rounded-xl border bg-white shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 p-0", children: [
        /* @__PURE__ */ jsxs("section", { className: "overflow-visible rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-zinc-200 px-5 py-3 text-center", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-800", children: "Personal Details" }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "First Name", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "first_name",
                  value: data.first_name,
                  onChange: handleChange,
                  error: errors.first_name
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.first_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Last Name", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "last_name",
                  value: data.last_name,
                  onChange: handleChange,
                  error: errors.last_name
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.last_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Other Name" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "other_name",
                  value: data.other_name,
                  onChange: handleChange,
                  error: errors.other_name
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.other_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Email", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "email",
                  name: "email",
                  value: data.email,
                  onChange: handleChange,
                  error: errors.email
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Phone Number", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "phone_number",
                  value: data.phone_number,
                  onChange: handleChange,
                  error: errors.phone_number
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.phone_number })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Gender", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: gender_types,
                  value: data.gender,
                  onChange: (gender) => setData("gender", gender.name),
                  error: errors.gender
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Date of Birth", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "date",
                  name: "date_of_birth",
                  value: data.date_of_birth,
                  onChange: handleChange,
                  error: errors.date_of_birth
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.date_of_birth })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "County", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "county",
                  value: data.county,
                  onChange: handleChange,
                  error: errors.county
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.county })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Address", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "address",
                  value: data.address,
                  onChange: handleChange,
                  error: errors.address
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.address })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Religion", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: religion,
                  value: data.religion,
                  onChange: (selectedReligion) => setData(
                    "religion",
                    selectedReligion.name
                  ),
                  error: errors.religion
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.religion })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Medical Condition" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "medical_condition",
                  placeholder: "e.g. Allergies",
                  value: data.medical_condition,
                  onChange: handleChange,
                  error: errors.medical_condition
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.medical_condition
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Person with disability",
                checked: data.is_pwd,
                onChange: (value) => setData("is_pwd", value)
              }
            ) }),
            data.is_pwd && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Disability Type" }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: disability_types,
                  value: data.disability_type,
                  onChange: (disability) => setData(
                    "disability_type",
                    disability.name
                  ),
                  error: errors.disability_type
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.disability_type
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "overflow-visible rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-zinc-200 px-5 py-3 text-center", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-800", children: "Academic Details" }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
            data.exam_body_id && !hasCurriculumMappings && !loadingCourses && !hasLockedCourseEnrollment ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:col-span-2 xl:col-span-3", children: "No active curriculum versions are available for the selected exam body." }) : null,
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Previous School", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "previous_school",
                  placeholder: "e.g. Nairobi School",
                  value: data.previous_school,
                  onChange: handleChange,
                  error: errors.previous_school
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.previous_school
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body", required: true }),
              hasLockedCourseEnrollment ? /* @__PURE__ */ jsx(
                TextInput,
                {
                  value: selectedExamBodyLabel,
                  disabled: true,
                  className: "cursor-not-allowed bg-gray-100"
                }
              ) : /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "exam-bodies.search",
                  defaultOptions: [],
                  value: data.exam_body_id,
                  preloadOptions: true,
                  minSearchLength: 3,
                  onChange: (examBody) => setData({
                    ...data,
                    exam_body_id: examBody.id,
                    curriculum_id: "",
                    curriculum_mapping_id: "",
                    course_id: ""
                  }),
                  placeholder: "Search exam body...",
                  error: errors.exam_body_id
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum", required: true }),
              hasLockedCourseEnrollment ? /* @__PURE__ */ jsx(
                TextInput,
                {
                  value: selectedCurriculumLabel,
                  disabled: true,
                  className: "cursor-not-allowed bg-gray-100"
                }
              ) : /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: curriculumOptions,
                  value: data.curriculum_id,
                  disabled: !data.exam_body_id || loadingCurriculums,
                  onChange: (curriculum) => setData({
                    ...data,
                    curriculum_id: curriculum.id,
                    curriculum_mapping_id: "",
                    course_id: ""
                  }),
                  placeholder: loadingCurriculums ? "Loading curriculums..." : "Select curriculum...",
                  error: errors.curriculum_id
                },
                `curriculum-${data.exam_body_id || data.curriculum_id}-${curriculumOptions.length}`
              ),
              hasLockedCourseEnrollment ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Enrollment exam body and curriculum are locked after admission." }) : data.exam_body_id && curriculumOptions.length > 1 ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Multiple active curriculums exist. Select one for this student." }) : null,
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.curriculum_id
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Course", required: true }),
              hasLockedCourseEnrollment ? /* @__PURE__ */ jsx(
                TextInput,
                {
                  value: selectedcourseLabel,
                  disabled: true,
                  className: "cursor-not-allowed bg-gray-100"
                }
              ) : /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: courseOptions,
                  value: data.curriculum_mapping_id,
                  disabled: !data.curriculum_id || loadingCourses,
                  onChange: (course) => setData({
                    ...data,
                    curriculum_mapping_id: course.id,
                    course_id: course.course_id ?? ""
                  }),
                  placeholder: loadingCourses ? "Loading courses..." : "Select course...",
                  error: errors.curriculum_mapping_id
                },
                `course-${data.curriculum_id || data.curriculum_mapping_id}-${courseOptions.length}`
              ),
              !hasLockedCourseEnrollment && data.curriculum_id && !hasCurriculumMappings && !loadingCourses ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "No active courses are mapped to this curriculum yet." }) : null,
              /* @__PURE__ */ jsx(InputError, { message: errors.course_id }),
              /* @__PURE__ */ jsx(InputError, { message: errors.curriculum_mapping_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Current Module", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: modules,
                  value: data.current_module,
                  onChange: (module) => setData(
                    "current_module",
                    module.name
                  ),
                  error: errors.current_module
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.current_module
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Fee Discount (%)" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "number",
                  name: "fee_discount_percentage",
                  placeholder: "0",
                  min: "0",
                  max: "100",
                  value: data.fee_discount_percentage,
                  onChange: handleChange,
                  error: errors.fee_discount_percentage
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.fee_discount_percentage
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Student Status" }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: student_status,
                  value: data.student_status,
                  onChange: (status) => setData(
                    "student_status",
                    status.name
                  ),
                  error: errors.student_status
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.student_status
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "overflow-visible rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-zinc-200 px-5 py-3 text-center", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-800", children: "Next of Kin" }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "First Name", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "kin_first_name",
                  value: data.kin_first_name,
                  onChange: handleChange,
                  error: errors.kin_first_name
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.kin_first_name
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Last Name", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "kin_last_name",
                  value: data.kin_last_name,
                  onChange: handleChange,
                  error: errors.kin_last_name
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.kin_last_name
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Relationship", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  defaultOptions: relation_type,
                  value: data.kin_relationship,
                  onChange: (relationship) => setData(
                    "kin_relationship",
                    relationship.name
                  ),
                  error: errors.kin_relationship
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.kin_relationship
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Phone", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "kin_phone",
                  value: data.kin_phone,
                  onChange: handleChange,
                  error: errors.kin_phone
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.kin_phone })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Alternative Phone" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "kin_alt_phone",
                  value: data.kin_alt_phone,
                  onChange: handleChange,
                  error: errors.kin_alt_phone
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.kin_alt_phone
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Email" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "kin_email",
                  value: data.kin_email,
                  onChange: handleChange,
                  error: errors.kin_email
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.kin_email })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between px-4 pb-4 pt-0", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("students.index"),
              className: "rounded-lg bg-zinc-400 px-5 py-2 text-sm text-white transition hover:bg-zinc-500",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white border-t-transparent" }),
                "Updating..."
              ] }) : "Update"
            }
          )
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  EditStudent as default
};
