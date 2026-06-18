import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-Lxy5yAUM.js";
import { F as FilterPanel } from "./FilterPanel-B_xT30Ex.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
import "./SearchSelect-CY7NDfHZ.js";
const FILTER_DEFINITIONS = [
  {
    key: "course_id",
    label: "Course Name",
    type: "search",
    routeName: "courses.search",
    placeholder: "Select course...",
    selectedLabelKey: "course"
  },
  {
    key: "curriculum_id",
    label: "Curriculum",
    type: "search",
    routeName: "curriculums.search",
    placeholder: "Search curriculum...",
    selectedLabelKey: "curriculum"
  },
  {
    key: "college_id",
    label: "College",
    type: "search",
    routeName: "colleges.search",
    placeholder: "Search college...",
    selectedLabelKey: "college"
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
    key: "programme_id",
    label: "Programme",
    type: "search",
    routeName: "programmes.search",
    placeholder: "Search programme...",
    selectedLabelKey: "programme"
  }
];
function EditIndex({
  courses,
  filters = {},
  filters: { sort = "created_at", direction = "desc" }
}) {
  const [sortField, setSortField] = useState(sort);
  const [sortDirection, setSortDirection] = useState(direction);
  const [exportFormat, setExportFormat] = useState("pdf");
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }
    router.delete(route("courses.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  const handleSort = (field) => {
    const dir = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(dir);
    const cleanFilters = Object.fromEntries(
      Object.entries(pageFilters).filter(
        ([, v]) => v !== "" && v !== null
      )
    );
    router.get(
      route("courses.edit.index"),
      { ...cleanFilters, sort: field, direction: dir, page: 1 },
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
    downloadExport("courses", exportFormat, {
      ...cleanFilters,
      sort: sortField,
      direction: sortDirection
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Edit Index" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Course Edit Index" }) }),
      /* @__PURE__ */ jsx(
        FilterPanel,
        {
          definitions: FILTER_DEFINITIONS,
          filters,
          routeName: "courses.edit.index",
          extraParams: { sort: sortField, direction: sortDirection, page: 1 },
          quickKeys: ["course_id", "curriculum_id"]
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
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleExport,
            className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600",
            children: "Export"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(Table, { pagination: courses, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("code"),
              className: "cursor-pointer",
              children: [
                "Course Code ",
                renderArrow("code")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("name"),
              className: "cursor-pointer",
              children: [
                "Course Name ",
                renderArrow("name")
              ]
            }
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Curriculum" }),
          /* @__PURE__ */ jsx(THdata, { children: "College" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Programme" }),
          /* @__PURE__ */ jsx(THdata, { children: "Action" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: courses?.data?.length ? courses.data.map((course) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: course.code }),
          /* @__PURE__ */ jsx(Tdata, { children: course.name }),
          /* @__PURE__ */ jsx(Tdata, { children: course.curriculum ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: course.college ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: course.department ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: course.programme ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "courses.edit",
                  encodeURIComponent(
                    course.id
                  )
                ),
                className: "text-emerald-600 hover:underline",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(course.id),
                className: "text-red-600 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, course.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-4 text-center", children: "No courses found." }) }) })
      ] })
    ] })
  ] });
}
export {
  EditIndex as default
};
