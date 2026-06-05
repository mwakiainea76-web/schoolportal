import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
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
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
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
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: lecture_rooms, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Code" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Capacity" }),
          /* @__PURE__ */ jsx(THdata, { children: "Location" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: lecture_rooms?.data?.length ? lecture_rooms.data.map((room) => /* @__PURE__ */ jsxs(Trow, { children: [
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
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-8", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("lecture-rooms.edit", room.id),
                className: "text-emerald-600 hover:underline",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(room.id),
                className: "text-red-600 hover:underline",
                children: "Delete"
              }
            )
          ] }) })
        ] }, room.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-8 text-center", children: "No lecture rooms found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
