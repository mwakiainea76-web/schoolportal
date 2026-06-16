import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "ziggy-js";
function FeeAssignmentsIndex({ assignments, filters }) {
  const [sortField, setSortField] = useState(
    assignments.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    assignments.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(filters.show_inactive === "true" || false);
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("fees.assignments.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("fees.assignments.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection
      },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return;
    }
    router.delete(route("fees.assignments.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const courseCertificationLabel = (assignment) => {
    const courseName = assignment.curriculum_mapping?.course?.name || assignment.curriculum_mapping?.course?.name;
    const certificationName = assignment.curriculum_mapping?.course?.certificationLevel?.name || assignment.curriculum_mapping?.course?.certification_level?.name || assignment.curriculum_mapping?.course?.certificationLevel?.name || assignment.curriculum_mapping?.course?.certification_level?.name;
    if (!courseName && !certificationName) {
      return "-";
    }
    return [courseName, certificationName].filter(Boolean).join(" - ");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Assignments" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const newShowInactive = !showInactive;
              setShowInactive(newShowInactive);
              router.get(
                route("fees.assignments.index"),
                { ...filters, show_inactive: newShowInactive },
                { preserveState: true, replace: true }
              );
            },
            className: `rounded px-4 py-1 transition ${showInactive ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"}`,
            children: showInactive ? "Showing All" : "Active Only"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.assignments.bulk.index"),
              className: "rounded bg-blue-600 px-4 py-1 text-white transition hover:bg-blue-800",
              children: "Bulk Assign"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "rounded bg-orange-100 px-4 py-1 text-orange-700", children: "Bulk Replace starts from Preview" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "relative mb-4 flex w-full gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "fees.assignments.search",
                defaultOptions: assignments.data,
                placeholder: "Search fee plan...",
                onChange: (item) => setSearchTerm(item.id)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700",
                type: "submit",
                children: "Search"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: assignments,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("curriculum_mapping_id"),
                  children: [
                    "Course / Certification",
                    " ",
                    renderArrow("curriculum_mapping_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("fee_plan_id"), children: [
                "Fee Plan ",
                renderArrow("fee_plan_id")
              ] }),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("year_of_study"), children: [
                "Year Of Study ",
                renderArrow("year_of_study")
              ] }),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("session_number"), children: [
                "Session Number ",
                renderArrow("session_number")
              ] }),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("is_active"), children: [
                "Status ",
                renderArrow("is_active")
              ] }),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("valid_from"), children: [
                "Valid From ",
                renderArrow("valid_from")
              ] }),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("valid_to"), children: [
                "Valid To ",
                renderArrow("valid_to")
              ] }),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: assignments?.data?.length ? assignments.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: courseCertificationLabel(item) }),
              /* @__PURE__ */ jsx(Tdata, { children: item.fee_plan?.name ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: item.year_of_study ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: item.session_number ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`,
                  children: item.is_active ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.valid_from) }),
              /* @__PURE__ */ jsx(Tdata, { children: item.valid_to ? formatDate(item.valid_to) : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "fees.assignments.edit",
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
            ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-4 text-center", children: "No fee assignments found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  FeeAssignmentsIndex as default
};
