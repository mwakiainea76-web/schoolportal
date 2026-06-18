import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-dropdown-menu";
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-amber-50 text-amber-700",
  graduated: "bg-blue-50 text-blue-700",
  dropped: "bg-red-50 text-red-700"
};
function StudentIndex({ students }) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("students.index"),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    router.delete(route("students.destroy", studentId), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Student Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("form", { className: "flex gap-2 w-full", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "w-full",
            placeholder: "Search by email or admission number...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition",
            children: "Search"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(Table, { pagination: students, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Admission Number" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Email" }),
          /* @__PURE__ */ jsx(THdata, { children: "Module" }),
          /* @__PURE__ */ jsx(THdata, { children: "Admission Date" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: students?.data?.length > 0 ? students.data.map((student) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { className: "font-mono text-xs", children: student.admission_number }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            student.last_name,
            " ",
            student.first_name
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: student.email }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            "Module ",
            student.current_module
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(student.admission_date) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 py-0.5 rounded-md text-xs font-medium capitalize
                                            ${STATUS_STYLES[student.student_status] ?? "bg-zinc-100 text-zinc-600"}`,
              children: student.student_status ?? "—"
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "size-8", children: [
              /* @__PURE__ */ jsx(MoreHorizontalIcon, {}),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { side: "left", align: "start", sideOffset: 8, className: "w-40", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: route(
                    "students.admission-letter",
                    student.id
                  ),
                  target: "_blank",
                  rel: "noreferrer",
                  children: "Letter"
                }
              ) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("students.edit", student.id), children: "Edit" }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  variant: "destructive",
                  onClick: () => handleDelete(student.id),
                  children: "Delete"
                }
              )
            ] })
          ] }) })
        ] }, student.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: "7",
            className: "text-center py-6 text-zinc-400",
            children: "No students found."
          }
        ) }) })
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
  StudentIndex as default
};
