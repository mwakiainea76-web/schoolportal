import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import "react";
import "lucide-react";
import "react-toastify";
function Index({
  timetables,
  weekly_board,
  filters,
  departments,
  trainers,
  lecture_rooms,
  program_version_units,
  days,
  current_department_id
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
      [field]: value
    };
    if (field === "department_id") {
      nextFilters.trainer_staff_id = "";
      nextFilters.program_version_unit_id = "";
      nextFilters.lecture_room_id = "";
    }
    applyFilters(nextFilters);
  };
  const resetFilters = () => {
    applyFilters({
      department_id: current_department_id || "",
      trainer_staff_id: "",
      lecture_room_id: "",
      program_version_unit_id: "",
      day_of_week: ""
    });
  };
  const handleDelete = (id) => {
    if (!confirm("Remove this timetable session?")) {
      return;
    }
    router.delete(route("academic.timetables.destroy", id), {
      preserveScroll: true
    });
  };
  const boardSessions = weekly_board.flatMap((day) => day.sessions);
  const totalSessions = boardSessions.length;
  const totalTrainers = new Set(
    boardSessions.map((item) => item.trainer_staff_id)
  ).size;
  const totalUnits = new Set(
    boardSessions.flatMap((item) => item.program_version_unit_ids || [])
  ).size;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Department Timetable" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Schedule real teaching sessions by trainer, room, day, and time, while allowing equivalent curriculum units from different programs to be merged into one class." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("lecture-rooms.index"),
              className: "inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Manage Rooms"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("academic.timetables.create", {
                department_id: filters.department_id
              }),
              className: "inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700",
              children: "Add Timetable Sessions"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Department Timetable" }),
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
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-600", children: "Program version units currently mapped into those scheduled classes." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
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
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Trainer" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.trainer_staff_id,
                    onChange: (e) => onFilterChange(
                      "trainer_staff_id",
                      e.target.value
                    ),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All trainers" }),
                      trainers.map((trainer) => /* @__PURE__ */ jsx("option", { value: trainer.id, children: trainer.name }, trainer.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Lecture Room" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.lecture_room_id,
                    onChange: (e) => onFilterChange("lecture_room_id", e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All rooms" }),
                      lecture_rooms.map((room) => /* @__PURE__ */ jsx("option", { value: room.id, children: room.name }, room.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Curriculum Unit" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.program_version_unit_id,
                    onChange: (e) => onFilterChange(
                      "program_version_unit_id",
                      e.target.value
                    ),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All units" }),
                      program_version_units.map((unit) => /* @__PURE__ */ jsx("option", { value: unit.id, children: unit.name }, unit.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Day" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filters.day_of_week,
                    onChange: (e) => onFilterChange("day_of_week", e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All days" }),
                      days.map((day) => /* @__PURE__ */ jsx("option", { value: day.id, children: day.name }, day.id))
                    ]
                  }
                )
              ] })
            ] }),
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
          /* @__PURE__ */ jsx("section", { className: "grid gap-4 xl:grid-cols-7", children: weekly_board.map((day) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-900", children: day.label }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600", children: day.sessions.length })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: day.sessions.length ? day.sessions.map((session) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "rounded-2xl border border-zinc-100 bg-zinc-50 p-3",
                    children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: session.time_range }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-zinc-800", children: [
                        session.lecture_room_code,
                        " ",
                        session.lecture_room_name
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                        session.merged_units.length,
                        " unit",
                        session.merged_units.length === 1 ? "" : "s",
                        " ",
                        "merged"
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700", children: session.trainer_name }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
                        session.merged_units.slice(0, 2).map((unit) => /* @__PURE__ */ jsx(
                          "p",
                          {
                            className: "text-[11px] text-zinc-500",
                            children: unit.display_name
                          },
                          unit.id
                        )),
                        session.merged_units.length > 2 ? /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-medium text-zinc-500", children: [
                          "+",
                          session.merged_units.length - 2,
                          " more"
                        ] }) : null
                      ] })
                    ]
                  },
                  session.id
                )) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400", children: "No sessions planned." }) })
              ]
            },
            day.day
          )) }),
          /* @__PURE__ */ jsx("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs(DirectoryTable, { pagination: timetables, children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsx(THdata, { children: "Day" }),
              /* @__PURE__ */ jsx(THdata, { children: "Time" }),
              /* @__PURE__ */ jsx(THdata, { children: "Lecture Room" }),
              /* @__PURE__ */ jsx(THdata, { children: "Merged Units" }),
              /* @__PURE__ */ jsx(THdata, { children: "Trainer" }),
              /* @__PURE__ */ jsx(THdata, { children: "Department" }),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: timetables.data.length ? timetables.data.map((entry) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: entry.day_label }),
              /* @__PURE__ */ jsx(Tdata, { children: entry.time_range }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                entry.lecture_room_code,
                " ",
                entry.lecture_room_name
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: entry.merged_units.map((unit) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "font-medium text-zinc-900", children: [
                  unit.code,
                  " ",
                  unit.name
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                  unit.program_version_name,
                  " /",
                  " ",
                  unit.program_name,
                  " / Module",
                  " ",
                  unit.module_taught
                ] })
              ] }, unit.id)) }) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { children: entry.trainer_name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: entry.trainer_staff_number })
              ] }) }),
              /* @__PURE__ */ jsx(Tdata, { children: entry.department_name }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "academic.timetables.edit",
                      entry.id
                    ),
                    className: "text-sm font-medium text-emerald-700 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(entry.id),
                    className: "text-sm font-medium text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, entry.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "7",
                className: "py-12 text-center text-zinc-400",
                children: "No timetable sessions found for the current filters."
              }
            ) }) })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
