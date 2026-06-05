import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { u as useRbac, A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-DbLPTvUh.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function UnitsIndex({ units }) {
  const [sortField, setSortField] = useState(units.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    units.direction || "desc"
  );
  const { can } = useRbac();
  const [searchTerm, setSearchTerm] = useState("");
  const { url, props } = usePage();
  props.auth.user;
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("units.index"),
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
      route("units.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    router.delete(route("units.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Units" }),
    /* @__PURE__ */ jsxs("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      can("units.edit") ? /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "units.search",
                defaultOptions: units.data,
                placeholder: "Type in unit name ...",
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
      ) : null,
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
                  onClick: () => handleSort("id"),
                  className: "cursor-pointer",
                  children: [
                    "Id ",
                    renderArrow("id")
                  ]
                }
              ),
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
                  onClick: () => handleSort("credit_factor"),
                  className: "cursor-pointer",
                  children: [
                    "Credits ",
                    renderArrow("credit_factor")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Training Hours" }),
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
              can("units.edit") || can("units.delete") ? /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) }) : null
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: units?.data?.length ? units.data.map((unit) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: unit.id }),
              /* @__PURE__ */ jsx(Tdata, { children: unit.code }),
              /* @__PURE__ */ jsx(Tdata, { children: unit.name }),
              /* @__PURE__ */ jsx(Tdata, { children: unit.credit_factor }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                unit.training_hours,
                " hrs"
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(unit.created_at) }),
              can("units.edit") || can("units.delete") ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                can("units.edit") ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "units.edit",
                      encodeURIComponent(
                        unit.id
                      )
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ) : null,
                can("units.delete") ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      unit.code
                    ),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                ) : null
              ] }) }) : null
            ] }, unit.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "9", className: "text-center py-4", children: "No units found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
UnitsIndex.layout = (page) => /* @__PURE__ */ jsx(AuthenticatedLayout, { children: page });
export {
  UnitsIndex as default
};
