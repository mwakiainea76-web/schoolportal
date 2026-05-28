import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useEffect } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "lucide-react";
import "react-toastify";
function Marksheet({
  filters,
  selected_unit,
  available_sessions,
  available_years,
  marksheet_data,
  blocker
}) {
  const filterForm = useForm({
    program_version_unit_code: filters.program_version_unit_code || "",
    session_number: filters.session_number || "",
    year_of_study: filters.year_of_study || "",
    registration_number: filters.registration_number || ""
  });
  useEffect(() => {
    filterForm.setData({
      program_version_unit_code: filters.program_version_unit_code || "",
      session_number: filters.session_number || "",
      year_of_study: filters.year_of_study || "",
      registration_number: filters.registration_number || ""
    });
  }, [filters]);
  const loadMarksheet = (e) => {
    e.preventDefault();
    router.get(
      route("academic.marks.marksheet.index"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        session_number: filterForm.data.session_number,
        year_of_study: filterForm.data.year_of_study,
        registration_number: filterForm.data.registration_number
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const resetFilters = () => {
    router.get(
      route("academic.marks.marksheet.index"),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      }
    );
  };
  const performersTable = (performers, assessmentType) => /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-zinc-200 bg-zinc-50", children: [
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-zinc-900", children: "Rank" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-zinc-900", children: "Registration Number" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-zinc-900", children: "Student Name" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-zinc-900", children: "Marks" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-zinc-900", children: "Year of Study" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: performers.length > 0 ? performers.map((performer, index) => /* @__PURE__ */ jsxs(
      "tr",
      {
        className: "border-b border-zinc-100 hover:bg-zinc-50",
        children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-semibold text-zinc-900", children: [
            "#",
            index + 1
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-zinc-700", children: performer.registration_number }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: performer.student_name }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-emerald-700", children: performer.marks }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-zinc-700", children: [
            "Year ",
            performer.year_of_study || "-"
          ] })
        ]
      },
      index
    )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
      "td",
      {
        colSpan: "5",
        className: "px-4 py-8 text-center text-zinc-500",
        children: [
          "No ",
          assessmentType.toLowerCase(),
          " marks available"
        ]
      }
    ) }) })
  ] }) });
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Marks Per Unit - Marksheet" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "View top performers for a unit. Filter by session, year of study, or registration number to narrow results." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Unit Marksheet" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-8", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: loadMarksheet,
              className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800", children: "Enter a unit code to view the marksheet with top 3 performers in theory and practical assessments." }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2", children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        value: "Unit Code",
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
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400",
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
                    /* @__PURE__ */ jsx(InputLabel, { value: "Session Number" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.session_number || "",
                        onChange: (e) => filterForm.setData(
                          "session_number",
                          e.target.value
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All sessions" }),
                          available_sessions.map((option) => /* @__PURE__ */ jsx(
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
                    /* @__PURE__ */ jsx(InputLabel, { value: "Year of Study" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.year_of_study || "",
                        onChange: (e) => filterForm.setData(
                          "year_of_study",
                          e.target.value
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All years" }),
                          available_years.map((option) => /* @__PURE__ */ jsx(
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
                    /* @__PURE__ */ jsx(InputLabel, { value: "Registration Number" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: filterForm.data.registration_number,
                        onChange: (e) => filterForm.setData(
                          "registration_number",
                          e.target.value.toUpperCase()
                        ),
                        className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400",
                        placeholder: "e.g. REG001"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700",
                      children: "Load Marksheet"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: resetFilters,
                      className: "rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50",
                      children: "Reset Filters"
                    }
                  )
                ] })
              ]
            }
          ),
          blocker && /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-red-200 bg-red-50 p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800", children: blocker }) }),
          selected_unit && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: selected_unit.code }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-600", children: selected_unit.name })
          ] }),
          selected_unit && !blocker && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-900", children: "Theory Assessment" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-600", children: "Top 3 performers" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Average Score" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-semibold text-blue-600", children: marksheet_data.theory?.average || 0 })
                ] })
              ] }),
              performersTable(
                marksheet_data.theory?.top_performers || [],
                "Theory"
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-900", children: "Practical Assessment" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-600", children: "Top 3 performers" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Average Score" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-semibold text-emerald-600", children: marksheet_data.practical?.average || 0 })
                ] })
              ] }),
              performersTable(
                marksheet_data.practical?.top_performers || [],
                "Practical"
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Marksheet as default
};
