import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-Lxy5yAUM.js";
import { F as FilterPanel } from "./FilterPanel-B_xT30Ex.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
import "./SearchSelect-CY7NDfHZ.js";
const FILTER_DEFINITIONS = [
  {
    key: "curriculum_id",
    label: "Curriculum",
    type: "search",
    routeName: "curriculums.search",
    placeholder: "Search curriculum...",
    selectedLabelKey: "curriculum"
  },
  {
    key: "course_id",
    label: "Course Name",
    type: "search",
    routeName: "courses.search",
    placeholder: "Select course...",
    selectedLabelKey: "course",
    routeParams: (form) => ({ scope: form.curriculum_id || "" })
  },
  {
    key: "mapping_type",
    label: "Mapping Type",
    type: "select",
    options: [
      { value: "", label: "All Types" },
      { value: "core", label: "Core" },
      { value: "elective", label: "Elective" }
    ]
  },
  {
    key: "status",
    label: "Status",
    type: "status"
  }
];
function Index({
  curriculumMappings,
  filters = {}
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || "desc"
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
      route("courses.curriculum-mappings.index"),
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
    downloadExport("curriculumMappings", exportFormat, {
      ...cleanFilters,
      sort: sortField,
      direction: sortDirection
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculum Mappings" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Curriculum Mappings" }) }),
      /* @__PURE__ */ jsx(
        FilterPanel,
        {
          definitions: FILTER_DEFINITIONS,
          filters,
          routeName: "courses.curriculum-mappings.index",
          extraParams: { sort: sortField, direction: sortDirection, page: 1 },
          quickKeys: ["curriculum_id", "course_id"]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mb-2 flex justify-end", children: /* @__PURE__ */ jsx("div", { className: "flow-root", children: /* @__PURE__ */ jsxs("div", { className: "-mx-3 -my-1.5 flex items-center justify-end", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("courses.curriculum-mappings.create"),
            className: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700",
            children: "Add New"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "ml-2 flex items-center", children: [
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
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleExport,
              className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600",
              children: "Export"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(Table, { pagination: curriculumMappings, children: [
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
          /* @__PURE__ */ jsx(THdata, { children: "Curriculum" }),
          /* @__PURE__ */ jsx(THdata, { children: "Course" }),
          /* @__PURE__ */ jsx(THdata, { children: "Mapping Type" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("created_at"),
              className: "cursor-pointer",
              children: [
                "Created At ",
                renderArrow("created_at")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("updated_at"),
              className: "cursor-pointer",
              children: [
                "Updated At ",
                renderArrow("updated_at")
              ]
            }
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: curriculumMappings?.data?.length ? curriculumMappings.data.map((mapping) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: mapping.id }),
          /* @__PURE__ */ jsx(Tdata, { children: mapping.curriculum }),
          /* @__PURE__ */ jsx(Tdata, { children: mapping.course }),
          /* @__PURE__ */ jsx(Tdata, { children: mapping.mapping_type }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${mapping.status ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`,
              children: mapping.status ? "Active" : "Inactive"
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(mapping.created_at) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(mapping.updated_at) }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "courses.curriculum-mappings.edit",
                  mapping.id
                ),
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "units.index",
                  {
                    curriculum_mapping_id: mapping.id
                  }
                ),
                className: "ml-2",
                children: "Units"
              }
            )
          ] })
        ] }, mapping.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-4 text-center", children: "No curriculum mappings found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
