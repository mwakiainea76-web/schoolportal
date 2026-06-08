import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "react";
import "ziggy-js";
function Add({
  filters,
  selected_unit,
  unit_options,
  blocker,
  can_publish
}) {
  const form = useForm({
    curriculum_unit_id: filters.curriculum_unit_id || "",
    assessment_type: filters.assessment_type || "theory",
    assessment_number: filters.assessment_number || "1",
    student_identifier: "",
    marks: ""
  });
  const submit = (e) => {
    e.preventDefault();
    form.post(route("academic.marks.add.store"), {
      preserveScroll: true,
      onSuccess: () => {
        form.setData("student_identifier", "");
        form.setData("marks", "");
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Marks" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl space-y-8", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
        children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800", children: "Theory assessments can have multiple tests. Use the assessment number to separate Test 1, Test 2, and later entries for the same unit." }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Unit", required: true }),
              /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "units.search",
                  defaultOptions: unit_options,
                  value: form.data.curriculum_unit_id,
                  selectedLabel: selected_unit ? selected_unit.display_name : null,
                  placeholder: "Search unit...",
                  preloadOptions: true,
                  onChange: (unit) => form.setData(
                    "curriculum_unit_id",
                    unit.id || ""
                  ),
                  error: form.errors.curriculum_unit_id
                }
              ) }),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.curriculum_unit_id,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Type", required: true }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: form.data.assessment_type,
                  onChange: (e) => form.setData(
                    "assessment_type",
                    e.target.value
                  ),
                  className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "theory", children: "Theory" }),
                    /* @__PURE__ */ jsx("option", { value: "practical", children: "Practical" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Number", required: true }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "1",
                  value: form.data.assessment_number,
                  onChange: (e) => form.setData(
                    "assessment_number",
                    e.target.value
                  ),
                  className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Admission Number / Student ID", required: true }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.data.student_identifier,
                  onChange: (e) => form.setData(
                    "student_identifier",
                    e.target.value
                  ),
                  className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  placeholder: "Student ID or TVET/..."
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.student_identifier,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Marks", required: true }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  max: "100",
                  step: "1",
                  value: form.data.marks,
                  onChange: (e) => form.setData("marks", e.target.value),
                  className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  placeholder: "0 - 100"
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.marks,
                  className: "mt-2"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600", children: selected_unit ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
              selected_unit.code,
              " - ",
              selected_unit.name
            ] }),
            " | ",
            "Module ",
            selected_unit.module,
            " | ",
            selected_unit.course,
            " | ",
            selected_unit.version
          ] }) : "Select the unit, assessment type, and assessment number once, then keep entering students and marks." }),
          blocker && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("dashboard"),
                className: "rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: form.processing || !form.data.curriculum_unit_id,
                className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                children: form.processing ? "Saving..." : "Save Marks"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  Add as default
};
