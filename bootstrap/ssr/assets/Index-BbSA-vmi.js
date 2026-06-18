import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import Create from "./Create-Ba9diuG5.js";
import Edit from "./Edit-CF4ztwkK.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
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
import "@radix-ui/react-dropdown-menu";
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
    const key = year.status || (year.is_active ? "ongoing" : "upcoming");
    const status = YEAR_STATUS[key] || YEAR_STATUS.upcoming;
    const activating = ["start", "reactivate"].includes(status.action);
    return {
      ...status,
      disabled: activating && Boolean(active_academic_year_id) && String(active_academic_year_id) !== String(year.id),
      helper: "You can only activate an academic year after ending the previous one."
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
          Table,
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
              /* @__PURE__ */ jsx(Tbody, { children: academic_years?.data?.length ? academic_years.data.map((year) => {
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
                  /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-8",
                        children: [
                          /* @__PURE__ */ jsx(MoreHorizontalIcon, {}),
                          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuContent,
                      {
                        side: "left",
                        align: "start",
                        sideOffset: 8,
                        className: "w-44",
                        children: [
                          /* @__PURE__ */ jsx(
                            DropdownMenuItem,
                            {
                              onClick: () => setEditingYear(
                                year
                              ),
                              children: "Edit"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            DropdownMenuItem,
                            {
                              title: status.disabled ? status.helper : "",
                              disabled: status.disabled,
                              onClick: () => !status.disabled && updateStatus(
                                year,
                                status.action
                              ),
                              children: status.actionLabel
                            }
                          ),
                          year.status !== "on_hold" ? /* @__PURE__ */ jsx(
                            DropdownMenuItem,
                            {
                              onClick: () => updateStatus(
                                year,
                                "hold"
                              ),
                              children: "Put On Hold"
                            }
                          ) : null,
                          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                          /* @__PURE__ */ jsx(
                            DropdownMenuItem,
                            {
                              variant: "destructive",
                              onClick: () => handleDelete(
                                year.id
                              ),
                              children: "Delete"
                            }
                          )
                        ]
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
const Table = ({ children, pagination, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Table$1, { ...props, children }),
  /* @__PURE__ */ jsx(TablePagination, { pagination })
] });
const Thead = ({ children, ...props }) => /* @__PURE__ */ jsx(TableHeader, { ...props, children: /* @__PURE__ */ jsx(TableRow, { children }) });
const THdata = (props) => /* @__PURE__ */ jsx(TableHead, { ...props });
const Tbody = (props) => /* @__PURE__ */ jsx(TableBody, { ...props });
const Trow = (props) => /* @__PURE__ */ jsx(TableRow, { ...props });
const Tdata = (props) => /* @__PURE__ */ jsx(TableCell, { ...props });
export {
  Index as default
};
