import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
function Index({ permissions }) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("permissions.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("permissions.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection
      },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this permission?")) return;
    router.delete(route("permissions.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Permissions" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-7 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: "permissions.search",
            defaultOptions: permissions.data,
            placeholder: "Search permission...",
            onChange: (perm) => setSearchTerm(perm.name)
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
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: permissions, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("name"),
              className: "cursor-pointer",
              children: [
                "Permission ",
                renderArrow("name")
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
        /* @__PURE__ */ jsx(Tbody, { children: permissions?.data?.length > 0 ? permissions.data.map((permission) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: permission.name }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(permission.created_at) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "permissions.edit",
                  permission.id
                ),
                className: "text-emerald-600 hover:underline",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(permission.id),
                className: "text-red-600 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, permission.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "3", className: "text-center py-4", children: "No permissions found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
