import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import axios from "axios";
import { A as AuthenticatedLayout } from "../app.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { g as gender_types, r as religion, d as disability_types, m as modules, a as relation_type } from "./constants-Cy-OTT5f.js";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
const STORAGE_KEY = "student_form_draft";
function CreateStudent({
  courseVersions = [],
  courseCurricula = []
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
    kin_email: ""
  });
  const [curriculumOptions, setCurriculumOptions] = useState(courseVersions);
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
        course_curriculum_id: ""
      });
      return;
    }
    setLoadingCurricula(true);
    axios.get(route("students.course-curricula", data.course_id)).then((response) => {
      const curricula = response.data ?? [];
      setCurriculumOptions(curricula);
      const selectedCurriculumStillExists = curricula.some(
        (curriculum) => String(curriculum.id) === String(data.course_version_id)
      );
      if (curricula.length === 1) {
        const curriculum = curricula[0];
        setData({
          ...data,
          exam_body_id: curriculum.exam_body_id ?? data.exam_body_id,
          course_version_id: curriculum.id,
          course_curriculum_id: curriculum.course_version_mapping_id ?? ""
        });
        return;
      }
      if (!selectedCurriculumStillExists) {
        setData({
          ...data,
          course_version_id: "",
          course_curriculum_id: ""
        });
      }
    }).finally(() => setLoadingCurricula(false));
  }, [data.course_id]);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      Object.entries(JSON.parse(saved)).forEach(
        ([key, value]) => setData(key, value)
      );
    } catch (_) {
    }
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("students.store"), {
      onSuccess: () => {
        localStorage.removeItem(STORAGE_KEY);
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Student Admission" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl pt-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-visible rounded-xl border bg-white shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 p-0", children: [
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
          data.course_id && !hasCourseVersions && !loadingCurricula ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:col-span-2 xl:col-span-3", children: "No active curriculum versions are available for the selected course." }) : null,
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
            /* @__PURE__ */ jsx(InputLabel, { value: "Course", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "courses.search",
                defaultOptions: [],
                value: data.course_id,
                preloadOptions: true,
                minSearchLength: 3,
                onChange: (course) => setData({
                  ...data,
                  course_id: course.id,
                  exam_body_id: course.exam_body_id ?? "",
                  course_version_id: "",
                  course_curriculum_id: ""
                }),
                placeholder: "Search course...",
                error: errors.course_id
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.course_id
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: curriculumOptions,
                value: data.course_version_id,
                disabled: !data.course_id || loadingCurricula,
                onChange: (curriculum) => setData({
                  ...data,
                  course_version_id: curriculum.id,
                  exam_body_id: curriculum.exam_body_id ?? data.exam_body_id,
                  course_curriculum_id: curriculum.course_version_mapping_id ?? ""
                }),
                placeholder: loadingCurricula ? "Loading curricula..." : "Select curriculum...",
                error: errors.course_version_id
              },
              `curriculum-${data.course_id}-${curriculumOptions.length}`
            ),
            data.course_id && curriculumOptions.length > 1 ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Multiple active curriculum versions exist. Select one for this student." }) : null,
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.course_version_id
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.course_curriculum_id
              }
            )
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
              "Saving..."
            ] }) : "Submit"
          }
        )
      ] })
    ] }) }) }) })
  ] });
}
export {
  CreateStudent as default
};
