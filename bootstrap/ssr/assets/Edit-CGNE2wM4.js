import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Edit({
  assignment,
  feePlans,
  academicYear,
  curriculums
}) {
  const hasAcademicYears = academicYear.length > 0;
  const hasFeePlans = feePlans.length > 0;
  const hasProgramVersions = curriculums.length > 0;
  const canUpdateAssignment = !!assignment && hasAcademicYears && hasFeePlans && hasProgramVersions;
  const { data, setData, put, processing, errors } = useForm({
    fee_plan_id: assignment.fee_plan_id || "",
    academic_year_id: assignment.academic_year_id || "",
    course_curriculum_id: assignment.course_curriculum_id || "",
    year_of_study: assignment.year_of_study || "",
    session_number: assignment.session_number || ""
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("fees.assignments.update", assignment.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Fee Assignment" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 py-2 text-center text-sm font-medium text-white", children: "Edit Program Version Fee Assignment" }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-8 p-10", onSubmit: submit, children: [
        !canUpdateAssignment ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "You cannot update this fee assignment until an academic year, a fee plan, and a program version mapping are available." }) : null,
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: academicYear,
                value: data.academic_year_id,
                placeholder: "Select year...",
                disabled: !hasAcademicYears,
                onChange: (item) => setData("academic_year_id", item.id)
              }
            ),
            !hasAcademicYears ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create an academic year first to continue." }) : null,
            /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Fee Plan" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "fee-plans.search",
                defaultOptions: feePlans,
                value: data.fee_plan_id,
                placeholder: "Select fee plan...",
                disabled: !hasFeePlans,
                onChange: (item) => setData("fee_plan_id", item.id)
              }
            ),
            !hasFeePlans ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a fee plan first to continue." }) : null,
            /* @__PURE__ */ jsx(InputError, { message: errors.fee_plan_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Program Version" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "program-versions.search",
                defaultOptions: curriculums,
                value: data.course_curriculum_id,
                placeholder: "Select program version...",
                disabled: !hasProgramVersions,
                onChange: (item) => setData("course_curriculum_id", item.id)
              }
            ),
            !hasProgramVersions ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a program version mapping first to continue." }) : null,
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.course_curriculum_id
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Year Of Study" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                value: data.year_of_study,
                onChange: (e) => setData("year_of_study", e.target.value),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.year_of_study })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Session Number" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                value: data.session_number,
                onChange: (e) => setData(
                  "session_number",
                  e.target.value
                ),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.session_number })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.assignments.index"),
              className: "rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing || !canUpdateAssignment,
              type: "submit",
              className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50",
              children: processing ? "Updating..." : "Update Assignment"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Edit as default
};
