import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import AcademicCalendarWorkspaceTabs from "./AcademicCalendarWorkspaceTabs-BIDzA_tP.js";
import Create from "./Create-ByQn9DKP.js";
import Edit from "./Edit-CsfoZXW7.js";
import Create$1 from "./Create-mydU9e3m.js";
import Edit$1 from "./Edit-BlHYvLIc.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
import "./TextInput-DsoSnibl.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./Modal-CaUMk67x.js";
import "@headlessui/react";
import "./PrimaryButton-DsDrFqHJ.js";
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
    if (year.is_active) {
      return {
        label: "Ongoing",
        badgeClass: "bg-green-100 text-green-700",
        actionLabel: "End Year",
        action: "end",
        disabled: false,
        helper: ""
      };
    }
    if (year.end_date) {
      return {
        label: "Completed",
        badgeClass: "bg-red-100 text-red-600",
        actionLabel: "Reactivate",
        action: "reactivate",
        disabled: Boolean(activeAcademicYearId) && String(activeAcademicYearId) !== String(year.id),
        helper: "You can only reactivate an academic year after ending the previous one."
      };
    }
    return {
      label: "Upcoming",
      badgeClass: "bg-amber-100 text-amber-700",
      actionLabel: "Start Year",
      action: "start",
      disabled: Boolean(activeAcademicYearId) && String(activeAcademicYearId) !== String(year.id),
      helper: "You can only start an academic year after ending the previous one."
    };
  };
  const getSessionStatus = (session) => {
    if (session.is_active) {
      return {
        label: "Ongoing",
        badgeClass: "bg-green-100 text-green-700",
        actionLabel: "End Session",
        action: "end",
        disabled: false,
        helper: ""
      };
    }
    if (session.end_date) {
      return {
        label: "Completed",
        badgeClass: "bg-red-100 text-red-600",
        actionLabel: "Reactivate",
        action: "reactivate",
        disabled: Boolean(active_academic_session_id) && String(active_academic_session_id) !== String(session.id),
        helper: "You can only reactivate a session after ending the previous active one."
      };
    }
    return {
      label: "Upcoming",
      badgeClass: "bg-amber-100 text-amber-700",
      actionLabel: "Start Session",
      action: "start",
      disabled: Boolean(active_academic_session_id) && String(active_academic_session_id) !== String(session.id),
      helper: "You can only start session after ending the previous.",
      title: "You can only start session after ending the previous."
    };
  };
  const stopSelection = (event, callback) => {
    event.stopPropagation();
    callback();
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Sessions" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(AcademicCalendarWorkspaceTabs, { activeTab: "sessions" }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-6 lg:flex-row lg:items-start", children: [
        /* @__PURE__ */ jsxs("section", { className: "w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:w-[380px] xl:w-[430px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 px-6 py-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Academic Years" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setAddYearModalOpen(true),
                className: "rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
                children: "+ Add Academic Year"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-b border-slate-100 px-6 py-5", children: /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: academic_years.length > 0 ? academic_years.map((year) => {
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
                className: `block w-full px-6 py-5 text-left transition ${isSelected ? "bg-emerald-50" : "bg-white hover:bg-slate-50"}`,
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
                    )
                  ] })
                ]
              },
              year.id
            );
          }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-10 text-center text-sm text-slate-500", children: "No academic years found." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "min-h-[260px] w-full min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-slate-900", children: [
              "Sessions for",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: selectedYear?.academic_year ?? "No year selected" })
            ] }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setAddSessionModalOpen(true),
                disabled: !selectedYear,
                className: "rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300",
                children: "+ Add Academic Session"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-6", children: selected_academic_year_id ? academic_sessions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academic_sessions.map((session) => {
            const status = getSessionStatus(session);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-slate-200 bg-white px-5 py-4",
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
                    )
                  ] })
                ]
              },
              session.id
            );
          }) }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-16 text-center text-sm text-slate-500", children: "No sessions found for the selected academic year." }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-16 text-center text-sm text-slate-500", children: "Select an academic year to view its sessions." }) })
        ] })
      ] })
    ] }),
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
