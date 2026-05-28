import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "lucide-react";
import "react-toastify";
function Index({
  filters,
  selected_unit,
  submitted_marks,
  blocker
}) {
  const filterForm = useForm({
    program_version_unit_code: filters.program_version_unit_code || "",
    assessment_type: filters.assessment_type || "theory",
    assessment_number: filters.assessment_number || "1"
  });
  const marksForm = useForm({
    program_version_unit_code: filters.program_version_unit_code || "",
    assessment_type: filters.assessment_type || "theory",
    assessment_number: filters.assessment_number || "1",
    entries: [{ registration_number: "", marks: "" }]
  });
  useEffect(() => {
    marksForm.setData({
      program_version_unit_code: filters.program_version_unit_code || "",
      assessment_type: filters.assessment_type || "theory",
      assessment_number: filters.assessment_number || "1",
      entries: [{ registration_number: "", marks: "" }]
    });
  }, [filters]);
  const loadAssessment = (e) => {
    e.preventDefault();
    router.get(
      route("academic.marks.index"),
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
  const updateEntry = (index, field, value) => {
    const nextEntries = [...marksForm.data.entries];
    nextEntries[index] = {
      ...nextEntries[index],
      [field]: value
    };
    marksForm.setData("entries", nextEntries);
  };
  const addRow = () => {
    marksForm.setData("entries", [
      ...marksForm.data.entries,
      { registration_number: "", marks: "" }
    ]);
  };
  const removeRow = (index) => {
    if (marksForm.data.entries.length === 1) {
      return;
    }
    marksForm.setData(
      "entries",
      marksForm.data.entries.filter((_, rowIndex) => rowIndex !== index)
    );
  };
  const submit = (e) => {
    e.preventDefault();
    marksForm.post(route("academic.marks.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Marks Entry" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Enter the program version unit code, choose theory or practical, set the assessment number, then fill registration number and marks manually." })
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
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: filterForm.errors.assessment_type,
                        className: "mt-2"
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
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: filterForm.errors.assessment_number,
                        className: "mt-2"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
                    selected_unit.code,
                    " - ",
                    selected_unit.name
                  ] }) : "Load a unit code to confirm the selected program version unit." }),
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
          /* @__PURE__ */ jsxs(
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
                blocker ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }) : null,
                marksForm.errors.entries ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: marksForm.errors.entries }) : null,
                selected_unit ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                    selected_unit.code,
                    " - ",
                    selected_unit.name
                  ] }),
                  " | ",
                  "Module ",
                  selected_unit.module,
                  " | ",
                  selected_unit.program,
                  " | ",
                  selected_unit.version
                ] }) : null,
                /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1.2fr,0.8fr,0.4fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                    /* @__PURE__ */ jsx("p", { children: "Registration No." }),
                    /* @__PURE__ */ jsx("p", { children: "Marks" }),
                    /* @__PURE__ */ jsx("p", {})
                  ] }),
                  marksForm.data.entries.map((entry, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "grid grid-cols-[1.2fr,0.8fr,0.4fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3",
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
                              placeholder: "0 - 100"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: marksForm.errors[`entries.${index}.marks`],
                              className: "mt-2"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removeRow(index),
                            className: "text-sm font-medium text-red-600 transition hover:text-red-700",
                            children: "Remove"
                          }
                        ) })
                      ]
                    },
                    `${index}-${entry.registration_number}`
                  ))
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: marksForm.data.program_version_unit_code,
                    name: "program_version_unit_code"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: marksForm.data.assessment_type,
                    name: "assessment_type"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "hidden",
                    value: marksForm.data.assessment_number,
                    name: "assessment_number"
                  }
                ),
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
                      disabled: marksForm.processing || !marksForm.data.program_version_unit_code || !!blocker,
                      className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                      children: marksForm.processing ? "Saving Marks..." : "Save Marks"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Submitted Marks" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Marks already saved for this unit assessment." })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,1.2fr,1.2fr,0.7fr,0.8fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("p", { children: "Reg. No." }),
                /* @__PURE__ */ jsx("p", { children: "Student" }),
                /* @__PURE__ */ jsx("p", { children: "Unit" }),
                /* @__PURE__ */ jsx("p", { children: "Marks" }),
                /* @__PURE__ */ jsx("p", { children: "Status" })
              ] }),
              submitted_marks.length ? submitted_marks.map((mark) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "grid grid-cols-[1fr,1.2fr,1.2fr,0.7fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm",
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
  Index as default
};
