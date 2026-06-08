import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function Index({ hostels, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const submit = (e) => {
    e.preventDefault();
    router.get(route("hostels.index"), { search }, { preserveState: true, replace: true });
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this hostel?")) return;
    router.delete(route("hostels.destroy", id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Hostels" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        "form",
        {
          className: "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-[minmax(0,2fr)_140px] md:items-end lg:max-w-2xl", children: [
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Search" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search hostel name, code, or location...",
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
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
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: hostels, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Code" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Fee / Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Gender" }),
          /* @__PURE__ */ jsx(THdata, { children: "Rooms" }),
          /* @__PURE__ */ jsx(THdata, { children: "Beds" }),
          /* @__PURE__ */ jsx(THdata, { children: "Active Allocations" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: hostels?.data?.length ? hostels.data.map((hostel) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: hostel.code }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            hostel.name,
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-zinc-500", children: hostel.location || "No location" })
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: currency(hostel.session_fee_amount) }),
          /* @__PURE__ */ jsx(Tdata, { children: hostel.gender ? hostel.gender.toUpperCase() : "OPEN" }),
          /* @__PURE__ */ jsx(Tdata, { children: hostel.rooms_count }),
          /* @__PURE__ */ jsx(Tdata, { children: hostel.beds_count }),
          /* @__PURE__ */ jsx(Tdata, { children: hostel.active_allocations_count }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${hostel.is_active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`, children: hostel.is_active ? "Active" : "Inactive" }) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
            /* @__PURE__ */ jsx(Link, { href: route("hostels.edit", hostel.id), className: "text-emerald-600 hover:underline", children: "Edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(hostel.id), className: "text-red-600 hover:underline", children: "Delete" })
          ] }) })
        ] }, hostel.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "9", className: "py-8 text-center", children: "No hostels found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
