import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
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
function Index({ lecture_rooms, departments, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("lecture-rooms.index"),
      {
        search,
        department_id: filters.department_id
      },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this lecture room?")) return;
    router.delete(route("lecture-rooms.destroy", id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Lecture Rooms" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Lecture Rooms" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Manage halls and classrooms used in the timetable, including merged classes shared across courses." })
      ] }) }),
      /* @__PURE__ */ jsxs("form", { className: "mb-6 grid gap-4 lg:grid-cols-[1fr_220px_120px]", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search room name, code, or location...",
            className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.department_id,
            onChange: (e) => router.get(
              route("lecture-rooms.index"),
              {
                search,
                department_id: e.target.value
              },
              { preserveState: true, replace: true }
            ),
            className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All departments" }),
              departments.map((department) => /* @__PURE__ */ jsx("option", { value: department.id, children: department.name }, department.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700",
            type: "submit",
            children: "Search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: lecture_rooms, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Code" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Capacity" }),
          /* @__PURE__ */ jsx(THdata, { children: "Location" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: lecture_rooms?.data?.length ? lecture_rooms.data.map((room) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: room.code }),
          /* @__PURE__ */ jsx(Tdata, { children: room.name }),
          /* @__PURE__ */ jsx(Tdata, { children: room.department?.name }),
          /* @__PURE__ */ jsx(Tdata, { children: room.capacity ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: room.location ?? "N/A" }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `rounded-full px-3 py-1 text-xs font-medium ${room.is_active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`,
              children: room.is_active ? "Active" : "Inactive"
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
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
                        "lecture-rooms.edit",
                        room.id
                      ),
                      children: "Edit"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      variant: "destructive",
                      onClick: () => handleDelete(room.id),
                      children: "Delete"
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }, room.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-8 text-center", children: "No lecture rooms found." }) }) })
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
  Index as default
};
