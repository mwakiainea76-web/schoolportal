import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import "react";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function Create({
  departments,
  trainers,
  lecture_rooms,
  program_version_units,
  days,
  current_department_id,
  selected_department_id
}) {
  const initialDepartment = selected_department_id || current_department_id || "";
  const { data, setData, post, processing, errors } = useForm({
    department_id: initialDepartment,
    trainer_staff_id: "",
    lecture_room_id: "",
    program_version_unit_ids: [],
    sessions: [
      {
        day_of_week: "monday",
        start_time: "",
        end_time: ""
      }
    ]
  });
  const filteredTrainers = data.department_id ? trainers.filter((trainer) => trainer.department_id === data.department_id) : trainers;
  const filteredUnits = data.department_id ? program_version_units.filter((unit) => unit.department_id === data.department_id) : program_version_units;
  const filteredRooms = data.department_id ? lecture_rooms.filter((room) => room.department_id === data.department_id) : lecture_rooms;
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
    post(route("academic.timetables.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Create Department Timetable" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Plan a real class session with trainer, hall, and one or more equivalent curriculum units that can be taught together across programs." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Create Timetable" }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl", children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: submit,
            className: "space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
            children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: "A trainer can merge students from different programs into one class when the content is the same. Select all matching curriculum units below, then assign one room and one weekly slot for that merged teaching session." }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
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
                        setData("trainer_staff_id", "");
                        setData("lecture_room_id", "");
                        setData("program_version_unit_ids", []);
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
                  /* @__PURE__ */ jsx(InputLabel, { value: "Trainer", required: true }),
                  /* @__PURE__ */ jsx(
                    SearchSelect,
                    {
                      routeName: null,
                      defaultOptions: filteredTrainers,
                      value: data.trainer_staff_id,
                      placeholder: "Select trainer...",
                      onChange: (item) => setData("trainer_staff_id", item.id),
                      error: errors.trainer_staff_id,
                      disabled: !data.department_id
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
                      defaultOptions: filteredRooms,
                      value: data.lecture_room_id,
                      placeholder: "Select lecture room...",
                      onChange: (item) => setData("lecture_room_id", item.id),
                      error: errors.lecture_room_id,
                      disabled: !data.department_id
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
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Curriculum Units in This Class" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Choose every program version unit that shares the same content and can be merged into one teaching room and slot." })
                ] }),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.program_version_unit_ids,
                    className: "mt-1"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: filteredUnits.length ? filteredUnits.map((unit) => {
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
                }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "No curriculum units available for the selected department." }) })
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
        ) })
      ]
    }
  );
}
export {
  Create as default
};
