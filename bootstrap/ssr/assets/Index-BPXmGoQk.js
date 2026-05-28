import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function RolesIndex({ roles }) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("roles.index"),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    router.delete(route("roles.destroy", roleId), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Roles Management" }),
    /* @__PURE__ */ jsxs("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("roles.create"),
          className: "px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700",
          children: "Add Role"
        }
      ) }),
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-7 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: "roles.search",
            defaultOptions: roles.data,
            placeholder: "Type here role name ...",
            onChange: (rol) => setSearchTerm(rol.name)
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
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: roles, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Id" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Permissions Count" }),
          /* @__PURE__ */ jsx(THdata, { children: "Created" }),
          /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: " text-center", children: "Actions" }) })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: roles?.data?.length > 0 ? roles.data.map((role) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: role.id }),
          /* @__PURE__ */ jsx(Tdata, { className: "font-semibold", children: role.name }),
          /* @__PURE__ */ jsx(Tdata, { children: role.permissions?.length ?? 0 }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(role.created_at) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "roles.edit",
                  encodeURIComponent(role.id)
                ),
                className: "text-emerald-600 hover:underline",
                children: "Edit role"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "roles.permissions.edit",
                  encodeURIComponent(role.id)
                ),
                className: "text-emerald-600 hover:underline",
                children: "Edit permissions"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(role.id),
                className: "text-red-600 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, role.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "5", className: "text-center py-4", children: "No roles found." }) }) })
      ] })
    ] })
  ] });
}
export {
  RolesIndex as default
};
