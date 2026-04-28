import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function FeeModelsIndex({
  feeModels,
  templates,
  departments,
  curricula,
  academicSessions
}) {
  const [sortField, setSortField] = useState(feeModels.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    feeModels.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    scope: "",
    priority: "",
    template: "",
    department: "",
    curriculum: "",
    academic_session: "",
    valid: ""
  });
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("fees.models.index"),
      { sort: field, direction, page: 1, ...filters },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    router.get(
      route("fees.models.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection,
        ...newFilters,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("fees.models.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection,
        ...filters
      },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this fee model?")) return;
    router.delete(route("fees.models.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const getStatusBadge = (isActive, isValid) => {
    if (!isActive)
      return /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded", children: "Inactive" });
    if (!isValid)
      return /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-xs bg-red-100 text-red-800 rounded", children: "Expired" });
    return /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-800 rounded", children: "Active" });
  };
  const getScopeBadge = (scope) => {
    const colors = {
      global: "bg-blue-100 text-blue-800",
      department: "bg-purple-100 text-purple-800",
      curriculum: "bg-orange-100 text-orange-800"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-2 py-1 text-xs rounded capitalize ${colors[scope] || "bg-gray-100 text-gray-800"}`,
        children: scope
      }
    );
  };
  const getPriorityBadge = (priority) => {
    const colors = {
      60: "bg-green-100 text-green-800",
      70: "bg-yellow-100 text-yellow-800",
      80: "bg-red-100 text-red-800"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-2 py-1 text-xs rounded ${colors[priority] || "bg-gray-100 text-gray-800"}`,
        children: priority
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Models" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("fees.models.create"),
          className: "mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block",
          children: "Add Fee Model"
        }
      ),
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-6 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: "fee-templates.search",
            defaultOptions: templates,
            placeholder: "Search templates...",
            onChange: (t) => setSearchTerm(t.name)
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
            children: "Search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.status,
            onChange: (e) => handleFilterChange("status", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.scope,
            onChange: (e) => handleFilterChange("scope", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Scopes" }),
              /* @__PURE__ */ jsx("option", { value: "global", children: "Global" }),
              /* @__PURE__ */ jsx("option", { value: "department", children: "Department" }),
              /* @__PURE__ */ jsx("option", { value: "curriculum", children: "Curriculum" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.priority,
            onChange: (e) => handleFilterChange("priority", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Priorities" }),
              /* @__PURE__ */ jsx("option", { value: "60", children: "Low (60)" }),
              /* @__PURE__ */ jsx("option", { value: "70", children: "Medium (70)" }),
              /* @__PURE__ */ jsx("option", { value: "80", children: "High (80)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.valid,
            onChange: (e) => handleFilterChange("valid", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Validity" }),
              /* @__PURE__ */ jsx("option", { value: "valid", children: "Valid" }),
              /* @__PURE__ */ jsx("option", { value: "expired", children: "Expired" }),
              /* @__PURE__ */ jsx("option", { value: "upcoming", children: "Upcoming" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.template,
            onChange: (e) => handleFilterChange("template", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Templates" }),
              templates.map((template) => /* @__PURE__ */ jsx("option", { value: template.id, children: template.name }, template.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.department,
            onChange: (e) => handleFilterChange("department", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Departments" }),
              departments.map((dept) => /* @__PURE__ */ jsx("option", { value: dept.id, children: dept.name }, dept.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.curriculum,
            onChange: (e) => handleFilterChange("curriculum", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Curricula" }),
              curricula.map((curr) => /* @__PURE__ */ jsx("option", { value: curr.id, children: curr.name }, curr.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.academic_session,
            onChange: (e) => handleFilterChange(
              "academic_session",
              e.target.value
            ),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Sessions" }),
              academicSessions.map((session) => /* @__PURE__ */ jsx("option", { value: session.id, children: session.session_No }, session.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: feeModels,
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
                    "ID ",
                    renderArrow("id")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Template" }),
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
                  onClick: () => handleSort("priority"),
                  className: "cursor-pointer",
                  children: [
                    "Priority ",
                    renderArrow("priority")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Department" }),
              /* @__PURE__ */ jsx(THdata, { children: "Curriculum" }),
              /* @__PURE__ */ jsx(THdata, { children: "Valid From" }),
              /* @__PURE__ */ jsx(THdata, { children: "Valid Until" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("is_active"),
                  className: "cursor-pointer",
                  children: [
                    "Status ",
                    renderArrow("is_active")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Created ",
                    renderArrow("created_at")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: feeModels?.data?.length ? feeModels.data.map((feeModel) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: feeModel.id }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: feeModel.template?.name }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: feeModel.display_name })
              ] }) }),
              /* @__PURE__ */ jsx(Tdata, { children: getScopeBadge(feeModel.scope) }),
              /* @__PURE__ */ jsx(Tdata, { children: getPriorityBadge(feeModel.priority) }),
              /* @__PURE__ */ jsx(Tdata, { children: feeModel.department?.name || "—" }),
              /* @__PURE__ */ jsx(Tdata, { children: feeModel.curriculum?.name || "—" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(feeModel.valid_from) }),
              /* @__PURE__ */ jsx(Tdata, { children: feeModel.valid_until ? formatDate(feeModel.valid_until) : "No end date" }),
              /* @__PURE__ */ jsx(Tdata, { children: getStatusBadge(
                feeModel.is_active,
                feeModel.is_valid
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(feeModel.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "fees.models.edit",
                      encodeURIComponent(
                        feeModel.id
                      )
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      encodeURIComponent(
                        feeModel.id
                      )
                    ),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, feeModel.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "11",
                className: "text-center py-4",
                children: "No fee models found."
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  FeeModelsIndex as default
};
