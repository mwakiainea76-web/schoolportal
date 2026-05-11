import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "lucide-react";
import "react-toastify";
function StaffIndex({ staffs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("staffs.index"),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (staffId) => {
    if (!confirm("Are you sure you want to delete this staff?")) return;
    router.delete(route("staffs.destroy", staffId), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Staff Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("staffs.create"),
          className: "px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700",
          children: "Add Staff"
        }
      ) }),
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-7 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            placeholder: "Type staff email here",
            value: searchTerm,
            onChange: (e) => {
              setSearchTerm(e.target.value);
            }
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
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: staffs, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Staff No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Email" }),
          /* @__PURE__ */ jsx(THdata, { children: "Role" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: staffs?.data?.length > 0 ? staffs.data.map((staff) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: staff.staff_number }),
          /* @__PURE__ */ jsxs(Tdata, { className: "", children: [
            staff.user.last_name,
            " ",
            staff.user.first_name
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.user.email }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.user?.roles?.[0]?.name ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.department?.name ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: staff?.staff_status }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "staffs.edit",
                  staff.id
                ),
                className: "text-emerald-600 hover:underline",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(staff.id),
                className: "text-red-600 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, staff.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "text-center py-4", children: "No staff found." }) }) })
      ] })
    ] })
  ] });
}
export {
  StaffIndex as default
};
