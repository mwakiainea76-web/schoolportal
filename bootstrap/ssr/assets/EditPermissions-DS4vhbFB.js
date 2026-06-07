import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function EditRolePermissions({
  role,
  selected_permissions: permissions,
  permissions_data
}) {
  const [originalPermissions] = useState(permissions);
  const [selectedPermissions, setSelectedPermissions] = useState(permissions);
  const handleAdd = (selected) => {
    if (!selected) return;
    setSelectedPermissions((prev) => {
      const exists = prev.find((p) => p.id === selected.id);
      if (exists) return prev;
      return [...prev, selected];
    });
  };
  const removePermission = (id) => {
    setSelectedPermissions((prev) => prev.filter((p) => p.id !== id));
  };
  const submit = (e) => {
    e.preventDefault();
    router.post(route("roles.assign.permissions"), {
      role_id: role.id,
      permissions: selectedPermissions.map((p) => p.id)
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Role Permissions" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-lg shadow-sm p-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "Role Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "cursor-not-allowed",
            value: role.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "e.g. admin, staff, student"
          }
        ),
        /* @__PURE__ */ jsx("input", { type: "hidden", value: role.id })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "Add Permission" }),
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: "permissions.search",
            defaultOptions: permissions_data,
            placeholder: "Search permissions...",
            multiple: false,
            onChange: handleAdd
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-zinc-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "p-3 text-left", children: "#" }),
          /* @__PURE__ */ jsx("th", { className: "p-3 text-left", children: "Permission" }),
          /* @__PURE__ */ jsx("th", { className: "p-3 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: selectedPermissions.length > 0 ? selectedPermissions.map((p, i) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-t hover:bg-zinc-50",
            children: [
              /* @__PURE__ */ jsx("td", { className: "p-3", children: i + 1 }),
              /* @__PURE__ */ jsx("td", { className: "p-3 font-medium", children: p.name }),
              /* @__PURE__ */ jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removePermission(p.id),
                  className: "text-red-600 font-bold",
                  children: "✕"
                }
              ) })
            ]
          },
          p.id
        )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: "3",
            className: "text-center p-4 text-zinc-400",
            children: "No permissions assigned"
          }
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("roles.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: submit,
            className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700",
            children: "Save Changes"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  EditRolePermissions as default
};
