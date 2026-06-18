import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-CORCWxM6.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
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
import "@radix-ui/react-dropdown-menu";
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Staff Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-7 mb-4", onSubmit: submit, children: [
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
            className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
            type: "submit",
            children: "Search"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Staff No" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Role" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Department" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: staffs?.data?.length > 0 ? staffs.data.map((staff) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-slate-700", children: staff.staff_number }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            staff.last_name,
            " ",
            staff.first_name
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: staff.email }),
          /* @__PURE__ */ jsx(TableCell, { children: staff.roles?.[0] ?? "N/A" }),
          /* @__PURE__ */ jsx(TableCell, { children: staff.department?.name ?? "N/A" }),
          /* @__PURE__ */ jsx(TableCell, { children: staff?.staff_status }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-8",
                children: [
                  /* @__PURE__ */ jsx(MoreHorizontalIcon, {}),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              DropdownMenuContent,
              {
                side: "left",
                align: "start",
                sideOffset: 8,
                className: "w-40",
                children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "staffs.edit",
                        staff.id
                      ),
                      children: "Edit"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      variant: "destructive",
                      onClick: () => handleDelete(staff.id),
                      children: "Delete"
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }, staff.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
          TableCell,
          {
            colSpan: "7",
            className: "h-24 text-center",
            children: "No staff found."
          }
        ) }) }),
        /* @__PURE__ */ jsx(TableFooter, { children: /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(
          TableCell,
          {
            colSpan: 7,
            className: "px-8 py-3 text-xs font-semibold tracking-widest text-slate-400",
            children: [
              "Showing ",
              staffs.from,
              " to ",
              staffs.to,
              " of",
              " ",
              staffs.total,
              " staff"
            ]
          }
        ) }) })
      ] }) }),
      staffs.links && staffs.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: staffs.links.map((link, index) => /* @__PURE__ */ jsx(
        Link,
        {
          href: link.url || "#",
          preserveState: true,
          preserveScroll: true,
          className: `rounded-md border px-3 py-2 text-sm ${link.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"} ${!link.url ? "pointer-events-none opacity-50" : ""}`,
          dangerouslySetInnerHTML: {
            __html: link.label
          }
        },
        index
      )) })
    ] })
  ] });
}
export {
  StaffIndex as default
};
