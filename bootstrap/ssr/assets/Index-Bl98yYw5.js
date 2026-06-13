import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
function Index({
  weekly_board,
  weekly_grid,
  lesson_columns,
  filters,
  session_options,
  trainers,
  course_options,
  module_options,
  days,
  is_hod,
  is_trainer,
  can_manage_timetables,
  should_load_timetable,
  current_session_note
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [currentFilterKey, setCurrentFilterKey] = useState("");
  const [draftFilters, setDraftFilters] = useState({
    academic_session_id: pageFilters.academic_session_id || "",
    trainer_staff_id: pageFilters.trainer_staff_id || "",
    curriculum_mapping_id: pageFilters.curriculum_mapping_id || "",
    module_number: pageFilters.module_number || "",
    day_of_week: pageFilters.day_of_week || ""
  });
  const applyFilters = (nextFilters) => {
    router.get(route("academic.timetables.index"), nextFilters, {
      preserveState: true,
      replace: true
    });
  };
  const buildNextFilters = (field, value) => {
    const nextFilters = {
      ...pageFilters,
      lecture_room_id: "",
      [field]: value
    };
    if (field === "curriculum_mapping_id") {
      nextFilters.module_number = "";
    }
    if (is_trainer) {
      nextFilters.academic_session_id = pageFilters.academic_session_id;
      nextFilters.trainer_staff_id = pageFilters.trainer_staff_id;
    }
    return nextFilters;
  };
  const onFilterChange = (field, value) => {
    const nextFilters = buildNextFilters(field, value);
    setDraftFilters((current) => ({
      ...current,
      ...nextFilters
    }));
    applyFilters(nextFilters);
  };
  const setDraftFilter = (field, value) => {
    setDraftFilters((current) => {
      const nextFilters = {
        ...current,
        [field]: value
      };
      if (field === "curriculum_mapping_id") {
        nextFilters.module_number = "";
      }
      return nextFilters;
    });
  };
  const resetFilters = () => {
    const nextFilters = {
      academic_session_id: session_options.find((session) => session.is_active)?.id || "",
      trainer_staff_id: is_trainer ? pageFilters.trainer_staff_id : "",
      curriculum_mapping_id: "",
      module_number: "",
      day_of_week: ""
    };
    setCurrentFilterKey("");
    setDraftFilters(nextFilters);
    applyFilters(nextFilters);
  };
  const trainerFiltersReady = is_hod || is_trainer ? Boolean(pageFilters.academic_session_id) : Boolean(pageFilters.academic_session_id);
  const adminLoadPathReady = Boolean(
    pageFilters.academic_session_id && (pageFilters.trainer_staff_id || pageFilters.curriculum_mapping_id && pageFilters.module_number)
  );
  can_manage_timetables ? route("academic.timetables.create") : route("academic.timetables.hod.create");
  const handleDownloadPdf = () => {
    window.print();
  };
  const FILTER_DEFINITIONS = [
    ...!is_trainer ? [
      {
        key: "academic_session_id",
        label: "Academic Session"
      }
    ] : [],
    {
      key: "curriculum_mapping_id",
      label: "Versioned Course"
    },
    {
      key: "module_number",
      label: "Module"
    },
    ...!is_hod && !is_trainer ? [
      {
        key: "trainer_staff_id",
        label: "Trainer"
      }
    ] : [],
    {
      key: "day_of_week",
      label: "Day"
    }
  ];
  const currentFilter = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  const hasCurrentFilterValue = currentFilterKey && Boolean(draftFilters[currentFilterKey]);
  const activeFilters = FILTER_DEFINITIONS.filter(
    (filter) => pageFilters[filter.key]
  );
  const findOptionLabel = (options, value, labelKey = "name") => {
    const option = options.find(
      (item) => String(item.id) === String(value)
    );
    return option?.[labelKey] || value;
  };
  const getSelectedOptionLabel = (filter) => {
    const value = pageFilters[filter.key];
    if (!value) return "";
    if (filter.key === "academic_session_id") {
      return findOptionLabel(session_options, value);
    }
    if (filter.key === "curriculum_mapping_id") {
      return findOptionLabel(course_options, value);
    }
    if (filter.key === "module_number") {
      return findOptionLabel(module_options, value);
    }
    if (filter.key === "trainer_staff_id") {
      return findOptionLabel(trainers, value);
    }
    if (filter.key === "day_of_week") {
      return findOptionLabel(days, value);
    }
    return value;
  };
  const clearSingleFilter = (key) => {
    onFilterChange(key, "");
  };
  const selectFilterColumn = (key) => {
    setCurrentFilterKey(key);
    if (!key) return;
    setDraftFilters((current) => ({
      ...current,
      [key]: pageFilters[key] || current[key] || ""
    }));
  };
  const addCurrentFilter = () => {
    if (!hasCurrentFilterValue) return;
    onFilterChange(currentFilterKey, draftFilters[currentFilterKey]);
    setCurrentFilterKey("");
  };
  const submitFilters = (event) => {
    event.preventDefault();
    if (hasCurrentFilterValue) {
      addCurrentFilter();
      return;
    }
    applyFilters(pageFilters);
  };
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    if (filter.key === "academic_session_id") {
      return /* @__PURE__ */ jsx(
        "select",
        {
          value: draftFilters.academic_session_id,
          onChange: (e) => setDraftFilter("academic_session_id", e.target.value),
          disabled: !session_options.length,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
          children: session_options.length ? session_options.map((session) => /* @__PURE__ */ jsxs("option", { value: session.id, children: [
            session.name,
            session.is_active ? " (Current)" : ""
          ] }, session.id)) : /* @__PURE__ */ jsx("option", { value: "", children: "Run migration to enable sessions" })
        }
      );
    }
    if (filter.key === "curriculum_mapping_id") {
      if (is_hod || is_trainer) {
        return /* @__PURE__ */ jsxs(
          "select",
          {
            value: draftFilters.curriculum_mapping_id,
            onChange: (e) => setDraftFilter(
              "curriculum_mapping_id",
              e.target.value
            ),
            className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All versioned courses" }),
              course_options.map((course) => /* @__PURE__ */ jsx("option", { value: course.id, children: course.name }, course.id))
            ]
          }
        );
      }
      return /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "academic.timetables.courses.search",
          routeParams: {
            limit: 4
          },
          defaultOptions: course_options,
          value: draftFilters.curriculum_mapping_id,
          placeholder: "Search versioned course...",
          onChange: (item) => setDraftFilter("curriculum_mapping_id", item.id)
        }
      );
    }
    if (filter.key === "module_number") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: draftFilters.module_number,
          onChange: (e) => setDraftFilter("module_number", e.target.value),
          disabled: !pageFilters.curriculum_mapping_id,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select module" }),
            module_options.map((module) => /* @__PURE__ */ jsx("option", { value: module.id, children: module.name }, module.id))
          ]
        }
      );
    }
    if (filter.key === "trainer_staff_id") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: draftFilters.trainer_staff_id,
          onChange: (e) => setDraftFilter("trainer_staff_id", e.target.value),
          disabled: !trainerFiltersReady,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "All trainers" }),
            trainers.map((trainer) => /* @__PURE__ */ jsx("option", { value: trainer.id, children: trainer.name }, trainer.id))
          ]
        }
      );
    }
    if (filter.key === "day_of_week") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: draftFilters.day_of_week,
          onChange: (e) => setDraftFilter("day_of_week", e.target.value),
          disabled: !adminLoadPathReady,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "All days" }),
            days.map((day) => /* @__PURE__ */ jsx("option", { value: day.id, children: day.name }, day.id))
          ]
        }
      );
    }
    return null;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Timetable" }),
    /* @__PURE__ */ jsx("style", { children: `
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    #timetable-print-area,
                    #timetable-print-area * {
                        visibility: visible;
                    }

                    #timetable-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                    }

                    #timetable-print-area table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    #timetable-print-area th,
                    #timetable-print-area td {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .print-hide {
                        display: none !important;
                    }
                }
            ` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsx("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitFilters, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(280px,1fr)_auto_auto_auto]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Filter Column" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: currentFilterKey,
                onChange: (e) => selectFilterColumn(e.target.value),
                className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Choose column..." }),
                  FILTER_DEFINITIONS.map((filter) => /* @__PURE__ */ jsx(
                    "option",
                    {
                      value: filter.key,
                      children: filter.label
                    },
                    filter.key
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: currentFilter?.label || "Filter Value" }),
            renderFilterInput(currentFilter)
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: addCurrentFilter,
              disabled: !hasCurrentFilterValue,
              className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
              children: "+ Add filter"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: resetFilters,
              className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Reset Filters"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700",
              children: "Apply"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-zinc-100 pt-3", children: activeFilters.length ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.map((filter) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => clearSingleFilter(filter.key),
            className: "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100",
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                filter.label,
                ":",
                " ",
                getSelectedOptionLabel(filter)
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-900", children: "×" })
            ]
          },
          filter.key
        )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No filters selected. Choose a column above to filter this timetable." }) })
      ] }) }),
      /* @__PURE__ */ jsx(
        "section",
        {
          id: "timetable-print-area",
          className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm",
          children: should_load_timetable ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Weekly Lesson Grid" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:items-end", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Lesson columns show the time from and to. Each slot includes the room and assigned trainer helper." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleDownloadPdf,
                    className: "print-hide inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
                    children: "Download Timetable PDF"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full border-separate border-spacing-0", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "sticky left-0 z-10 min-w-32 rounded-tl-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Day" }),
                lesson_columns.length ? lesson_columns.map((lesson, index) => /* @__PURE__ */ jsxs(
                  "th",
                  {
                    className: `min-w-64 border border-zinc-200 bg-zinc-50 px-4 py-3 text-left ${index === lesson_columns.length - 1 ? "rounded-tr-2xl" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: [
                        "Lesson ",
                        index + 1
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: lesson.label }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                        "Time from ",
                        lesson.start_time,
                        " to",
                        " ",
                        lesson.end_time
                      ] })
                    ]
                  },
                  lesson.key
                )) : /* @__PURE__ */ jsx("th", { className: "rounded-tr-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-500", children: "No lesson columns yet" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: weekly_grid.map((dayRow) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-10 min-w-32 border border-zinc-200 bg-white px-4 py-4 align-top", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: dayRow.label }) }),
                lesson_columns.length ? dayRow.lessons.map((lessonCell) => /* @__PURE__ */ jsx(
                  "td",
                  {
                    className: "min-w-64 border border-zinc-200 bg-white p-3 align-top",
                    children: lessonCell.sessions.length ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: lessonCell.sessions.map((session) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "rounded-2xl border border-zinc-100 bg-zinc-50 p-3",
                        children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: session.merged_units.map((unit) => unit.code).filter(Boolean).join(", ") || session.unit_code }),
                          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                            "Trainer:",
                            " ",
                            session.trainer_name
                          ] }),
                          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                            "Venue:",
                            " ",
                            session.lecture_room_code,
                            " ",
                            session.lecture_room_name
                          ] })
                        ]
                      },
                      session.id
                    )) }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-400", children: "No lesson assigned." })
                  },
                  lessonCell.key
                )) : /* @__PURE__ */ jsx("td", { className: "border border-zinc-200 px-4 py-6 text-sm text-zinc-400", children: "No sessions planned." })
              ] }, dayRow.day)) })
            ] }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-6 py-12 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-zinc-900", children: "Timetable Grid Awaits Filters" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Select a versioned course and module, or select a trainer, to load the timetable grid." })
          ] })
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
