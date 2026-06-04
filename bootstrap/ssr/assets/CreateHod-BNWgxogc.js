import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
const STUDY_SLOTS = [
  {
    id: "08:00|10:00",
    label: "08:00 - 10:00",
    start_time: "08:00",
    end_time: "10:00",
    helper: "Morning study slot"
  },
  {
    id: "11:00|13:00",
    label: "11:00 - 13:00",
    start_time: "11:00",
    end_time: "13:00",
    helper: "After break"
  },
  {
    id: "14:00|16:00",
    label: "14:00 - 16:00",
    start_time: "14:00",
    end_time: "16:00",
    helper: "After lunch"
  }
];
function CreateHod({
  department,
  program_options,
  modules,
  available_units,
  trainers,
  lecture_rooms,
  days,
  filters
}) {
  const { data, setData, post, processing, errors } = useForm({
    department_id: department.id,
    program_version_mapping_id: filters.program_version_mapping_id || "",
    module_number: filters.module_number || "",
    trainer_staff_id: "",
    lecture_room_id: "",
    program_version_unit_ids: [],
    sessions: [
      {
        day_of_week: "monday",
        start_time: "08:00",
        end_time: "10:00"
      }
    ]
  });
  useEffect(() => {
    const messages = Object.entries(errors).filter(
      ([key, value]) => Boolean(value) && (key.startsWith("sessions.") || key === "program_version_unit_ids" || key === "trainer_staff_id" || key === "lecture_room_id")
    ).map(([, value]) => value);
    if (messages.length) {
      alert(messages[0]);
    }
  }, [errors]);
  const updateScopedFilters = (nextValues) => {
    const nextProgramVersionMappingId = nextValues.program_version_mapping_id ?? data.program_version_mapping_id;
    const nextModuleNumber = nextValues.module_number ?? data.module_number;
    router.get(
      route("academic.timetables.hod.create"),
      {
        program_version_mapping_id: nextProgramVersionMappingId || "",
        module_number: nextModuleNumber || ""
      },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true
      }
    );
  };
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
        start_time: "08:00",
        end_time: "10:00"
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
  const toggleUnit = (unitId, checked) => {
    if (checked) {
      setData("program_version_unit_ids", [
        ...data.program_version_unit_ids,
        unitId
      ]);
      return;
    }
    setData(
      "program_version_unit_ids",
      data.program_version_unit_ids.filter((id) => id !== unitId)
    );
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.timetables.hod.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Create Department Timetable" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Your department is detected automatically. Choose one active course version, narrow to a module, then assign equivalent units together into one trainer, room, and weekly slot." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Create Timetable" }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl", children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: submit,
            className: "space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800", children: [
                "Timetable creation is scoped to",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: department.name }),
                ". Assigned curriculum units disappear from the list after each save so they cannot be double-assigned."
              ] }),
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "department_id", value: data.department_id }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Course Name", required: true }),
                  /* @__PURE__ */ jsx(
                    SearchSelect,
                    {
                      routeName: "academic.timetables.hod.programs.search",
                      routeParams: {
                        limit: 4
                      },
                      defaultOptions: program_options,
                      value: data.program_version_mapping_id,
                      placeholder: "Search versioned course...",
                      onChange: (item) => {
                        setData(
                          "program_version_mapping_id",
                          item.id
                        );
                        setData("module_number", "");
                        setData("trainer_staff_id", "");
                        setData("lecture_room_id", "");
                        setData("program_version_unit_ids", []);
                        updateScopedFilters({
                          program_version_mapping_id: item.id,
                          module_number: ""
                        });
                      },
                      error: errors.program_version_mapping_id
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.program_version_mapping_id,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Module Number", required: true }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: data.module_number,
                      onChange: (e) => {
                        const value = e.target.value;
                        setData("module_number", value);
                        setData("trainer_staff_id", "");
                        setData("lecture_room_id", "");
                        setData("program_version_unit_ids", []);
                        updateScopedFilters({
                          program_version_mapping_id: data.program_version_mapping_id,
                          module_number: value
                        });
                      },
                      disabled: !data.program_version_mapping_id,
                      className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select module..." }),
                        modules.map((module) => /* @__PURE__ */ jsx("option", { value: module.id, children: module.name }, module.id))
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
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Choose every course version unit that shares the same content and can be merged into one teaching room and slot." })
                ] }),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.program_version_unit_ids,
                    className: "mt-1"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3", children: available_units.length ? available_units.map((unit) => {
                  const checked = data.program_version_unit_ids.includes(
                    unit.id
                  );
                  return /* @__PURE__ */ jsxs(
                    "label",
                    {
                      className: `flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${checked ? "border-emerald-300 bg-emerald-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`,
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked,
                            onChange: (e) => toggleUnit(
                              unit.id,
                              e.target.checked
                            ),
                            className: "mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { children: unit.name })
                      ]
                    },
                    unit.id
                  );
                }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: data.program_version_mapping_id && data.module_number ? "No unassigned curriculum units are available for this course and module." : "Choose a versioned course and module to load curriculum units." }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
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
                      disabled: !data.program_version_unit_ids.length
                    }
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
                      defaultOptions: lecture_rooms,
                      value: data.lecture_room_id,
                      placeholder: "Select lecture room...",
                      onChange: (item) => setData("lecture_room_id", item.id),
                      error: errors.lecture_room_id,
                      disabled: !data.program_version_unit_ids.length
                    }
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
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Add one or more weekly meetings for this same merged class setup. Study slots are fixed to 08:00-10:00, 11:00-13:00, and 14:00-16:00, with break and lunch between them." })
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
                      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
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
                          /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-medium text-zinc-700", children: "Study Slot" }),
                          /* @__PURE__ */ jsx(
                            "select",
                            {
                              value: `${session.start_time}|${session.end_time}`,
                              onChange: (e) => {
                                const selectedSlot = STUDY_SLOTS.find(
                                  (slot) => slot.id === e.target.value
                                ) ?? STUDY_SLOTS[0];
                                const nextSessions = [
                                  ...data.sessions
                                ];
                                nextSessions[index] = {
                                  ...nextSessions[index],
                                  start_time: selectedSlot.start_time,
                                  end_time: selectedSlot.end_time
                                };
                                setData(
                                  "sessions",
                                  nextSessions
                                );
                              },
                              className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                              children: STUDY_SLOTS.map((slot) => /* @__PURE__ */ jsx(
                                "option",
                                {
                                  value: slot.id,
                                  children: slot.label
                                },
                                slot.id
                              ))
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: errors[`sessions.${index}.start_time`],
                              className: "mt-2"
                            }
                          ),
                          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-zinc-500", children: [
                            (STUDY_SLOTS.find(
                              (slot) => slot.id === `${session.start_time}|${session.end_time}`
                            ) ?? STUDY_SLOTS[0]).helper,
                            ". Break follows 10:00 and lunch follows 13:00."
                          ] }),
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
        ) })
      ]
    }
  );
}
export {
  CreateHod as default
};
