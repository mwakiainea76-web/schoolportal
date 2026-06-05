import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Publish({
  filters,
  selected_unit,
  submitted_marks,
  blocker,
  filter_options
}) {
  const filterForm = useForm({
    curriculum_unit_code: filters.curriculum_unit_code || "",
    academic_year: filters.academic_year || "",
    module: filters.module || ""
  });
  const marks = submitted_marks?.data ?? [];
  const currentPage = submitted_marks?.current_page ?? 1;
  const lastPage = submitted_marks?.last_page ?? 1;
  const total = submitted_marks?.total ?? 0;
  const academicYears = filter_options?.academic_years ?? [];
  const modules = filter_options?.modules ?? [];
  const loadAssessment = (e) => {
    e.preventDefault();
    router.get(
      route("academic.marks.publish.index"),
      {
        curriculum_unit_code: filterForm.data.curriculum_unit_code,
        academic_year: filterForm.data.academic_year,
        module: filterForm.data.module
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const goToPage = (page) => {
    router.get(
      route("academic.marks.publish.index"),
      {
        curriculum_unit_code: filterForm.data.curriculum_unit_code,
        academic_year: filterForm.data.academic_year,
        module: filterForm.data.module,
        page
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const publishAssessment = (action) => {
    router.post(
      route("academic.marks.publish.assessment"),
      {
        curriculum_unit_code: filterForm.data.curriculum_unit_code,
        academic_year: filterForm.data.academic_year,
        module: filterForm.data.module,
        action
      },
      { preserveScroll: true }
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
                        value: "Curriculum Unit Code",
                        required: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: filterForm.data.curriculum_unit_code,
                        onChange: (e) => filterForm.setData(
                          "curriculum_unit_code",
                          e.target.value.toUpperCase()
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        placeholder: "e.g. ICT101"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: filterForm.errors.curriculum_unit_code,
                        className: "mt-2"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Academic Year" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.academic_year,
                        onChange: (e) => filterForm.setData(
                          "academic_year",
                          e.target.value
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All Years" }),
                          academicYears.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Module" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.module,
                        onChange: (e) => filterForm.setData("module", e.target.value),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All Modules" }),
                          modules.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
                    selected_unit.code,
                    " – ",
                    selected_unit.name
                  ] }) : "Load a unit assessment to review submitted marks." }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !filterForm.data.curriculum_unit_code,
                      className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                      children: "Load Assessment"
                    }
                  )
                ] })
              ]
            }
          ),
          blocker && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }),
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
                    disabled: !selected_unit || !marks.length,
                    className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                    children: "Publish Unit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => publishAssessment("unpublish"),
                    disabled: !selected_unit || !marks.length,
                    className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60",
                    children: "Unpublish Unit"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[60rem] border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Reg. No." }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Student" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Unit" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Marks" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Action" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: marks.length ? marks.map((mark) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "text-sm",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: mark.registration_number }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.student_name || "–" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.unit_name || "–" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-zinc-900", children: mark.marks }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `rounded-full px-3 py-1 text-xs font-semibold ${mark.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`,
                        children: mark.is_published ? "Published" : "Unpublished"
                      }
                    ) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(
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
              )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: "6",
                  className: "px-4 py-8 text-center text-sm text-zinc-500",
                  children: "No submitted marks found for this assessment yet."
                }
              ) }) })
            ] }) }) }),
            lastPage > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                "Showing",
                " ",
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-zinc-800", children: [
                  (currentPage - 1) * 25 + 1,
                  "–",
                  Math.min(currentPage * 25, total)
                ] }),
                " ",
                "of",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-800", children: total }),
                " ",
                "records"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => goToPage(currentPage - 1),
                    disabled: currentPage === 1,
                    className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                    children: "← Prev"
                  }
                ),
                Array.from(
                  { length: lastPage },
                  (_, i) => i + 1
                ).filter(
                  (p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1
                ).reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push("ellipsis-" + p);
                  }
                  acc.push(p);
                  return acc;
                }, []).map(
                  (p) => typeof p === "string" ? /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "px-2 text-sm text-zinc-400",
                      children: "…"
                    },
                    p
                  ) : /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => goToPage(p),
                      className: `rounded-lg border px-3 py-1.5 text-sm font-medium transition ${p === currentPage ? "border-emerald-500 bg-emerald-600 text-white" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`,
                      children: p
                    },
                    p
                  )
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => goToPage(currentPage + 1),
                    disabled: currentPage === lastPage,
                    className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                    children: "Next →"
                  }
                )
              ] })
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
