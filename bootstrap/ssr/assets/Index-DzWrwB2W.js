import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Index({ components }) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(route("fees.components.index"), {
      search: searchTerm
    });
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this fee component?")) return;
    router.delete(route("fees.components.destroy", id));
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Components" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between mb-4", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("fees.components.create"),
          className: "px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700",
          children: "Add Component"
        }
      ) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex gap-4 mb-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search component...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "border p-2 rounded w-full"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "px-4 py-1 bg-emerald-600 text-white rounded", children: "Search" })
      ] }),
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: components, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Type" }),
          /* @__PURE__ */ jsx(THdata, { children: "Amount" }),
          /* @__PURE__ */ jsx(THdata, { children: "Frequency" }),
          /* @__PURE__ */ jsx(THdata, { children: "Optional" }),
          /* @__PURE__ */ jsx(THdata, { children: "Template" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: components.data.length ? components.data.map((c) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: c.name }),
          /* @__PURE__ */ jsx(Tdata, { children: c.type }),
          /* @__PURE__ */ jsx(Tdata, { children: c.amount }),
          /* @__PURE__ */ jsx(Tdata, { children: c.frequency }),
          /* @__PURE__ */ jsx(Tdata, { children: c.is_optional ? "Yes" : "No" }),
          /* @__PURE__ */ jsx(Tdata, { children: c.template?.name }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "fees.components.edit",
                  c.id
                ),
                className: "text-emerald-600",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(c.id),
                className: "text-red-600",
                children: "Delete"
              }
            )
          ] }) })
        ] }, c.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "text-center", children: "No components found" }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
