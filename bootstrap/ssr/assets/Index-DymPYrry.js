import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700",
  deferred: "bg-amber-100 text-amber-700",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-zinc-100 text-zinc-600",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  deactivated: "bg-slate-100 text-slate-600"
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
    label: "Course",
    type: "search",
    routeName: "courses.search",
    placeholder: "Select course...",
    selectedLabelKey: "course",
    clears: ["curriculum_id"]
  },
  {
    key: "curriculum_id",
    label: "Curriculum",
    type: "search",
    routeName: "curriculums.search",
    placeholder: "Select curriculum...",
    selectedLabelKey: "curriculum",
    dependsOn: "course_id",
    disabledPlaceholder: "Select course first",
    routeParams: (form) => ({ course_id: form.course_id })
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
    routeParams: (form) => ({ academic_year_id: form.academic_year_id })
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
  courseEnrollments,
  filters = {},
  selectedFilters = {},
  is_hod = false,
  statuses = []
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [form, setForm] = useState({
    ...EMPTY_FILTERS,
    ...Object.fromEntries(
      Object.entries(pageFilters).filter(([key]) => key in EMPTY_FILTERS)
    )
  });
  const [filterLabels, setFilterLabels] = useState({
    department_id: selectedFilters.department || "",
    course_id: selectedFilters.course || "",
    curriculum_id: selectedFilters.curriculum || "",
    academic_year_id: selectedFilters.academic_year || "",
    academic_session_id: selectedFilters.academic_session || ""
  });
  const visibleFilterDefinitions = is_hod ? FILTER_DEFINITIONS.filter((filter) => filter.key !== "department_id") : FILTER_DEFINITIONS;
  const firstActiveFilter = visibleFilterDefinitions.find(
    (filter) => pageFilters[filter.key]
  );
  const [currentFilterKey, setCurrentFilterKey] = useState(
    firstActiveFilter?.key || ""
  );
  const activeFilters = visibleFilterDefinitions.filter((filter) => form[filter.key]);
  const setFilterValue = (key, value, label = "") => {
    const filter = visibleFilterDefinitions.find((item) => item.key === key);
    setForm((current) => {
      const next = {
        ...current,
        [key]: value
      };
      filter?.clears?.forEach((childKey) => {
        next[childKey] = "";
      });
      return next;
    });
    if (filter?.type === "search") {
      setFilterLabels((current) => ({
        ...current,
        [key]: label,
        ...(filter.clears || []).reduce(
          (labels, childKey) => ({ ...labels, [childKey]: "" }),
          {}
        )
      }));
    }
  };
  const selectFilterColumn = (nextKey) => {
    setCurrentFilterKey(nextKey);
  };
  const addCurrentFilter = () => {
    if (!currentFilterKey || !form[currentFilterKey]) {
      return;
    }
    setCurrentFilterKey("");
  };
  const clearSingleFilter = (key) => {
    const nextEmpty = { [key]: "" };
    if (key === "course_id") {
      nextEmpty.curriculum_id = "";
    }
    if (key === "academic_year_id") {
      nextEmpty.academic_session_id = "";
    }
    setForm((current) => ({
      ...current,
      ...nextEmpty
    }));
    setFilterLabels((current) => ({
      ...current,
      ...Object.keys(nextEmpty).reduce(
        (labels, emptyKey) => ({ ...labels, [emptyKey]: "" }),
        {}
      )
    }));
    if (currentFilterKey && currentFilterKey in nextEmpty) {
      setCurrentFilterKey("");
    }
  };
  const submit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== "" && value !== null)
    );
    router.get(
      route("courses.enrollments.index"),
      { ...cleanFilters, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const clearFilters = () => {
    setForm(EMPTY_FILTERS);
    setFilterLabels({});
    setCurrentFilterKey("");
    router.get(
      route("courses.enrollments.index"),
      { page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const getSelectedOptionLabel = (filter) => {
    if (filter.type === "search") {
      return filterLabels[filter.key] || selectedFilters[filter.selectedLabelKey] || form[filter.key];
    }
    if (filter.key === "status") {
      return labelStatus(form.status);
    }
    if (filter.key === "year_of_study") {
      return `Year ${form.year_of_study}`;
    }
    return form[filter.key];
  };
  const renderFilterInput = (filter) => {
    if (!filter) {
      return null;
    }
    const isDisabled = filter.dependsOn && !form[filter.dependsOn];
    if (filter.type === "text") {
      return /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: form[filter.key],
          onChange: (e) => setFilterValue(filter.key, e.target.value),
          placeholder: filter.placeholder,
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }
      );
    }
    if (filter.type === "select" || filter.type === "status") {
      const options = filter.type === "status" ? statuses.map((status) => ({
        value: status,
        label: labelStatus(status)
      })) : filter.options;
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[filter.key],
          onChange: (e) => setFilterValue(filter.key, e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: filter.placeholder }),
            options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
          ]
        }
      );
    }
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: filter.routeName,
        routeParams: filter.routeParams ? filter.routeParams(form) : void 0,
        disabled: Boolean(isDisabled),
        defaultOptions: [],
        value: form[filter.key],
        selectedLabel: filterLabels[filter.key] || selectedFilters[filter.selectedLabelKey],
        placeholder: isDisabled ? filter.disabledPlaceholder : filter.placeholder,
        preloadOptions: true,
        onChange: (option) => setFilterValue(filter.key, option?.id || "", option?.name || option?.label || "")
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full", children: [
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
                      visibleFilterDefinitions.map((filter) => /* @__PURE__ */ jsx("option", { value: filter.key, children: filter.label }, filter.key))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  InputLabel,
                  {
                    value: currentFilterKey ? visibleFilterDefinitions.find(
                      (filter) => filter.key === currentFilterKey
                    )?.label : "Filter Value"
                  }
                ),
                currentFilterKey ? renderFilterInput(
                  visibleFilterDefinitions.find(
                    (filter) => filter.key === currentFilterKey
                  )
                ) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" })
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
      /* @__PURE__ */ jsxs(Table, { pagination: courseEnrollments, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Reg No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Course" }),
          /* @__PURE__ */ jsx(THdata, { children: "Year" }),
          /* @__PURE__ */ jsx(THdata, { children: "Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Admitted" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: courseEnrollments?.data?.length ? courseEnrollments.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: item.student_name || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.admission_number || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.department ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.course ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.year_of_study ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.academic_session ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `rounded px-2 py-0.5 text-xs ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`,
              children: labelStatus(item.status)
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.created_at) })
        ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "text-center py-6", children: "No course enrollments found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
