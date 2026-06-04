import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function Index({
  curriculum_units,
  filters = {},
  selected_course_version = null,
  selected_course_version_mapping = null
}) {
  const [sortField, setSortField] = useState(
    curriculum_units.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    curriculum_units.direction || "desc"
  );
  const [selectedFilters, setSelectedFilters] = useState({
    course_version_id: filters.course_version_id || "",
    course_version_mapping_id: filters.course_version_mapping_id || ""
  });
  const applyFilters = (nextFilters, nextSort = sortField, nextDirection = sortDirection) => {
    router.get(
      route("units.course-version-units.index"),
      {
        ...nextFilters,
        sort: nextSort,
        direction: nextDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    applyFilters(selectedFilters, field, direction);
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ^" : " v";
  };
  const handleCycleChange = (cycle) => {
    const nextFilters = {
      course_version_id: cycle.id ?? "",
      course_version_mapping_id: ""
    };
    setSelectedFilters(nextFilters);
    applyFilters(nextFilters);
  };
  const handlecourseChange = (course) => {
    const nextFilters = {
      ...selectedFilters,
      course_version_mapping_id: course.id ?? ""
    };
    setSelectedFilters(nextFilters);
    applyFilters(nextFilters);
  };
  const resetFilters = () => {
    const nextFilters = {
      course_version_id: "",
      course_version_mapping_id: ""
    };
    setSelectedFilters(nextFilters);
    applyFilters(nextFilters);
  };
  const handleDelete = (id) => {
    if (!confirm(
      "Are you sure you want to remove this unit from the course version?"
    )) {
      return;
    }
    router.delete(route("units.course-version-units.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Version Units" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Cycle" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "course-versions.search",
                defaultOptions: [],
                placeholder: "Select cycle...",
                value: selectedFilters.course_version_id,
                selectedLabel: selected_course_version?.name,
                preloadOptions: true,
                minSearchLength: 3,
                onChange: handleCycleChange
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Course" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "course-version-mappings.search",
                routeParams: {
                  course_version_id: selectedFilters.course_version_id
                },
                defaultOptions: [],
                placeholder: selectedFilters.course_version_id ? "Select course under cycle..." : "Select cycle first...",
                value: selectedFilters.course_version_mapping_id,
                selectedLabel: selected_course_version_mapping?.name,
                preloadOptions: true,
                minSearchLength: 3,
                onChange: handlecourseChange,
                disabled: !selectedFilters.course_version_id
              },
              selectedFilters.course_version_id || "no-cycle"
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: resetFilters,
            className: "rounded border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "Reset Filters"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: curriculum_units,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Unit Name ",
                    renderArrow("created_at")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Course" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("course_version_mapping_id"),
                  className: "cursor-pointer",
                  children: [
                    "Course Version",
                    " ",
                    renderArrow("course_version_mapping_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("module_taught"),
                  className: "cursor-pointer text-center",
                  children: [
                    "Module Taught ",
                    renderArrow("module_taught")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Assigned ",
                    renderArrow("created_at")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: curriculum_units?.data?.length ? curriculum_units.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: item.unit?.name }),
              /* @__PURE__ */ jsx(Tdata, { children: item.course_version?.course?.name ?? item.course_version_mapping?.course?.name }),
              /* @__PURE__ */ jsx(Tdata, { children: item.course_version?.name ?? item.course_version_mapping?.course_version?.name }),
              /* @__PURE__ */ jsxs(Tdata, { className: "text-center", children: [
                "Module ",
                item.module_taught
              ] }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-zinc-500 text-sm", children: formatDate(item.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "units.course-version-units.edit",
                      item.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(item.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "6",
                className: "text-center py-12 text-zinc-400",
                children: "No unit assignments found."
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
