import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react-dom/client";
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
  const rows = results?.data ?? [];
  const currentPage = results?.current_page ?? 1;
  const lastPage = results?.last_page ?? 1;
  const total = results?.total ?? 0;
  const groupedUnits = Object.values(
    rows.reduce((acc, result) => {
      const key = `${result.unit_code}||${result.unit_name}`;
      if (!acc[key]) {
        acc[key] = {
          module: result.module,
          year_of_study: result.year_of_study,
          unit_code: result.unit_code,
          unit_name: result.unit_name,
          theory: [],
          practical: []
        };
      }
      if (result.mark_type === "theory") {
        acc[key].theory.push(result.marks);
      } else if (result.mark_type === "practical") {
        acc[key].practical.push(result.marks);
      }
      return acc;
    }, {})
  );
  const avg = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
  const updateFilter = (field, value) => {
    router.get(
      route("student.results.index"),
      {
        module: field === "module" ? value || void 0 : filters.module || void 0,
        year_of_study: field === "year_of_study" ? value || void 0 : filters.year_of_study || void 0
      },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  const resetFilters = () => {
    router.get(
      route("student.results.index"),
      {},
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  const goToPage = (page) => {
    router.get(
      route("student.results.index"),
      {
        module: filters.module || void 0,
        year_of_study: filters.year_of_study || void 0,
        page
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const MarksCell = ({ markArr, colorClass }) => {
    if (markArr.length === 0) {
      return /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400", children: "–" });
    }
    const average = avg(markArr);
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      markArr.map((mark, idx) => /* @__PURE__ */ jsx(
        "span",
        {
          className: `rounded px-2 py-1 text-sm font-semibold ${colorClass}`,
          children: mark
        },
        idx
      )),
      markArr.length > 1 && average !== null && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-red-700", children: [
        "Avg: ",
        average
      ] })
    ] });
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
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: student?.admission_number || "–" })
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
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Marks are shown for both theory and practical assessments. Multiple marks per unit are averaged." })
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
                        filter_options.modules.map((opt) => /* @__PURE__ */ jsx(
                          "option",
                          {
                            value: opt.value,
                            children: opt.label
                          },
                          opt.value
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
                          (opt) => /* @__PURE__ */ jsx(
                            "option",
                            {
                              value: opt.value,
                              children: opt.label
                            },
                            opt.value
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
            /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-x-auto rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-zinc-50", children: [
                /* @__PURE__ */ jsx("th", { className: "min-w-[100px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Module" }),
                /* @__PURE__ */ jsx("th", { className: "min-w-[80px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Year" }),
                /* @__PURE__ */ jsx("th", { className: "min-w-[200px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Unit" }),
                /* @__PURE__ */ jsx("th", { className: "min-w-[180px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Theory Marks" }),
                /* @__PURE__ */ jsx("th", { className: "min-w-[180px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Practical Marks" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: groupedUnits.length ? groupedUnits.map((unit) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "border-t border-zinc-100 bg-white hover:bg-zinc-50",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-700", children: unit.module ? `Module ${unit.module}` : "–" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-700", children: unit.year_of_study ? `Year ${unit.year_of_study}` : "–" }),
                    /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-zinc-900", children: unit.unit_code || "–" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: unit.unit_name || "–" })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                      MarksCell,
                      {
                        markArr: unit.theory,
                        colorClass: "bg-blue-50 text-blue-700"
                      }
                    ) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                      MarksCell,
                      {
                        markArr: unit.practical,
                        colorClass: "bg-emerald-50 text-emerald-700"
                      }
                    ) })
                  ]
                },
                `${unit.unit_code}||${unit.unit_name}`
              )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: 5,
                  className: "px-4 py-10 text-center text-sm text-zinc-500",
                  children: "No recorded marks match the selected filter yet."
                }
              ) }) })
            ] }) }),
            lastPage > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                "Showing",
                " ",
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-zinc-800", children: [
                  (currentPage - 1) * 30 + 1,
                  "–",
                  Math.min(currentPage * 30, total)
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
  StudentResults as default
};
