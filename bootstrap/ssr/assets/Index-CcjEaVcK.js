import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import Create from "./Create-Ba9diuG5.js";
import Edit from "./Edit-CF4ztwkK.js";
import Create$1 from "./Create-CXbfGxYY.js";
import Edit$1 from "./Edit-CQ41snrP.js";
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
import "./TextInput-DsoSnibl.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./Modal-CaUMk67x.js";
import "@headlessui/react";
import "./PrimaryButton-DsDrFqHJ.js";
const YEAR_STATUS = {
  upcoming: {
    label: "Upcoming",
    badgeClass: "bg-amber-100 text-amber-700",
    actionLabel: "Start Year",
    action: "start"
  },
  ongoing: {
    label: "Ongoing",
    badgeClass: "bg-green-100 text-green-700",
    actionLabel: "End Year",
    action: "end"
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-red-100 text-red-600",
    actionLabel: "Reactivate",
    action: "reactivate"
  },
  on_hold: {
    label: "On hold",
    badgeClass: "bg-slate-100 text-slate-700",
    actionLabel: "Activate",
    action: "start"
  }
};
const SESSION_STATUS = {
  upcoming: {
    label: "Upcoming",
    badgeClass: "bg-amber-100 text-amber-700",
    actionLabel: "Start Session",
    action: "start"
  },
  ongoing: {
    label: "Ongoing",
    badgeClass: "bg-green-100 text-green-700",
    actionLabel: "End Session",
    action: "end"
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-red-100 text-red-600",
    actionLabel: "Reactivate",
    action: "reactivate"
  },
  on_hold: {
    label: "On hold",
    badgeClass: "bg-slate-100 text-slate-700",
    actionLabel: "Activate",
    action: "start"
  }
};
function Index({
  academic_years = [],
  selected_academic_year_id = "",
  active_academic_session_id = "",
  academic_sessions = [],
  filters = {}
}) {
  const [yearSearchTerm, setYearSearchTerm] = useState(
    filters.year_search || ""
  );
  const [addYearModalOpen, setAddYearModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const activeAcademicYearId = useMemo(
    () => academic_years.find((year) => year.is_active)?.id ? String(academic_years.find((year) => year.is_active)?.id) : "",
    [academic_years]
  );
  const selectedYear = academic_years.find(
    (year) => String(year.id) === String(selected_academic_year_id)
  );
  const nextSessionNumber = useMemo(() => {
    if (!academic_sessions.length) {
      return 1;
    }
    return Math.max(
      ...academic_sessions.map(
        (session) => Number(session.session_No || 0)
      )
    ) + 1;
  }, [academic_sessions]);
  const fetchSessions = (params) => {
    router.get(route("academic.sessions.index"), params, {
      preserveState: true,
      replace: true
    });
  };
  const selectAcademicYear = (year) => {
    fetchSessions({
      academic_year_id: year.id,
      year_search: yearSearchTerm
    });
  };
  const submitYearSearch = (event) => {
    event.preventDefault();
    fetchSessions({
      academic_year_id: selected_academic_year_id,
      year_search: yearSearchTerm
    });
  };
  const handleDeleteSession = (id) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }
    router.delete(route("academic.sessions.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const handleDeleteYear = (id) => {
    if (!confirm("Are you sure you want to delete this academic year?")) {
      return;
    }
    router.delete(route("academic.years.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const updateYearStatus = (year, action) => {
    router.patch(
      route("academic.years.status", year.id),
      { action },
      {
        preserveScroll: true
      }
    );
  };
  const updateSessionStatus = (session, action) => {
    router.patch(
      route("academic.sessions.status", session.id),
      { action },
      {
        preserveScroll: true
      }
    );
  };
  const getYearStatus = (year) => {
    const key = year.status || (year.is_active ? "ongoing" : "upcoming");
    const status = YEAR_STATUS[key] || YEAR_STATUS.upcoming;
    const activating = ["start", "reactivate"].includes(status.action);
    return {
      ...status,
      disabled: activating && Boolean(activeAcademicYearId) && String(activeAcademicYearId) !== String(year.id),
      helper: "You can only activate an academic year after ending the previous one."
    };
  };
  const getSessionStatus = (session) => {
    const key = session.status || (session.is_active ? "ongoing" : "upcoming");
    const status = SESSION_STATUS[key] || SESSION_STATUS.upcoming;
    const activating = ["start", "reactivate"].includes(status.action);
    return {
      ...status,
      disabled: activating && Boolean(active_academic_session_id) && String(active_academic_session_id) !== String(session.id),
      helper: "You can only activate a session after ending the previous.",
      title: "You can only activate a session after ending the previous."
    };
  };
  const stopSelection = (event, callback) => {
    event.stopPropagation();
    callback();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Sessions" }),
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "mb-8 grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxs("section", { className: "w-full min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-slate-900", children: "Academic Years" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-h-[30rem] w-full rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-zinc-600", children: "Academic Years" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setAddYearModalOpen(true),
                className: "shrink-0 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800",
                children: "Add Academic Year"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(
            "form",
            {
              className: "flex flex-col gap-3 md:flex-row",
              onSubmit: submitYearSearch,
              children: [
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.years.search",
                    defaultOptions: academic_years.map(
                      (year) => ({
                        id: String(year.id),
                        name: year.label || year.academic_year
                      })
                    ),
                    value: selected_academic_year_id,
                    selectedLabel: yearSearchTerm,
                    placeholder: "Search academic years...",
                    preloadOptions: true,
                    minSearchLength: 0,
                    onChange: (item) => {
                      setYearSearchTerm(item?.name || "");
                      if (item?.id) {
                        fetchSessions({
                          academic_year_id: item.id,
                          year_search: item.name || ""
                        });
                      }
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setYearSearchTerm("");
                      fetchSessions({});
                    },
                    className: "rounded border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700",
                    title: "Clear academic year filter",
                    children: "X"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "rounded bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800",
                    type: "submit",
                    children: "Search"
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academic_years.length > 0 ? academic_years.map((year) => {
            const isSelected = String(year.id) === String(selected_academic_year_id);
            const status = getYearStatus(year);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                role: "button",
                tabIndex: 0,
                onClick: () => selectAcademicYear(year),
                onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectAcademicYear(year);
                  }
                },
                className: `block w-full rounded-lg border px-5 py-5 text-left shadow-sm transition ${isSelected ? "border-emerald-100 bg-emerald-50" : "border-zinc-100 bg-zinc-50 hover:bg-white"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-lg font-semibold text-slate-700", children: year.academic_year }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [
                        "Start",
                        " ",
                        formatDate(
                          year.start_date
                        ),
                        " ",
                        "| End",
                        " ",
                        formatDate(
                          year.end_date
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `rounded px-2 py-0.5 text-xs ${status.badgeClass}`,
                        children: status.label
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (event) => stopSelection(
                          event,
                          () => setEditingYear(
                            year
                          )
                        ),
                        className: "text-emerald-600 hover:underline",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (event) => stopSelection(
                          event,
                          () => handleDeleteYear(
                            year.id
                          )
                        ),
                        className: "text-red-600 hover:underline",
                        children: "Delete"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        title: status.disabled ? status.helper : "",
                        disabled: status.disabled,
                        onClick: (event) => stopSelection(
                          event,
                          () => !status.disabled && updateYearStatus(
                            year,
                            status.action
                          )
                        ),
                        className: `${status.disabled ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:text-emerald-700 hover:underline"}`,
                        children: status.actionLabel
                      }
                    ),
                    year.status !== "on_hold" ? /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (event) => stopSelection(
                          event,
                          () => updateYearStatus(
                            year,
                            "hold"
                          )
                        ),
                        className: "text-slate-700 hover:text-emerald-700 hover:underline",
                        children: "Put On Hold"
                      }
                    ) : null
                  ] })
                ]
              },
              year.id
            );
          }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500", children: "No academic years found." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "w-full min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Academic Sessions" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-h-[30rem] w-full rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl font-medium text-zinc-600", children: [
              "Sessions for",
              " ",
              selectedYear?.academic_year ?? "No year selected"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setAddSessionModalOpen(true),
                disabled: !selectedYear,
                className: "shrink-0 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300",
                children: "Add Academic Session"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { children: selected_academic_year_id ? academic_sessions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academic_sessions.map((session) => {
            const status = getSessionStatus(session);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-lg border border-zinc-100 bg-zinc-50 px-5 py-5 shadow-sm",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-slate-800", children: [
                        "Session",
                        " ",
                        session.session_No
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-3 text-sm text-slate-500", children: [
                        /* @__PURE__ */ jsxs("span", { children: [
                          "Start:",
                          " ",
                          formatDate(
                            session.start_date
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          "End:",
                          " ",
                          formatDate(
                            session.end_date
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          "Created:",
                          " ",
                          formatDate(
                            session.created_at
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `rounded px-2 py-0.5 text-xs ${status.badgeClass}`,
                        children: status.label
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditingSession(
                          session
                        ),
                        className: "text-emerald-600 hover:underline",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDeleteSession(
                          session.id
                        ),
                        className: "text-red-600 hover:underline",
                        children: "Delete"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        title: status.disabled ? status.helper : "",
                        disabled: status.disabled,
                        onClick: () => !status.disabled && updateSessionStatus(
                          session,
                          status.action
                        ),
                        className: `${status.disabled ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:text-emerald-700 hover:underline"}`,
                        children: status.actionLabel
                      }
                    ),
                    session.status !== "on_hold" ? /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => updateSessionStatus(
                          session,
                          "hold"
                        ),
                        className: "text-slate-700 hover:text-emerald-700 hover:underline",
                        children: "Put On Hold"
                      }
                    ) : null
                  ] })
                ]
              },
              session.id
            );
          }) }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500", children: "No sessions found for the selected academic year." }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500", children: "Select an academic year to view its sessions." }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Create,
      {
        modalMode: true,
        open: addYearModalOpen,
        onClose: () => setAddYearModalOpen(false)
      }
    ),
    editingYear ? /* @__PURE__ */ jsx(
      Edit,
      {
        modalMode: true,
        open: Boolean(editingYear),
        onClose: () => setEditingYear(null),
        academic_year: editingYear
      }
    ) : null,
    /* @__PURE__ */ jsx(
      Create$1,
      {
        modalMode: true,
        open: addSessionModalOpen,
        onClose: () => setAddSessionModalOpen(false),
        academic_year: selectedYear,
        session_no: nextSessionNumber,
        prerequisite_error: selectedYear ? null : "Select an academic year before creating a session."
      }
    ),
    editingSession ? /* @__PURE__ */ jsx(
      Edit$1,
      {
        modalMode: true,
        open: Boolean(editingSession),
        onClose: () => setEditingSession(null),
        academic_session: editingSession
      }
    ) : null
  ] });
}
export {
  Index as default
};
