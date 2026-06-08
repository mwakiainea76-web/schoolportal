import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import Create from "./Create-C8xVVcZz.js";
import Edit from "./Edit-EFvA_1sY.js";
import "./TextInput-DsoSnibl.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./Modal-CaUMk67x.js";
import "@headlessui/react";
import "./PrimaryButton-DsDrFqHJ.js";
function Index({
  academic_years,
  active_academic_year_id = "",
  filters = {}
}) {
  const [sortField, setSortField] = useState(
    filters.year_sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    filters.year_direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState(filters.year_search || "");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const fetchYears = (params) => {
    router.get(route("academic.years.index"), params, {
      preserveState: true,
      replace: true
    });
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    fetchYears({
      year_search: searchTerm,
      year_sort: field,
      year_direction: direction,
      year_page: 1
    });
  };
  const renderArrow = (field) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === "asc" ? " ^" : " v";
  };
  const submit = (event) => {
    event.preventDefault();
    fetchYears({
      year_search: searchTerm,
      year_sort: sortField,
      year_direction: sortDirection,
      year_page: 1
    });
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this academic year?")) {
      return;
    }
    router.delete(route("academic.years.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const updateStatus = (year, action) => {
    router.patch(
      route("academic.years.status", year.id),
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
        disabled: Boolean(active_academic_year_id) && String(active_academic_year_id) !== String(year.id),
        helper: "You can only reactivate an academic year after ending the previous one."
      };
    }
    return {
      label: "Upcoming",
      badgeClass: "bg-amber-100 text-amber-700",
      actionLabel: "Start Year",
      action: "start",
      disabled: Boolean(active_academic_year_id) && String(active_academic_year_id) !== String(year.id),
      helper: "You can only start an academic year after ending the previous one."
    };
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Years" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setAddModalOpen(true),
          className: "rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
          children: "Add Academic Year"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-slate-100 px-6 py-5", children: /* @__PURE__ */ jsxs(
          "form",
          {
            className: "relative flex w-full flex-col gap-3 md:flex-row",
            onSubmit: submit,
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search academic years...",
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 text-sm transition-all focus:border-emerald-400 focus:ring-0",
                  value: searchTerm,
                  onChange: (event) => setSearchTerm(event.target.value)
                }
              ),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "absolute left-4 top-3.5 h-4 w-4 text-zinc-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                      strokeWidth: "2"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700",
                  type: "submit",
                  children: "Search"
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxs(
          DirectoryTable,
          {
            pagination: academic_years,
            sortField,
            sortDirection,
            children: [
              /* @__PURE__ */ jsxs(Thead, { children: [
                /* @__PURE__ */ jsxs(
                  THdata,
                  {
                    onClick: () => handleSort("academic_year"),
                    className: "cursor-pointer",
                    children: [
                      "Academic Year",
                      renderArrow("academic_year")
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(THdata, { children: "Start Date" }),
                /* @__PURE__ */ jsx(THdata, { children: "End Date" }),
                /* @__PURE__ */ jsx(THdata, { children: "Status" }),
                /* @__PURE__ */ jsxs(
                  THdata,
                  {
                    onClick: () => handleSort("created_at"),
                    className: "cursor-pointer",
                    children: [
                      "Created",
                      renderArrow("created_at")
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(THdata, { children: "Actions" })
              ] }),
              /* @__PURE__ */ jsx(TBody, { children: academic_years?.data?.length ? academic_years.data.map((year) => {
                const status = getYearStatus(year);
                return /* @__PURE__ */ jsxs(Trow, { children: [
                  /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-slate-700", children: year.academic_year }),
                  /* @__PURE__ */ jsx(Tdata, { children: formatDate(year.start_date) }),
                  /* @__PURE__ */ jsx(Tdata, { children: formatDate(year.end_date) }),
                  /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `rounded px-2 py-0.5 text-xs ${status.badgeClass}`,
                      children: status.label
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Tdata, { children: formatDate(year.created_at) }),
                  /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditingYear(
                          year
                        ),
                        className: "text-emerald-600 hover:underline",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(
                          year.id
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
                        onClick: () => !status.disabled && updateStatus(
                          year,
                          status.action
                        ),
                        disabled: status.disabled,
                        className: `${status.disabled ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:text-emerald-700 hover:underline"}`,
                        children: status.actionLabel
                      }
                    )
                  ] }) })
                ] }, year.id);
              }) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
                Tdata,
                {
                  colSpan: "6",
                  className: "py-4 text-center",
                  children: "No records found."
                }
              ) }) })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Create,
      {
        modalMode: true,
        open: addModalOpen,
        onClose: () => setAddModalOpen(false)
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
    ) : null
  ] });
}
export {
  Index as default
};
