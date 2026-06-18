import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import "react";
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
  should_load_timetable,
  current_session_note,
  current_department_id
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const applyFilters = (nextFilters) => {
    router.get(route("academic.timetables.index"), nextFilters, {
      preserveState: true,
      replace: true
    });
  };
  const setFilter = (field, value) => {
    const next = {
      ...pageFilters,
      [field]: value,
      lecture_room_id: ""
    };
    if (field === "curriculum_mapping_id") {
      next.module_number = "";
    }
    if (is_trainer) {
      next.trainer_staff_id = pageFilters.trainer_staff_id || "";
    }
    applyFilters(next);
  };
  const handleDownloadPdf = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Timetable" }),
    /* @__PURE__ */ jsx("style", { children: `
                @media print {
                    body * { visibility: hidden; }
                    #timetable-print-area, #timetable-print-area * { visibility: visible; }
                    #timetable-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
                    #timetable-print-area table { width: 100%; border-collapse: collapse; }
                    #timetable-print-area th, #timetable-print-area td { break-inside: avoid; page-break-inside: avoid; }
                    .print-hide { display: none !important; }
                }
            ` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5", children: [
          session_options.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Academic Session" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: pageFilters.academic_session_id || "",
                onChange: (e) => setFilter(
                  "academic_session_id",
                  e.target.value
                ),
                className: "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All sessions" }),
                  session_options.map((session) => /* @__PURE__ */ jsxs(
                    "option",
                    {
                      value: session.id,
                      children: [
                        session.name,
                        session.is_active ? " (Current)" : ""
                      ]
                    },
                    session.id
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Course" }),
            !is_hod && !is_trainer ? /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "academic.timetables.courses.search",
                routeParams: { limit: 4 },
                defaultOptions: course_options,
                value: pageFilters.curriculum_mapping_id || "",
                placeholder: "Search course...",
                onChange: (item) => setFilter(
                  "curriculum_mapping_id",
                  item.id
                )
              }
            ) : /* @__PURE__ */ jsxs(
              "select",
              {
                value: pageFilters.curriculum_mapping_id || "",
                onChange: (e) => setFilter(
                  "curriculum_mapping_id",
                  e.target.value
                ),
                className: "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All courses" }),
                  course_options.map((course) => /* @__PURE__ */ jsx("option", { value: course.id, children: course.name }, course.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Module" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: pageFilters.module_number || "",
                onChange: (e) => setFilter("module_number", e.target.value),
                disabled: !pageFilters.curriculum_mapping_id,
                className: "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All modules" }),
                  module_options.map((mod) => /* @__PURE__ */ jsx("option", { value: mod.id, children: mod.name }, mod.id))
                ]
              }
            )
          ] }),
          !is_hod && !is_trainer && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Trainer" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: pageFilters.trainer_staff_id || "",
                onChange: (e) => setFilter(
                  "trainer_staff_id",
                  e.target.value
                ),
                className: "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All trainers" }),
                  trainers.map((trainer) => /* @__PURE__ */ jsx(
                    "option",
                    {
                      value: trainer.id,
                      children: trainer.name
                    },
                    trainer.id
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Day" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: pageFilters.day_of_week || "",
                onChange: (e) => setFilter("day_of_week", e.target.value),
                className: "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All days" }),
                  days.map((day) => /* @__PURE__ */ jsx("option", { value: day.id, children: day.name }, day.id))
                ]
              }
            )
          ] })
        ] }),
        current_session_note && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-zinc-500", children: current_session_note }),
        (is_hod || is_trainer) && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-400", children: is_trainer ? "Timetable is scoped to your assigned courses and trainer profile." : "Timetable is scoped to your department." })
      ] }),
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
                lesson_columns.length ? lesson_columns.map(
                  (lesson, index) => /* @__PURE__ */ jsxs(
                    "th",
                    {
                      className: `min-w-64 border border-zinc-200 bg-zinc-50 px-4 py-3 text-left ${index === lesson_columns.length - 1 ? "rounded-tr-2xl" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: [
                          "Lesson",
                          " ",
                          index + 1
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: lesson.label }),
                        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                          "Time from",
                          " ",
                          lesson.start_time,
                          " ",
                          "to",
                          " ",
                          lesson.end_time
                        ] })
                      ]
                    },
                    lesson.key
                  )
                ) : /* @__PURE__ */ jsx("th", { className: "rounded-tr-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-500", children: "No lesson columns yet" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: weekly_grid.map((dayRow) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-10 min-w-32 border border-zinc-200 bg-white px-4 py-4 align-top", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: dayRow.label }) }),
                lesson_columns.length ? dayRow.lessons.map(
                  (lessonCell) => /* @__PURE__ */ jsx(
                    "td",
                    {
                      className: "min-w-64 border border-zinc-200 bg-white p-3 align-top",
                      children: lessonCell.sessions.length ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: lessonCell.sessions.map(
                        (session) => /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: "rounded-2xl border border-zinc-100 bg-zinc-50 p-3",
                            children: [
                              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: session.merged_units.map(
                                (unit) => unit.code
                              ).filter(
                                Boolean
                              ).join(
                                ", "
                              ) || session.unit_code }),
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
                              ] }),
                              !is_trainer && /* @__PURE__ */ jsxs("div", { className: "print-hide mt-2 flex gap-2 border-t border-zinc-200 pt-2", children: [
                                /* @__PURE__ */ jsx(
                                  Link,
                                  {
                                    href: route(
                                      "academic.timetables.edit",
                                      session.id
                                    ),
                                    className: "text-xs font-medium text-emerald-600 hover:underline",
                                    children: "Edit"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  Link,
                                  {
                                    href: route(
                                      "academic.timetables.create",
                                      {
                                        department_id: session.department_id || current_department_id,
                                        curriculum_mapping_id: session.curriculum_mapping_id || pageFilters.curriculum_mapping_id,
                                        module_number: session.module_number || pageFilters.module_number
                                      }
                                    ),
                                    className: "text-xs font-medium text-indigo-600 hover:underline",
                                    children: "Clone"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  Link,
                                  {
                                    href: route(
                                      "academic.timetables.create",
                                      {
                                        department_id: session.department_id || current_department_id
                                      }
                                    ),
                                    className: "text-xs font-medium text-amber-600 hover:underline",
                                    children: "+ New"
                                  }
                                )
                              ] })
                            ]
                          },
                          session.id
                        )
                      ) }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-400", children: "No lesson assigned." })
                    },
                    lessonCell.key
                  )
                ) : /* @__PURE__ */ jsx("td", { className: "border border-zinc-200 px-4 py-6 text-sm text-zinc-400", children: "No sessions planned." })
              ] }, dayRow.day)) })
            ] }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-6 py-12 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-zinc-900", children: "Timetable Grid Awaits Filters" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Select a session and course above to load the timetable grid." })
          ] })
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
