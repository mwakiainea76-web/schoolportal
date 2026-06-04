import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { useState, useCallback, useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Index({
  filters,
  selected_unit,
  submitted_marks,
  blocker,
  filter_options
}) {
  const [hasSearched, setHasSearched] = useState(
    !!submitted_marks?.data?.length
  );
  const filterForm = useForm({
    program_version_unit_code: filters.program_version_unit_code || "",
    assessment_type: filters.assessment_type || "theory",
    assessment_number: filters.assessment_number || "1",
    module: filters.module || "",
    academic_year: filters.academic_year || ""
  });
  const marksForm = useForm({
    entries: [{ registration_number: "", marks: "" }]
  });
  const resetEntries = useCallback(() => {
    marksForm.setData("entries", [{ registration_number: "", marks: "" }]);
  }, []);
  useEffect(() => {
    resetEntries();
  }, [selected_unit]);
  const loadAssessment = (e) => {
    e.preventDefault();
    setHasSearched(false);
    router.get(
      route("academic.marks.index"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const searchMarks = (e) => {
    e.preventDefault();
    setHasSearched(true);
    router.get(
      route("academic.marks.index"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number,
        module: filterForm.data.module,
        academic_year: filterForm.data.academic_year,
        search_marks: true
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const goToPage = (page) => {
    router.get(
      route("academic.marks.index"),
      {
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number,
        module: filterForm.data.module,
        academic_year: filterForm.data.academic_year,
        search_marks: true,
        page
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const updateEntry = (index, field, value) => {
    const nextEntries = [...marksForm.data.entries];
    nextEntries[index] = { ...nextEntries[index], [field]: value };
    marksForm.setData("entries", nextEntries);
  };
  const addRow = () => {
    marksForm.setData("entries", [
      ...marksForm.data.entries,
      { registration_number: "", marks: "" }
    ]);
  };
  const submit = (e) => {
    e.preventDefault();
    router.post(
      route("academic.marks.store"),
      {
        ...marksForm.data,
        program_version_unit_code: filterForm.data.program_version_unit_code,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number
      },
      {
        preserveScroll: true
      }
    );
  };
  const marks = submitted_marks?.data ?? [];
  const currentPage = submitted_marks?.current_page ?? 1;
  const lastPage = submitted_marks?.last_page ?? 1;
  const total = submitted_marks?.total ?? 0;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Marks Entry" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Enter the course version unit code, then fill registration numbers and marks manually." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Marks Entry" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-8", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: loadAssessment,
              className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800", children: "Marks are saved only for students who already registered the entered unit. You can record multiple assessments per unit by changing the assessment number and choosing theory or practical." }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    InputLabel,
                    {
                      value: "Course Version Unit Code",
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
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
                    selected_unit.code,
                    " – ",
                    selected_unit.name
                  ] }) : "Load a unit code to confirm the selected course version unit." }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !filterForm.data.program_version_unit_code,
                      className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                      children: "Load Unit"
                    }
                  )
                ] })
              ]
            }
          ),
          selected_unit ? /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submit,
              className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Student Marks" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Enter registration number and marks between 0 and 100 for this assessment." })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addRow,
                      className: "rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50",
                      children: "Add Row"
                    }
                  )
                ] }),
                blocker && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }),
                marksForm.errors.entries && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: marksForm.errors.entries }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                    selected_unit.code,
                    " – ",
                    selected_unit.name
                  ] }),
                  " | ",
                  "Module ",
                  selected_unit.module,
                  " | ",
                  selected_unit.program,
                  " | ",
                  selected_unit.version
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
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
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        value: "Assessment Number",
                        required: true
                      }
                    ),
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
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: filterForm.data.program_version_unit_code,
                    name: "program_version_unit_code"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: filterForm.data.assessment_type,
                    name: "assessment_type"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: filterForm.data.assessment_number,
                    name: "assessment_number"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                    /* @__PURE__ */ jsx("p", { children: "Registration No." }),
                    /* @__PURE__ */ jsx("p", { children: "Marks" })
                  ] }),
                  marksForm.data.entries.map((entry, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "grid grid-cols-2 gap-4 border-t border-zinc-100 bg-white px-4 py-3",
                      children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              value: entry.registration_number,
                              onChange: (e) => updateEntry(
                                index,
                                "registration_number",
                                e.target.value
                              ),
                              className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400",
                              placeholder: "TVET/..."
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: marksForm.errors[`entries.${index}.registration_number`],
                              className: "mt-2"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "number",
                              min: "0",
                              max: "100",
                              step: "1",
                              value: entry.marks,
                              onChange: (e) => updateEntry(
                                index,
                                "marks",
                                e.target.value
                              ),
                              className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400",
                              placeholder: "0 – 100"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: marksForm.errors[`entries.${index}.marks`],
                              className: "mt-2"
                            }
                          )
                        ] })
                      ]
                    },
                    index
                  ))
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("staff.dashboard"),
                      className: "rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: marksForm.processing,
                      className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60",
                      children: marksForm.processing ? "Saving…" : "Save Marks"
                    }
                  )
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 flex-shrink-0",
                fill: "currentColor",
                viewBox: "0 0 20 20",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z",
                    clipRule: "evenodd"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Load a unit first" }),
            /* @__PURE__ */ jsx("p", { className: "ml-auto text-xs", children: 'Enter the unit code and click "Load Unit" above to start entering marks.' })
          ] }) }),
          selected_unit ? /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Submitted Marks" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Filter by module and academic year, then click Search." })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: searchMarks,
                className: "mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 sm:grid-cols-[1fr,1fr,1fr,auto]",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-zinc-500", children: "Academic year" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.academic_year,
                        onChange: (e) => {
                          const newYear = e.target.value;
                          filterForm.setData("module", "");
                          filterForm.setData(
                            "academic_year",
                            newYear
                          );
                          router.get(
                            route("academic.marks.index"),
                            {
                              program_version_unit_code: filterForm.data.program_version_unit_code,
                              assessment_type: filterForm.data.assessment_type,
                              assessment_number: filterForm.data.assessment_number,
                              academic_year: newYear,
                              module: ""
                            },
                            {
                              preserveState: true,
                              preserveScroll: true
                            }
                          );
                        },
                        className: "rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All years" }),
                          filter_options?.academic_years?.map(
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
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxs("label", { className: "text-xs font-medium text-zinc-500", children: [
                      "Module",
                      filterForm.data.academic_year && /* @__PURE__ */ jsx("span", { className: "ml-1 text-zinc-400", children: "(for selected year)" })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.module,
                        onChange: (e) => filterForm.setData(
                          "module",
                          e.target.value
                        ),
                        className: "rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400",
                        disabled: !filterForm.data.academic_year && filter_options?.modules?.length === 0,
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All modules" }),
                          filter_options?.modules?.map((opt) => /* @__PURE__ */ jsx(
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
                  /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 sm:w-auto",
                      children: "Search"
                    }
                  ) })
                ]
              }
            ),
            !hasSearched ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-400", children: "Use the filters above and click Search to view submitted marks." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[52rem] border-collapse", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Reg. No." }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Student" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Unit" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Marks" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" })
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
                      ) })
                    ]
                  },
                  mark.id
                )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                  "td",
                  {
                    colSpan: "5",
                    className: "px-4 py-8 text-center text-sm text-zinc-500",
                    children: "No submitted marks found for this filter."
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
                    Math.min(
                      currentPage * 25,
                      total
                    )
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
                    (p) => p === 1 || p === lastPage || Math.abs(
                      p - currentPage
                    ) <= 1
                  ).reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push(
                        "ellipsis-" + p
                      );
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
          ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-800", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 flex-shrink-0",
                fill: "currentColor",
                viewBox: "0 0 20 20",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z",
                    clipRule: "evenodd"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Load a unit first" }),
            /* @__PURE__ */ jsx("p", { className: "ml-auto text-xs", children: 'Enter the unit code and click "Load Unit" above to view submitted marks.' })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
