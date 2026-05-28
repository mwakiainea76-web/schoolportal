import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function ProgramsIndex({ programs }) {
  const [sortField, setSortField] = useState(programs.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    programs.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("programs.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "^" : "v";
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("programs.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this program?")) {
      return;
    }
    router.delete(route("programs.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Programs" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "mb-4 inline-block rounded bg-slate-400 px-4 py-1 text-white hover:bg-slate-700",
          href: route("programs.create"),
          children: "Add Program"
        }
      ),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "relative flex w-full gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "programs.search",
                defaultOptions: programs.data,
                placeholder: "Type in program name ...",
                onChange: (body) => setSearchTerm(body.code ?? "")
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
        DirectoryTable,
        {
          pagination: programs,
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
                  onClick: () => handleSort("certification_level_id"),
                  className: "cursor-pointer",
                  children: [
                    "Certification Level",
                    " ",
                    renderArrow("certification_level_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("department_id"),
                  className: "cursor-pointer",
                  children: [
                    "Department ",
                    renderArrow("department_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Current Program Version" }),
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
            /* @__PURE__ */ jsx(TBody, { children: programs?.data?.length ? programs.data.map((program) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: program.id }),
              /* @__PURE__ */ jsx(Tdata, { children: program.code }),
              /* @__PURE__ */ jsx(Tdata, { children: program.name }),
              /* @__PURE__ */ jsx(Tdata, { children: program.certification_level ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: program.department ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: program.curriculum ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(program.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "programs.edit",
                      encodeURIComponent(program.id)
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(program.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, program.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-4 text-center", children: "No programs found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ProgramsIndex as default
};
