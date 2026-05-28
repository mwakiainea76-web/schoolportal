import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import "react";
import "lucide-react";
import "react-toastify";
function StudentResults({
  student,
  filters,
  filter_options,
  summary,
  results
}) {
  const updateFilter = (field, value) => {
    router.get(
      route("student.results.index"),
      {
        module: field === "module" ? value || void 0 : filters.module || void 0,
        year_of_study: field === "year_of_study" ? value || void 0 : filters.year_of_study || void 0
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      }
    );
  };
  const resetFilters = () => {
    router.get(
      route("student.results.index"),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "My Results" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "View all recorded marks and filter them by module or year of study." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "My Results" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Student" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-xl font-semibold text-zinc-900", children: student?.name || "Student" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: student?.registration_number || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Total Marks" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-zinc-900", children: summary.published_count }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Recorded marks (theory & practical)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Filtered View" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-zinc-900", children: summary.filtered_count }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Results in the current view" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "My Results" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "View all recorded marks and filter them by module or year of study. Marks are shown for both theory and practical assessments." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:min-w-[26rem]", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Module" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: filters.module || "",
                      onChange: (e) => updateFilter("module", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All modules" }),
                        filter_options.modules.map((option) => /* @__PURE__ */ jsx(
                          "option",
                          {
                            value: option.value,
                            children: option.label
                          },
                          option.value
                        ))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Year of Study" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: filters.year_of_study || "",
                      onChange: (e) => updateFilter(
                        "year_of_study",
                        e.target.value
                      ),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All years" }),
                        filter_options.years_of_study.map(
                          (option) => /* @__PURE__ */ jsx(
                            "option",
                            {
                              value: option.value,
                              children: option.label
                            },
                            option.value
                          )
                        )
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: resetFilters,
                className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                children: "Reset Filters"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,0.65fr,0.75fr,1.3fr,0.75fr,0.75fr,0.75fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("p", { children: "Session" }),
                /* @__PURE__ */ jsx("p", { children: "Year" }),
                /* @__PURE__ */ jsx("p", { children: "Module" }),
                /* @__PURE__ */ jsx("p", { children: "Unit" }),
                /* @__PURE__ */ jsx("p", { children: "Assessment" }),
                /* @__PURE__ */ jsx("p", { children: "Theory" }),
                /* @__PURE__ */ jsx("p", { children: "Practical" })
              ] }),
              results.length ? results.map((result) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "grid grid-cols-[1fr,0.65fr,0.75fr,1.3fr,0.75fr,0.75fr,0.75fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: result.session }),
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: result.year_of_study ? `Year ${result.year_of_study}` : "-" }),
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: result.module ? `Module ${result.module}` : "-" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: result.unit_code || "-" }),
                      /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: result.unit_name || "-" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-zinc-700", children: [
                      "Assessment ",
                      result.assessment_number
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: result.theory_marks ?? "-" }),
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: result.practical_marks ?? "-" })
                  ]
                },
                result.id
              )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-10 text-center text-sm text-zinc-500", children: "No recorded marks match the selected filter yet." })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  StudentResults as default
};
