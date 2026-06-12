import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "ziggy-js";
const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-gray-100 text-gray-600"
};
const EMPTY_FILTERS = {
  course_id: "",
  curriculum_id: "",
  academic_year_id: "",
  academic_session_id: "",
  department_id: "",
  year_of_study: "",
  admission_number: "",
  status: ""
};
const FILTER_DEFINITIONS = [
  {
    key: "admission_number",
    label: "Admission Number",
    type: "text",
    placeholder: "Search by Reg No..."
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
  const [form, setForm] = useState({
    ...EMPTY_FILTERS,
    course_id: pageFilters.course_id || "",
    curriculum_id: pageFilters.curriculum_id || "",
    academic_year_id: pageFilters.academic_year_id || "",
    academic_session_id: pageFilters.academic_session_id || "",
    department_id: pageFilters.department_id || "",
    year_of_study: pageFilters.year_of_study || "",
    admission_number: pageFilters.admission_number || "",
    status: pageFilters.status || ""
  });
  const [currentFilterKey, setCurrentFilterKey] = useState("");
  const [activeFilterKeys, setActiveFilterKeys] = useState(
    FILTER_DEFINITIONS.map((filter) => filter.key).filter(
      (key) => Boolean(pageFilters[key])
    )
  );
  const setFilter = (key, value) => {
    const definition = FILTER_DEFINITIONS.find(
      (filter) => filter.key === key
    );
    setForm((current) => {
      const next = {
        ...current,
        [key]: value || ""
      };
      definition?.clears?.forEach((childKey) => {
        next[childKey] = "";
      });
      return next;
    });
    if (definition?.clears?.length) {
      setActiveFilterKeys(
        (current) => current.filter((filterKey) => !definition.clears.includes(filterKey))
      );
    }
  };
  const selectFilterColumn = (key) => {
    setCurrentFilterKey(key);
  };
  const addCurrentFilter = () => {
    if (!currentFilterKey || !form[currentFilterKey]) return;
    setActiveFilterKeys(
      (current) => current.includes(currentFilterKey) ? current : [...current, currentFilterKey]
    );
    setCurrentFilterKey("");
  };
  const clearSingleFilter = (key) => {
    const definition = FILTER_DEFINITIONS.find(
      (filter) => filter.key === key
    );
    setForm((current) => {
      const next = {
        ...current,
        [key]: ""
      };
      definition?.clears?.forEach((childKey) => {
        next[childKey] = "";
      });
      return next;
    });
    setActiveFilterKeys(
      (current) => current.filter(
        (filterKey) => filterKey !== key && !definition?.clears?.includes(filterKey)
      )
    );
    if (currentFilterKey === key) {
      setCurrentFilterKey("");
    }
  };
  const activeFilters = FILTER_DEFINITIONS.filter(
    (filter) => activeFilterKeys.includes(filter.key) && Boolean(form[filter.key])
  );
  const getSelectedOptionLabel = (filter) => {
    if (filter.type === "status") return labelStatus(form[filter.key]);
    if (filter.type === "select") {
      return filter.options.find(
        (option) => String(option.value) === String(form[filter.key])
      )?.label || form[filter.key];
    }
    if (filter.type === "text") return form[filter.key];
    return selectedFilters?.[filter.selectedLabelKey] || selectedFilters?.[filter.key] || form[filter.key];
  };
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    if (filter.type === "text") {
      return /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: form[filter.key],
          onChange: (e) => setFilter(filter.key, e.target.value),
          placeholder: filter.placeholder,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }
      );
    }
    if (filter.type === "select") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[filter.key],
          onChange: (e) => setFilter(filter.key, e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: filter.placeholder }),
            filter.options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
          ]
        }
      );
    }
    if (filter.type === "status") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form.status,
          onChange: (e) => setFilter("status", e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: filter.placeholder }),
            statuses.map((status) => /* @__PURE__ */ jsx("option", { value: status, children: labelStatus(status) }, status))
          ]
        }
      );
    }
    const disabled = filter.dependsOn && !form[filter.dependsOn];
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: filter.routeName,
        routeParams: typeof filter.routeParams === "function" ? filter.routeParams(form) : void 0,
        disabled: Boolean(disabled),
        defaultOptions: [],
        value: form[filter.key],
        selectedLabel: selectedFilters?.[filter.selectedLabelKey],
        placeholder: disabled ? filter.disabledPlaceholder : filter.placeholder,
        preloadOptions: true,
        onChange: (option) => setFilter(filter.key, option?.id || "")
      }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("academic.sessions.enrollments.index"),
      { ...form, sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const submit = (e) => {
    e.preventDefault();
    const appliedFilters = activeFilters.reduce((values, filter) => {
      values[filter.key] = form[filter.key];
      return values;
    }, {});
    router.get(
      route("academic.sessions.enrollments.index"),
      {
        ...appliedFilters,
        sort: sortField,
        direction: sortDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const clearFilters = () => {
    setForm(EMPTY_FILTERS);
    setCurrentFilterKey("");
    setActiveFilterKeys([]);
    router.get(
      route("academic.sessions.enrollments.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to remove this enrollment?"))
      return;
    router.delete(route("academic.session.enrollments.destroy", id), {
      preserveScroll: true,
      replace: true
    });
  };
  const currentFilter = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Session Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(300px,1fr)_auto_auto_auto]", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Filter Column" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: currentFilterKey,
                    onChange: (e) => selectFilterColumn(e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Choose column..." }),
                      FILTER_DEFINITIONS.map((filter) => /* @__PURE__ */ jsx("option", { value: filter.key, children: filter.label }, filter.key))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  InputLabel,
                  {
                    value: currentFilter ? currentFilter.label : "Filter Value"
                  }
                ),
                renderFilterInput(currentFilter)
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: addCurrentFilter,
                  disabled: !currentFilterKey || !form[currentFilterKey],
                  className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "+ Add filter"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: clearFilters,
                  className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-700 hover:bg-zinc-50",
                  children: "Clear all"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700",
                  type: "submit",
                  children: "Apply"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-zinc-100 pt-3", children: activeFilters.length ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.map((filter) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => clearSingleFilter(filter.key),
                className: "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100",
                children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    filter.label,
                    ": ",
                    getSelectedOptionLabel(filter)
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-900", children: "×" })
                ]
              },
              filter.key
            )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No filters selected. Choose a column above to filter this table." }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: enrollments,
          sortField,
          sortDirection,
          children: [
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
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "academic.sessions.enrollments.edit",
                      enrollment.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(enrollment.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
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
          ]
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
