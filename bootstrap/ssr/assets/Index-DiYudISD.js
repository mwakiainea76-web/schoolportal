import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import "ziggy-js";
function Index({
  curriculum_mapping,
  selected_mapping_option,
  filters = {},
  selectedFilters = {},
  units
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || units.sort || "module_taught"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || units.direction || "asc"
  );
  const [form, setForm] = useState({
    unit_id: pageFilters.unit_id || "",
    module_taught: pageFilters.module_taught || "",
    course_id: pageFilters.course_id || "",
    exam_body_id: pageFilters.exam_body_id || "",
    certification_level_id: pageFilters.certification_level_id || "",
    curriculum_mapping_id: pageFilters.curriculum_mapping_id || selected_mapping_option?.id || curriculum_mapping?.id || ""
  });
  const setFilter = (key, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [key]: value
      };
      if (key === "exam_body_id") {
        next.course_id = "";
        next.certification_level_id = "";
        next.unit_id = "";
        next.curriculum_mapping_id = "";
      }
      if (key === "course_id" || key === "certification_level_id" || key === "curriculum_mapping_id") {
        next.unit_id = "";
      }
      if (key === "course_id" || key === "certification_level_id") {
        next.curriculum_mapping_id = "";
      }
      return next;
    });
  };
  const effectiveCurriculumMappingId = form.course_id || form.exam_body_id || form.certification_level_id ? "" : form.curriculum_mapping_id;
  const currentFilters = () => ({
    unit_id: form.unit_id,
    module_taught: form.module_taught,
    course_id: form.course_id,
    exam_body_id: form.exam_body_id,
    certification_level_id: form.certification_level_id,
    curriculum_mapping_id: effectiveCurriculumMappingId
  });
  const applyFilters = (nextSort = sortField, nextDirection = sortDirection) => {
    router.get(
      route("units.index"),
      {
        ...currentFilters(),
        sort: nextSort,
        direction: nextDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    applyFilters(sortField, sortDirection);
  };
  const clearFilters = () => {
    setForm({
      unit_id: "",
      module_taught: "",
      course_id: "",
      exam_body_id: "",
      certification_level_id: "",
      curriculum_mapping_id: ""
    });
    router.get(
      route("units.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    applyFilters(field, direction);
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ^" : " v";
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) {
      return;
    }
    router.delete(route("units.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const title = curriculum_mapping ? `Units for ${curriculum_mapping.curriculum?.name}` : "Units";
  const subtitle = curriculum_mapping?.course?.name || "All units";
  const displayedFiltersCount = [
    form.unit_id,
    form.module_taught,
    form.course_id,
    form.exam_body_id,
    form.certification_level_id,
    form.curriculum_mapping_id
  ].filter(Boolean).length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit Name" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "units.search",
                    defaultOptions: [],
                    value: form.unit_id,
                    selectedLabel: selectedFilters.unit,
                    routeParams: {
                      curriculum_mapping_id: effectiveCurriculumMappingId || "",
                      module_taught: form.module_taught || "",
                      course_id: form.course_id || "",
                      exam_body_id: form.exam_body_id || "",
                      certification_level_id: form.certification_level_id || ""
                    },
                    placeholder: "Select unit...",
                    preloadOptions: true,
                    minSearchLength: 2,
                    onChange: (unit) => setFilter("unit_id", unit.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Module Taught" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    defaultOptions: [1, 2, 3, 4, 5, 6].map(
                      (module) => ({
                        id: String(module),
                        name: `Module ${module}`
                      })
                    ),
                    value: form.module_taught,
                    placeholder: "Select module...",
                    onChange: (module) => setFilter("module_taught", module.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum Course" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "courses.search",
                    defaultOptions: [],
                    value: form.course_id,
                    selectedLabel: selectedFilters.course,
                    routeParams: {
                      versioned_only: 1,
                      exam_body_id: form.exam_body_id || ""
                    },
                    placeholder: "Select active course...",
                    preloadOptions: true,
                    onChange: (course) => setFilter("course_id", course.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "exam-bodies.search",
                    defaultOptions: [],
                    value: form.exam_body_id,
                    selectedLabel: selectedFilters.exam_body,
                    placeholder: "Type to search exam body...",
                    preloadOptions: true,
                    onChange: (examBody) => setFilter("exam_body_id", examBody.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Certification Level" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "certification-levels.search",
                    defaultOptions: [],
                    value: form.certification_level_id,
                    selectedLabel: selectedFilters.certification_level,
                    routeParams: {
                      exam_body_id: form.exam_body_id || ""
                    },
                    placeholder: "Type to search level...",
                    preloadOptions: true,
                    onChange: (level) => setFilter(
                      "certification_level_id",
                      level.id
                    )
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: clearFilters,
                  className: "rounded bg-zinc-400 px-4 py-2 text-sm text-white hover:bg-zinc-600",
                  children: "Clear"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-slate-700",
                  type: "submit",
                  children: "Search"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-900", children: title }),
          /* @__PURE__ */ jsxs("p", { className: "text-zinc-500", children: [
            subtitle,
            displayedFiltersCount ? ` | ${displayedFiltersCount} filter${displayedFiltersCount > 1 ? "s" : ""} applied` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("units.create", {
              curriculum_mapping_id: selected_mapping_option?.id || curriculum_mapping?.id || ""
            }),
            className: "rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500",
            children: "Add Unit"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: units,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("code"),
                  className: "cursor-pointer",
                  children: [
                    "Code ",
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
                    "Name ",
                    renderArrow("name")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("module_taught"),
                  className: "cursor-pointer text-center",
                  children: [
                    "Module ",
                    renderArrow("module_taught")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Course" }),
              /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
              /* @__PURE__ */ jsx(THdata, { children: "Certification Level" }),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Compulsory" }),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: units?.data?.length ? units.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { className: "font-mono text-sm", children: item.code }),
              /* @__PURE__ */ jsx(Tdata, { children: item.name }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: item.module_taught }),
              /* @__PURE__ */ jsx(Tdata, { children: item.curriculum_mapping?.course?.name || "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: item.curriculum_mapping?.course?.certification_level?.exam_body ? `${item.curriculum_mapping.course.certification_level.exam_body.code} - ${item.curriculum_mapping.course.certification_level.exam_body.name}` : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: item.curriculum_mapping?.course?.certification_level?.name || "-" }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: item.is_compulsory ? /* @__PURE__ */ jsx("span", { className: "text-emerald-600", children: "Yes" }) : /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "No" }) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "units.edit",
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
                colSpan: "8",
                className: "py-12 text-center text-zinc-400",
                children: "No units found for the selected filters."
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
