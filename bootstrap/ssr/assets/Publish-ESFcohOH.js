import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "react";
import "lucide-react";
import "react-toastify";
function Publish({ filters, selected_unit, submitted_marks, blocker }) {
  const filterForm = useForm({
    program_version_unit_code: filters.program_version_unit_code || "",
    assessment_type: filters.assessment_type || "theory",
    assessment_number: filters.assessment_number || "1"
  });
  const loadAssessment = (e) => {
    e.preventDefault();
    router.get(
      route("academic.marks.publish.index"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const publishAssessment = (action) => {
    router.post(
      route("academic.marks.publish.assessment"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number,
        action
      },
      {
        preserveScroll: true
      }
    );
  };
  const toggleStudentMark = (markId, action) => {
    router.post(
      route("academic.marks.publish.toggle", markId),
      { action },
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Publish Marks" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "HOD review workspace for publishing or unpublishing marks by unit assessment or by individual student." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Publish Marks" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-8", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: loadAssessment,
              className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2", children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        value: "Program Version Unit Code",
                        required: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: filterForm.data.program_version_unit_code,
                        onChange: (e) => filterForm.setData(
                          "program_version_unit_code",
                          e.target.value.toUpperCase()
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        placeholder: "e.g. ICT101"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: filterForm.errors.program_version_unit_code,
                        className: "mt-2"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Type", required: true }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.assessment_type,
                        onChange: (e) => filterForm.setData(
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
                        value: filterForm.data.assessment_number,
                        onChange: (e) => filterForm.setData(
                          "assessment_number",
                          e.target.value
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
                    selected_unit.code,
                    " - ",
                    selected_unit.name
                  ] }) : "Load a unit assessment to review submitted marks." }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !filterForm.data.program_version_unit_code,
                      className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                      children: "Load Assessment"
                    }
                  )
                ] })
              ]
            }
          ),
          blocker ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }) : null,
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Submitted Assessment Marks" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Publish or unpublish the whole assessment, or control visibility student by student." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => publishAssessment("publish"),
                    disabled: !selected_unit || !submitted_marks.length,
                    className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                    children: "Publish Unit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => publishAssessment("unpublish"),
                    disabled: !selected_unit || !submitted_marks.length,
                    className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60",
                    children: "Unpublish Unit"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,1.2fr,1.2fr,0.6fr,0.8fr,0.9fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("p", { children: "Reg. No." }),
                /* @__PURE__ */ jsx("p", { children: "Student" }),
                /* @__PURE__ */ jsx("p", { children: "Unit" }),
                /* @__PURE__ */ jsx("p", { children: "Marks" }),
                /* @__PURE__ */ jsx("p", { children: "Status" }),
                /* @__PURE__ */ jsx("p", { className: "text-right", children: "Action" })
              ] }),
              submitted_marks.length ? submitted_marks.map((mark) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "grid grid-cols-[1fr,1.2fr,1.2fr,0.6fr,0.8fr,0.9fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-900", children: mark.registration_number }),
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: mark.student_name || "-" }),
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: mark.unit_name || "-" }),
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: mark.marks }),
                    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `rounded-full px-3 py-1 text-xs font-semibold ${mark.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`,
                        children: mark.is_published ? "Published" : "Unpublished"
                      }
                    ) }),
                    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleStudentMark(
                          mark.id,
                          mark.is_published ? "unpublish" : "publish"
                        ),
                        className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
                        children: mark.is_published ? "Unpublish" : "Publish"
                      }
                    ) })
                  ]
                },
                mark.id
              )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-8 text-center text-sm text-zinc-500", children: "No submitted marks found for this assessment yet." })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Publish as default
};
