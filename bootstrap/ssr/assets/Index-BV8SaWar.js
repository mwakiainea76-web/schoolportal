import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function Index({
  weekly_board,
  weekly_grid,
  lesson_columns,
  filters,
  session_options,
  departments,
  trainers,
  course_options,
  module_options,
  days,
  current_department_id,
  is_hod,
  is_trainer,
  should_load_timetable,
  current_session_note
}) {
  const applyFilters = (nextFilters) => {
    router.get(route("academic.timetables.index"), nextFilters, {
      preserveState: true,
      replace: true
    });
  };
  const onFilterChange = (field, value) => {
    const nextFilters = {
      ...filters,
      lecture_room_id: "",
      [field]: value
    };
    if (field === "department_id") {
      nextFilters.trainer_staff_id = "";
      nextFilters.course_version_unit_id = "";
      nextFilters.course_version_mapping_id = "";
      nextFilters.module_number = "";
    }
    if (field === "course_version_mapping_id") {
      nextFilters.module_number = "";
    }
    if (is_trainer) {
      nextFilters.academic_session_id = filters.academic_session_id;
      nextFilters.department_id = current_department_id || "";
      nextFilters.trainer_staff_id = filters.trainer_staff_id;
    }
    applyFilters(nextFilters);
  };
  const resetFilters = () => {
    applyFilters({
      academic_session_id: session_options.find((session) => session.is_active)?.id || "",
      department_id: is_hod || is_trainer ? current_department_id || "" : "",
      trainer_staff_id: is_trainer ? filters.trainer_staff_id : "",
      course_version_mapping_id: "",
      module_number: "",
      day_of_week: ""
    });
  };
  is_hod || is_trainer ? Boolean(current_department_id) : Boolean(
    filters.department_id && filters.course_version_mapping_id && filters.module_number
  );
  const trainerFiltersReady = is_hod || is_trainer ? Boolean(current_department_id) : Boolean(filters.academic_session_id && filters.department_id);
  const adminLoadPathReady = is_hod || is_trainer ? Boolean(current_department_id) : Boolean(
    filters.academic_session_id && filters.department_id && (filters.trainer_staff_id || filters.course_version_mapping_id && filters.module_number)
  );
  const boardSessions = weekly_board.flatMap((day) => day.sessions);
  const totalSessions = boardSessions.length;
  const totalTrainers = new Set(
    boardSessions.map((item) => item.trainer_staff_id)
  ).size;
  const totalUnits = new Set(
    boardSessions.flatMap((item) => item.course_version_unit_ids || [])
  ).size;
  const handleDownloadPdf = () => {
    window.print();
  };
  const filterGridClassName = is_hod ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : is_trainer ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6";
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Department Timetable" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Schedule real teaching sessions by trainer, room, day, and time, while allowing equivalent curriculum units from different courses to be merged into one class." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3 sm:flex-row", children: !is_trainer ? /* @__PURE__ */ jsx(
          Link,
          {
            href: route("lecture-rooms.index"),
            className: "inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "Manage Rooms"
          }
        ) : null })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Department Timetable" }),
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
          /* @__PURE__ */ jsxs("section", { className: "grid gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700", children: "Weekly Sessions" }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-3xl font-semibold text-zinc-900", children: totalSessions }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-600", children: "Scheduled weekly class meetings across the filtered department." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-sky-700", children: "Trainers Scheduled" }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-3xl font-semibold text-zinc-900", children: totalTrainers }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-600", children: "Staff currently carrying timetable load in this filtered view." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-amber-700", children: "Units Covered" }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-3xl font-semibold text-zinc-900", children: totalUnits }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-600", children: "Course version units currently mapped into those scheduled classes." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: filterGridClassName, children: [
              !is_trainer ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Academic Session" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: filters.academic_session_id,
                    onChange: (e) => onFilterChange(
                      "academic_session_id",
                      e.target.value
                    ),
                    disabled: !session_options.length,
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: session_options.length ? session_options.map((session) => /* @__PURE__ */ jsxs("option", { value: session.id, children: [
                      session.name,
                      session.is_active ? " (Current)" : ""
                    ] }, session.id)) : /* @__PURE__ */ jsx("option", { value: "", children: "Run migration to enable sessions" })
                  }
                )
              ] }) : null,
              !is_hod && !is_trainer ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Department" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.department_id,
                    onChange: (e) => onFilterChange("department_id", e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All departments" }),
                      departments.map((department) => /* @__PURE__ */ jsx(
                        "option",
                        {
                          value: department.id,
                          children: department.name
                        },
                        department.id
                      ))
                    ]
                  }
                )
              ] }) : null,
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Versioned Course" }),
                is_hod || is_trainer ? /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.course_version_mapping_id,
                    onChange: (e) => onFilterChange(
                      "course_version_mapping_id",
                      e.target.value
                    ),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All versioned courses" }),
                      course_options.map((course) => /* @__PURE__ */ jsx("option", { value: course.id, children: course.name }, course.id))
                    ]
                  }
                ) : /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.timetables.courses.search",
                    routeParams: {
                      department_id: filters.department_id,
                      limit: 4
                    },
                    defaultOptions: course_options,
                    value: filters.course_version_mapping_id,
                    placeholder: filters.department_id ? "Search versioned course..." : "Select department first...",
                    onChange: (item) => onFilterChange(
                      "course_version_mapping_id",
                      item.id
                    ),
                    disabled: !filters.department_id
                  },
                  filters.department_id || "no-department"
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Module" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.module_number,
                    onChange: (e) => onFilterChange("module_number", e.target.value),
                    disabled: !filters.course_version_mapping_id,
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select module" }),
                      module_options.map((module) => /* @__PURE__ */ jsx("option", { value: module.id, children: module.name }, module.id))
                    ]
                  }
                )
              ] }),
              !is_hod && !is_trainer ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Trainer" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.trainer_staff_id,
                    onChange: (e) => onFilterChange(
                      "trainer_staff_id",
                      e.target.value
                    ),
                    disabled: !trainerFiltersReady,
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All trainers" }),
                      trainers.map((trainer) => /* @__PURE__ */ jsx("option", { value: trainer.id, children: trainer.name }, trainer.id))
                    ]
                  }
                )
              ] }) : null,
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Day" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.day_of_week,
                    onChange: (e) => onFilterChange("day_of_week", e.target.value),
                    disabled: !adminLoadPathReady,
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All days" }),
                      days.map((day) => /* @__PURE__ */ jsx("option", { value: day.id, children: day.name }, day.id))
                    ]
                  }
                )
              ] })
            ] }),
            !is_hod && !is_trainer ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-amber-700", children: "Choose an academic session and department first. Then either select a trainer to view an individual timetable, or select a versioned course and module to view a class timetable." }) : null,
            is_trainer ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-zinc-600", children: "This timetable is already locked to your current department, your trainer profile, and the current running session. Use versioned course, module, and day to narrow your view." }) : null,
            current_session_note ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-zinc-500", children: current_session_note }) : null,
            /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: resetFilters,
                className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                children: "Reset Filters"
              }
            ) })
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
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Select a department, then a versioned course, then a module to load the timetable grid." })
              ] })
            }
          )
        ] })
      ]
    }
  );
}
export {
  Index as default
};
