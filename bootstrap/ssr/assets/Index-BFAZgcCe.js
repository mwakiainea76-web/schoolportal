import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function Index({ allocations, filters, hostels, sessions }) {
  const [search, setSearch] = useState(filters.search || "");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("hostel-allocations.index"),
      {
        search,
        status: filters.status,
        hostel_id: filters.hostel_id,
        academic_session_id: filters.academic_session_id
      },
      { preserveState: true, replace: true }
    );
  };
  const updateFilter = (field, value) => {
    router.get(
      route("hostel-allocations.index"),
      {
        search,
        ...filters,
        [field]: value
      },
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Hostel Allocations" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Hostel Allocations" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Allocate beds per session, confirm that the student is enrolled first, and keep hostel billing tied to the allocation record." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsx(Link, { href: route("hostels.index"), className: "rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700", children: "Manage Hostels" }) })
      ] }),
      /* @__PURE__ */ jsx(
        "form",
        {
          className: "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_180px_220px_200px_140px] xl:items-end", children: [
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Search" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search student, hostel, room, or bed...",
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Status" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.status,
                  onChange: (e) => updateFilter("status", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All statuses" }),
                    /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsx("option", { value: "vacated", children: "Vacated" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Hostel" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.hostel_id,
                  onChange: (e) => updateFilter("hostel_id", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All hostels" }),
                    hostels.map((hostel) => /* @__PURE__ */ jsx("option", { value: hostel.id, children: hostel.name }, hostel.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Session" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.academic_session_id,
                  onChange: (e) => updateFilter("academic_session_id", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All sessions" }),
                    sessions.map((session) => /* @__PURE__ */ jsx("option", { value: session.id, children: session.name }, session.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700",
                type: "submit",
                children: "Search"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: allocations, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Hostel" }),
          /* @__PURE__ */ jsx(THdata, { children: "Room / Bed" }),
          /* @__PURE__ */ jsx(THdata, { children: "Fee" }),
          /* @__PURE__ */ jsx(THdata, { children: "Invoice" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Allocated On" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: allocations?.data?.length ? allocations.data.map((allocation) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsxs(Tdata, { children: [
            allocation.student_name,
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-zinc-500", children: allocation.registration_number })
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: allocation.session_name }),
          /* @__PURE__ */ jsx(Tdata, { children: allocation.hostel_name }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            /* @__PURE__ */ jsx("div", { children: allocation.room_name }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-zinc-500", children: allocation.bed_label })
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: currency(allocation.hostel_fee_amount) }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            allocation.invoice_number || "Pending",
            allocation.invoice_balance_due !== null ? /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-zinc-500", children: [
              "Balance ",
              currency(allocation.invoice_balance_due)
            ] }) : null
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${allocation.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`, children: allocation.status }) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(allocation.allocated_on) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(Link, { href: route("hostel-allocations.edit", allocation.id), className: "text-emerald-600 hover:underline", children: "Edit" }) })
        ] }, allocation.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "9", className: "py-8 text-center", children: "No hostel allocations found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
