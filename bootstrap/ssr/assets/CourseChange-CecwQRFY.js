import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function CourseChange({
  filters,
  student,
  lookupError,
  courseCurricula,
  latestTransfer
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const lookupForm = useForm({
    registration_number: filters.registration_number || ""
  });
  const transferForm = useForm({
    registration_number: filters.registration_number || "",
    new_course_version_mapping_id: "",
    notes: ""
  });
  useEffect(() => {
    transferForm.setData("registration_number", filters.registration_number || "");
  }, [filters.registration_number]);
  const selectedCourse = courseCurricula.find(
    (course) => String(course.id) === String(transferForm.data.new_course_version_mapping_id)
  );
  const isSameCourse = student && selectedCourse && Number(student.current_course_version_mapping_id) === Number(selectedCourse.id);
  const lookupStudent = (e) => {
    e.preventDefault();
    router.get(
      route("students.course-change.index"),
      {
        registration_number: lookupForm.data.registration_number
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
    setShowConfirm(false);
  };
  const submitTransfer = (e) => {
    e.preventDefault();
    transferForm.post(route("students.course-change.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowConfirm(false);
        transferForm.reset("new_course_version_mapping_id", "notes");
        lookupForm.reset("registration_number");
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Student Course Change" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Transfer a student into another active course while keeping enrolment and login history intact." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Student Course Change" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [
          latestTransfer ? /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-900 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Course change completed" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Info, { label: "Old admission number", value: latestTransfer.old_registration_number }),
              /* @__PURE__ */ jsx(Info, { label: "New admission number", value: latestTransfer.new_registration_number }),
              /* @__PURE__ */ jsx(Info, { label: "Old course", value: latestTransfer.old_course }),
              /* @__PURE__ */ jsx(Info, { label: "New course", value: latestTransfer.new_course }),
              /* @__PURE__ */ jsx(Info, { label: "New username", value: latestTransfer.username })
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: lookupStudent, className: "grid gap-4 md:grid-cols-[1fr,auto] md:items-end", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Existing Registration Number", required: true }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: lookupForm.data.registration_number,
                    onChange: (e) => lookupForm.setData(
                      "registration_number",
                      e.target.value.toUpperCase()
                    ),
                    className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    placeholder: "STD/2026/05/0001"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: lookupForm.errors.registration_number, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700",
                  children: "Look Up Student"
                }
              )
            ] }),
            lookupError ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700", children: lookupError }) : null
          ] }),
          student ? /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Confirm Student" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Info, { label: "Full name", value: student.full_name }),
              /* @__PURE__ */ jsx(Info, { label: "Current course", value: student.current_course }),
              /* @__PURE__ */ jsx(Info, { label: "Current admission number", value: student.current_admission_number }),
              /* @__PURE__ */ jsx(Info, { label: "Current enrolment status", value: student.current_enrolment_status })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitTransfer, className: "mt-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "New Course", required: true }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: transferForm.data.new_course_version_mapping_id,
                    onChange: (e) => {
                      transferForm.setData(
                        "new_course_version_mapping_id",
                        e.target.value
                      );
                      setShowConfirm(false);
                    },
                    className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select a new course" }),
                      courseCurricula.map((course) => /* @__PURE__ */ jsx("option", { value: course.id, children: course.name }, course.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: transferForm.errors.new_course_version_mapping_id, className: "mt-2" }),
                isSameCourse ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: "New course must differ from current course." }) : null
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Notes" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: transferForm.data.notes,
                    onChange: (e) => transferForm.setData("notes", e.target.value),
                    className: "mt-2 min-h-24 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    placeholder: "Optional reason or approval reference"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: transferForm.errors.notes, className: "mt-2" })
              ] }),
              selectedCourse && !isSameCourse ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Transfer summary" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-2", children: [
                  student.current_course,
                  " → ",
                  selectedCourse.name
                ] })
              ] }) : null,
              showConfirm ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl bg-zinc-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-600", children: "Confirming will deactivate the old login, create a new student login, and record an audit trail." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: transferForm.processing || isSameCourse,
                    className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60",
                    children: transferForm.processing ? "Processing..." : "Confirm Course Change"
                  }
                )
              ] }) : /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  disabled: !selectedCourse || isSameCourse,
                  onClick: () => setShowConfirm(true),
                  className: "rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60",
                  children: "Review Change"
                }
              ) })
            ] })
          ] }) : null
        ] })
      ]
    }
  );
}
function Info({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: value || "-" })
  ] });
}
export {
  CourseChange as default
};
