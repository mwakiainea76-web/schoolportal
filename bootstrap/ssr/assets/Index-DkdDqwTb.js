import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { F as FilterPanel } from "./FilterPanel-SRrGyhpx.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
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
const FILTER_DEFINITIONS = [
  {
    key: "curriculum_mapping_id",
    label: "Curriculum Mapping",
    type: "search",
    routeName: "curriculum.mappings.search",
    placeholder: "Search mapping...",
    selectedLabelKey: "mapping",
    minSearchLength: 2
  },
  {
    key: "unit_id",
    label: "Unit Name",
    type: "search",
    routeName: "units.search",
    placeholder: "Type in unit name...",
    selectedLabelKey: "unit",
    routeParams: (form) => ({
      curriculum_mapping_id: form.curriculum_mapping_id || "",
      module_taught: form.module_taught || ""
    }),
    dependsOn: "curriculum_mapping_id",
    minSearchLength: 2
  },
  {
    key: "module_taught",
    label: "Module Taught",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "Semester", label: "Semester" },
      { value: "Yearly", label: "Yearly" }
    ],
    dependsOn: "curriculum_mapping_id"
  },
  {
    key: "scope",
    label: "Scope",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "exam", label: "Exam" },
      { value: "coursework", label: "Coursework" },
      { value: "practical", label: "Practical" },
      { value: "other", label: "Other" }
    ],
    dependsOn: "curriculum_mapping_id"
  }
];
function Index({
  curriculumUnits,
  filters = {},
  selected_mapping_option = null,
  curriculum_mapping = null
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || "id"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || "asc"
  );
  const [exportFormat, setExportFormat] = useState("pdf");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    const cleanFilters = Object.fromEntries(
      Object.entries(pageFilters).filter(
        ([, v]) => v !== "" && v !== null
      )
    );
    router.get(
      route("units.index"),
      { ...cleanFilters, sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "^" : "v";
  };
  const handleExport = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(pageFilters).filter(
        ([, v]) => v !== "" && v !== null
      )
    );
    downloadExport("units", exportFormat, {
      ...cleanFilters,
      sort: sortField,
      direction: sortDirection
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculum Units" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Curriculum Units" }),
        (selected_mapping_option || curriculum_mapping) && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
          "Mapping:",
          " ",
          selected_mapping_option?.label ?? curriculum_mapping?.name ?? "N/A"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        FilterPanel,
        {
          definitions: FILTER_DEFINITIONS,
          filters,
          routeName: "units.index",
          extraParams: { sort: sortField, direction: sortDirection, page: 1 },
          quickKeys: ["curriculum_mapping_id", "unit_id"]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mb-2 flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: exportFormat,
            onChange: (e) => setExportFormat(e.target.value),
            className: "h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "pdf", children: "PDF" }),
              /* @__PURE__ */ jsx("option", { value: "csv", children: "CSV" }),
              /* @__PURE__ */ jsx("option", { value: "excel", children: "Excel" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleExport,
            className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600",
            children: [
              "Export ",
              exportFormat.toUpperCase()
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(Table, { pagination: curriculumUnits, children: [
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
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("unit"),
              className: "cursor-pointer",
              children: [
                "Unit ",
                renderArrow("unit")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("module_taught"),
              className: "cursor-pointer",
              children: [
                "Module Taught ",
                renderArrow("module_taught")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("scope"),
              className: "cursor-pointer",
              children: [
                "Scope ",
                renderArrow("scope")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("coefficient"),
              className: "cursor-pointer",
              children: [
                "Coefficient ",
                renderArrow("coefficient")
              ]
            }
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Curriculum Mapping" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: curriculumUnits?.data?.length ? curriculumUnits.data.map((unit) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: unit.id }),
          /* @__PURE__ */ jsx(Tdata, { children: unit.unit ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: unit.module_taught ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: unit.scope ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: unit.coefficient ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: unit.curriculum_mapping ?? "-" }),
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
            /* @__PURE__ */ jsx(
              DropdownMenuContent,
              {
                side: "left",
                align: "start",
                sideOffset: 8,
                className: "w-40",
                children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: route(
                      "curriculum-units.edit",
                      unit.id
                    ),
                    children: "Edit"
                  }
                ) })
              }
            )
          ] }) })
        ] }, unit.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-4 text-center", children: "No curriculum units found." }) }) })
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
