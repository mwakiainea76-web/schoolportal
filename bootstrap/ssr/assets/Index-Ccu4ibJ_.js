import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function CertificationLevels({ certificationLevels }) {
  const [sortField, setSortField] = useState(
    certificationLevels.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    certificationLevels.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("certification-levels.index"),
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
      route("certification-levels.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm(
      "Are you sure you want to delete this certification level?"
    ))
      return;
    router.delete(
      route("certification-levels.destroy", encodeURIComponent(id)),
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Certification Levels" }),
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
                routeName: "certification-levels.search",
                defaultOptions: certificationLevels.data,
                placeholder: "Type in certification level name ...",
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
        DirectoryTable,
        {
          pagination: certificationLevels,
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
              /* @__PURE__ */ jsx(THdata, { children: "Exam body" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("entry_grade"),
                  className: "cursor-pointer",
                  children: [
                    "Entry Grade ",
                    renderArrow("entry_grade")
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
            /* @__PURE__ */ jsx(TBody, { children: certificationLevels?.data?.length ? certificationLevels.data.map((cert) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: cert.code }),
              /* @__PURE__ */ jsx(Tdata, { children: cert.name }),
              /* @__PURE__ */ jsx(Tdata, { children: cert.exam_body.name }),
              /* @__PURE__ */ jsx(Tdata, { children: cert.entry_grade }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(cert.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "certification-levels.edit",
                      encodeURIComponent(cert.id)
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(cert.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, cert.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "text-center py-4", children: "No certification levels found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CertificationLevels as default
};
