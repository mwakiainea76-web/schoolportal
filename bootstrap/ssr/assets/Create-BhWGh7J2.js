import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { c as collectMatchingMergedUnits, h as hasExactOccupiedSlot } from "./shared-D6ugPtRo.js";
import "@headlessui/react";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
function Create({
  departments,
  course_options,
  trainers,
  lecture_rooms,
  curriculum_units,
  days,
  is_admin,
  current_department_id,
  selected_department_id
}) {
  const [editUnit, setEditUnit] = useState(null);
  const initialDepartment = is_admin ? "" : selected_department_id || current_department_id || "";
  const { data, setData, post, processing, errors } = useForm({
    department_id: initialDepartment,
    curriculum_mapping_id: "",
    module_number: "",
    trainer_staff_id: "",
    lecture_room_id: "",
    curriculum_unit_ids: [],
    sessions: [
      {
        day_of_week: "monday",
        start_time: "",
        end_time: ""
      }
    ]
  });
  const filteredCourses = data.department_id ? course_options.filter(
    (course) => course.department_id === data.department_id
  ) : [];
  const moduleOptions = data.department_id && data.curriculum_mapping_id ? [
    ...new Set(
      curriculum_units.filter(
        (unit) => unit.department_id === data.department_id && unit.curriculum_mapping_id === data.curriculum_mapping_id
      ).map((unit) => String(unit.module_taught || ""))
    )
  ].filter(Boolean).sort((a, b) => Number(a) - Number(b)) : [];
  const filteredUnits = data.department_id && data.curriculum_mapping_id && data.module_number ? curriculum_units.filter(
    (unit) => unit.department_id === data.department_id && unit.curriculum_mapping_id === data.curriculum_mapping_id && String(unit.module_taught || "") === String(data.module_number)
  ) : [];
  const filteredRooms = data.department_id ? lecture_rooms.filter(
    (room) => room.department_id === data.department_id
  ) : lecture_rooms;
  const selectedUnit = filteredUnits.find((unit) => unit.id === data.curriculum_unit_ids[0]) || null;
  const mergeMatches = collectMatchingMergedUnits(
    curriculum_units,
    selectedUnit,
    data
  );
  const selectedUnitIsAssigned = (selectedUnit?.assigned_timetables || []).length > 0;
  const selectedUnitCanMergeNow = mergeMatches.length > 0;
  const occupiedExactSlotExists = hasExactOccupiedSlot(
    curriculum_units,
    selectedUnit,
    data
  );
  const updateSession = (index, field, value) => {
    const nextSessions = [...data.sessions];
    nextSessions[index] = {
      ...nextSessions[index],
      [field]: value
    };
    setData("sessions", nextSessions);
  };
  const addSession = () => {
    setData("sessions", [
      ...data.sessions,
      {
        day_of_week: "monday",
        start_time: "",
        end_time: ""
      }
    ]);
  };
  const removeSession = (index) => {
    if (data.sessions.length === 1) {
      return;
    }
    setData(
      "sessions",
      data.sessions.filter((_, sessionIndex) => sessionIndex !== index)
    );
  };
  const selectUnit = (unitId) => {
    setData("curriculum_unit_ids", unitId ? [unitId] : []);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.timetables.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Timetable" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Department", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: null,
                  defaultOptions: departments,
                  value: data.department_id,
                  placeholder: "Select department...",
                  onChange: (department) => {
                    setData("department_id", department.id);
                    setData("curriculum_mapping_id", "");
                    setData("module_number", "");
                    setData("trainer_staff_id", "");
                    setData("lecture_room_id", "");
                    setData("curriculum_unit_ids", []);
                  },
                  error: errors.department_id
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.department_id,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Course", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: null,
                  defaultOptions: filteredCourses,
                  value: data.curriculum_mapping_id,
                  placeholder: "Select mapped course...",
                  onChange: (mapping) => {
                    setData(
                      "curriculum_mapping_id",
                      mapping.id
                    );
                    setData("module_number", "");
                    setData("trainer_staff_id", "");
                    setData("lecture_room_id", "");
                    setData("curriculum_unit_ids", []);
                  },
                  error: errors.curriculum_mapping_id,
                  disabled: !data.department_id
                },
                `course-${data.department_id}`
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.curriculum_mapping_id,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Module", required: true }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: data.module_number,
                  onChange: (e) => {
                    setData("module_number", e.target.value);
                    setData("curriculum_unit_ids", []);
                  },
                  disabled: !data.curriculum_mapping_id,
                  className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select module..." }),
                    moduleOptions.map((module) => /* @__PURE__ */ jsxs("option", { value: module, children: [
                      "Module ",
                      module
                    ] }, module))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.module_number,
                  className: "mt-2"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Curriculum Units in This Class" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Select one curriculum unit to plan its timetable. Already assigned units stay locked. A unit can still share an existing live class when the trainer, room, and every selected time match exactly." })
            ] }),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.curriculum_unit_ids,
                className: "mt-1"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: filteredUnits.length ? filteredUnits.map((unit) => {
              const checked = data.curriculum_unit_ids[0] === unit.id;
              const assignedTimetable = unit.assigned_timetable;
              const assignedTimetables = unit.assigned_timetables || [];
              const isAssigned = assignedTimetables.length > 0;
              const isLocked = isAssigned;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `rounded-xl border px-4 py-3 text-sm transition ${isAssigned ? "border-zinc-200 bg-zinc-100 text-zinc-500" : checked ? "border-emerald-300 bg-emerald-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`,
                  children: [
                    /* @__PURE__ */ jsxs(
                      "label",
                      {
                        className: `flex items-start gap-3 ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`,
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "radio",
                              name: "curriculum_unit_id",
                              checked: isLocked ? true : checked,
                              disabled: isLocked,
                              onChange: () => selectUnit(unit.id),
                              className: "mt-1 h-4 w-4 border-zinc-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-80"
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                            /* @__PURE__ */ jsx("span", { className: "block", children: unit.name }),
                            isAssigned ? /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Already timetabled. Open it with Edit if you want to change that allocation." }) : null
                          ] })
                        ]
                      }
                    ),
                    isAssigned ? /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                        "Assigned: ",
                        assignedTimetable.day_label,
                        " ",
                        assignedTimetable.time_range
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setEditUnit(unit),
                          className: "rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50",
                          children: "Edit"
                        }
                      )
                    ] }) : null
                  ]
                },
                unit.id
              );
            }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: data.department_id && data.curriculum_mapping_id && data.module_number ? "No curriculum units are connected to the selected course version mapping and module." : "Select a department, course version mapping, and module to load curriculum units." }) })
          ] }),
          selectedUnit ? /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-2xl border px-5 py-4 text-sm ${selectedUnitCanMergeNow ? "border-emerald-200 bg-emerald-50 text-emerald-800" : occupiedExactSlotExists ? "border-amber-200 bg-amber-50 text-amber-800" : "border-zinc-200 bg-white text-zinc-500"}`,
              children: selectedUnitCanMergeNow ? `This unit will share delivery with ${mergeMatches.map((unit) => unit.name).join(", ")} while keeping its own unit code in the timetable.` : occupiedExactSlotExists ? "A matching live class already exists. Saving this unit will be allowed only if every selected session matches that occupied slot exactly." : selectedUnitIsAssigned ? "This unit already has its own timetable allocation." : "Choose trainer, room, and sessions. If they match an existing live class exactly, this unit can be scheduled alongside it."
            }
          ) : null,
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Trainer", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: null,
                  defaultOptions: trainers,
                  value: data.trainer_staff_id,
                  placeholder: "Select trainer...",
                  onChange: (item) => setData("trainer_staff_id", item.id),
                  error: errors.trainer_staff_id,
                  disabled: !data.department_id
                },
                `trainer-${data.department_id}`
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.trainer_staff_id,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Lecture Room", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: null,
                  defaultOptions: filteredRooms,
                  value: data.lecture_room_id,
                  placeholder: "Select lecture room...",
                  onChange: (item) => setData("lecture_room_id", item.id),
                  error: errors.lecture_room_id,
                  disabled: !data.department_id
                },
                `room-${data.department_id}`
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.lecture_room_id,
                  className: "mt-2"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Weekly Sessions" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Add one or more weekly meetings for this same merged class setup." })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: addSession,
                  className: "rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50",
                  children: "Add Another Session"
                }
              )
            ] }),
            data.sessions.map((session, index) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-zinc-200 bg-zinc-50 p-5",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500", children: [
                      "Session ",
                      index + 1
                    ] }),
                    data.sessions.length > 1 ? /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeSession(index),
                        className: "text-sm font-medium text-red-600 hover:underline",
                        children: "Remove"
                      }
                    ) : null
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-medium text-zinc-700", children: "Day of Week" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: session.day_of_week,
                          onChange: (e) => updateSession(
                            index,
                            "day_of_week",
                            e.target.value
                          ),
                          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                          children: days.map((day) => /* @__PURE__ */ jsx(
                            "option",
                            {
                              value: day.id,
                              children: day.name
                            },
                            day.id
                          ))
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        InputError,
                        {
                          message: errors[`sessions.${index}.day_of_week`],
                          className: "mt-2"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-medium text-zinc-700", children: "Start Time" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "time",
                          value: session.start_time,
                          onChange: (e) => updateSession(
                            index,
                            "start_time",
                            e.target.value
                          ),
                          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        InputError,
                        {
                          message: errors[`sessions.${index}.start_time`],
                          className: "mt-2"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-medium text-zinc-700", children: "End Time" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "time",
                          value: session.end_time,
                          onChange: (e) => updateSession(
                            index,
                            "end_time",
                            e.target.value
                          ),
                          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        InputError,
                        {
                          message: errors[`sessions.${index}.end_time`],
                          className: "mt-2"
                        }
                      )
                    ] })
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
                href: route("academic.timetables.index"),
                className: "rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                children: processing ? "Saving Timetable..." : "Save Timetable"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        show: Boolean(editUnit),
        onClose: () => setEditUnit(null),
        maxWidth: "2xl",
        align: "top",
        children: editUnit ? /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Assigned Unit" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-600", children: editUnit.name }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Trainer:" }),
              " ",
              editUnit.assigned_timetable?.trainer_name || "-"
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Room:" }),
              " ",
              editUnit.assigned_timetable?.lecture_room_name || "-"
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Slot:" }),
              " ",
              editUnit.assigned_timetable?.day_label,
              " ",
              editUnit.assigned_timetable?.time_range
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setEditUnit(null),
                className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "academic.timetables.edit",
                  editUnit.assigned_timetable?.id
                ),
                className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
                children: "Edit Timetable"
              }
            )
          ] })
        ] }) : null
      }
    )
  ] });
}
export {
  Create as default
};
