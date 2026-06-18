import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { F as FilterPanel } from "./FilterPanel-SRrGyhpx.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
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
import "ziggy-js";
import "./SearchSelect-PvfiRNjv.js";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-gray-100 text-gray-600"
};
const FILTER_DEFINITIONS = [
  {
    key: "admission_number",
    label: "Admission Number",
    type: "text",
    placeholder: "Search by Reg No..."
  },
  {
    key: "course_id",
    label: "Course Name",
    type: "search",
    routeName: "courses.search",
    placeholder: "Select course...",
    selectedLabelKey: "course",
    clears: ["curriculum_id"]
  },
  {
    key: "curriculum_id",
    label: "Curriculum Name",
    type: "search",
    routeName: "curriculums.search",
    placeholder: "Select curriculum...",
    selectedLabelKey: "curriculum",
    dependsOn: "course_id",
    disabledPlaceholder: "Select course first"
  },
  {
    key: "department_id",
    label: "Department",
    type: "search",
    routeName: "departments.search",
    placeholder: "Search department...",
    selectedLabelKey: "department"
  },
  {
    key: "academic_year_id",
    label: "Academic Year",
    type: "search",
    routeName: "academic-years.search",
    placeholder: "Select academic year...",
    selectedLabelKey: "academic_year",
    clears: ["academic_session_id"]
  },
  {
    key: "academic_session_id",
    label: "Academic Session",
    type: "search",
    routeName: "academic-sessions.search",
    placeholder: "Select academic session...",
    selectedLabelKey: "academic_session",
    dependsOn: "academic_year_id",
    disabledPlaceholder: "Select academic year first",
    routeParams: (form) => ({
      academic_year_id: form.academic_year_id
    })
  },
  {
    key: "year_of_study",
    label: "Year of Study",
    type: "select",
    placeholder: "All years",
    options: [
      { value: "1", label: "Year 1" },
      { value: "2", label: "Year 2" },
      { value: "3", label: "Year 3" },
      { value: "4", label: "Year 4" }
    ]
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    placeholder: "All statuses"
  }
];
const labelStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
function Index({
  enrollments,
  filters = {},
  selectedFilters = {},
  statuses = []
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || "desc"
  );
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("academic.sessions.enrollments.index"),
      {
        ...Object.fromEntries(
          Object.entries(pageFilters).filter(
            ([, v]) => v !== "" && v !== null
          )
        ),
        sort: field,
        direction,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to remove this enrollment?"))
      return;
    router.delete(route("academic.session.enrollments.destroy", id), {
      preserveScroll: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Session Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl", children: [
      /* @__PURE__ */ jsx(
        FilterPanel,
        {
          definitions: FILTER_DEFINITIONS,
          filters,
          selectedFilters,
          statuses,
          routeName: "academic.sessions.enrollments.index",
          extraParams: {
            sort: sortField,
            direction: sortDirection,
            page: 1
          },
          quickKeys: [
            "admission_number",
            "course_id",
            "year_of_study",
            "status"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(Table, { pagination: enrollments, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("id"),
              className: "cursor-pointer",
              children: [
                "Id ",
                renderArrow("id")
              ]
            }
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Reg No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Curriculum" }),
          /* @__PURE__ */ jsx(THdata, { children: "Course" }),
          /* @__PURE__ */ jsx(THdata, { children: "Year" }),
          /* @__PURE__ */ jsx(THdata, { children: "Module" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("created_at"),
              className: "cursor-pointer",
              children: [
                "Enrolled ",
                renderArrow("created_at")
              ]
            }
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: enrollments?.data?.length ? enrollments.data.map((enrollment) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: enrollment.id }),
          /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-slate-700", children: enrollment.student_name }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-slate-500", children: enrollment.admission_number }),
          /* @__PURE__ */ jsx(Tdata, { children: enrollment.department }),
          /* @__PURE__ */ jsx(Tdata, { children: enrollment.session }),
          /* @__PURE__ */ jsx(Tdata, { children: enrollment.curriculum }),
          /* @__PURE__ */ jsx(Tdata, { children: enrollment.course }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: enrollment.year_of_study }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: enrollment.module }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 py-0.5 rounded text-xs ${STATUS_STYLES[enrollment.status] ?? "bg-gray-100 text-gray-600"}`,
              children: labelStatus(enrollment.status)
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(enrollment.created_at) }),
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
                className: "w-40",
                children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "academic.sessions.enrollments.edit",
                        enrollment.id
                      ),
                      children: "Edit"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      variant: "destructive",
                      onClick: () => handleDelete(
                        enrollment.id
                      ),
                      children: "Delete"
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }, enrollment.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: "12",
            className: "text-center py-4",
            children: "No enrollments found."
          }
        ) }) })
      ] })
    ] })
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
