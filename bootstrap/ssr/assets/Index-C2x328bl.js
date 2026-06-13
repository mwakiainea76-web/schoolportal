import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
function ExamBody({ examBodies }) {
  const [sortField, setSortField] = useState(examBodies.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    examBodies.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("exam.bodies.index"),
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
      route("exam.bodies.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this exam body?")) return;
    router.delete(route("exam-bodies.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Exam Bodies" }),
    /* @__PURE__ */ jsxs("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "exam.bodies.search",
                defaultOptions: examBodies.data,
                placeholder: "Type  exam body name ...",
                onChange: (body) => setSearchTerm(body.code)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
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
          pagination: examBodies,
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
                  onClick: () => handleSort("description"),
                  className: "cursor-pointer",
                  children: [
                    "Description ",
                    renderArrow("description")
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
            /* @__PURE__ */ jsx(Tbody, { children: examBodies?.data?.length ? examBodies.data.map((examBody) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: examBody.code }),
              /* @__PURE__ */ jsx(Tdata, { children: examBody.name }),
              /* @__PURE__ */ jsx(Tdata, { children: examBody.description }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(examBody.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "exam.bodies.edit",
                      examBody.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(examBody.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, examBody.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "text-center py-4", children: "No exam bodies found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ExamBody as default
};
