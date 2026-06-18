import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "lucide-react";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
function DepartmentStaffIndex({
  staffs,
  department_context = null
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("staffs.department.index"),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Department Staff" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Department Staff" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "View staff linked to your department only." }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100", children: department_context?.label })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "mb-4 flex w-full gap-x-7", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            placeholder: "Search by name, email or staff number...",
            value: searchTerm,
            onChange: (e) => {
              setSearchTerm(e.target.value);
            }
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
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: staffs, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Staff No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Email" }),
          /* @__PURE__ */ jsx(THdata, { children: "Role" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: staffs?.data?.length > 0 ? staffs.data.map((staff) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: staff.staff_number }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            staff.last_name,
            " ",
            staff.first_name
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.email }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.roles?.[0] ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: staff.department?.name ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: staff?.staff_status })
        ] }, staff.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "py-4 text-center", children: "No staff found." }) }) })
      ] })
    ] })
  ] });
}
const Table = ({ children, pagination, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Table$1, { ...props, children }),
  /* @__PURE__ */ jsx(TablePagination, { pagination })
] });
const Thead = ({ children, ...props }) => /* @__PURE__ */ jsx(TableHeader, { ...props, children: /* @__PURE__ */ jsx(TableRow, { children }) });
const THdata = (props) => /* @__PURE__ */ jsx(TableHead, { ...props });
const Tbody = (props) => /* @__PURE__ */ jsx(TableBody, { ...props });
const Trow = (props) => /* @__PURE__ */ jsx(TableRow, { ...props });
const Tdata = (props) => /* @__PURE__ */ jsx(TableCell, { ...props });
export {
  DepartmentStaffIndex as default
};
