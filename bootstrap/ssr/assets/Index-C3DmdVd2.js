import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { CheckCircle2, Wallet, BedDouble, Home } from "lucide-react";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function Index({
  activeSession,
  enrollment,
  eligibility,
  hostels = [],
  existingInvoice,
  allocation
}) {
  const { data, setData, post, processing, errors } = useForm({
    hostel_id: ""
  });
  const selectedHostel = hostels.find(
    (hostel) => hostel.id === data.hostel_id
  );
  const submit = (e) => {
    e.preventDefault();
    post(route("student.hostel-booking.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Book Hostel" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full animate-in fade-in slide-in-from-bottom-2 duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600", children: "Hostel" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-2 text-2xl font-semibold text-zinc-950", children: "Book Hostel Accommodation" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-500", children: eligibility.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-zinc-50 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Active Session" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: activeSession?.name ?? "Not available" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-zinc-500", children: "Session Registration" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: enrollment ? "Registered" : "Required" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl bg-sky-50 p-3 text-sky-700", children: /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-zinc-500", children: "Hostel Invoice" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: existingInvoice ? existingInvoice.invoice_number : "Not requested" }),
          existingInvoice ? /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
            "Balance ",
            currency(existingInvoice.balance_due)
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl bg-amber-50 p-3 text-amber-700", children: /* @__PURE__ */ jsx(BedDouble, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-zinc-500", children: "Bed Allocation" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: allocation ? allocation.hostel : "Pending" }),
          allocation ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-zinc-500", children: [allocation.room, allocation.bed].filter(Boolean).join(" - ") }) : null
        ] })
      ] }),
      existingInvoice ? /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-900", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Hostel invoice ready" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sky-800", children: [
            "Amount ",
            currency(existingInvoice.amount_due),
            existingInvoice.due_date ? `, due ${formatDate(existingInvoice.due_date)}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route(
              "student.fee-statements.show",
              existingInvoice.id
            ),
            className: "inline-flex justify-center rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800",
            children: "View Statement"
          }
        )
      ] }) }) : null,
      !eligibility.can_book ? /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Booking unavailable" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1", children: eligibility.message }),
        !enrollment ? /* @__PURE__ */ jsx(
          Link,
          {
            href: route("dashboard"),
            className: "mt-4 inline-flex rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800",
            children: "Go to Dashboard"
          }
        ) : null
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-5", children: [
        /* @__PURE__ */ jsx(InputError, { message: errors.hostel_id }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-5 lg:grid-cols-3", children: hostels.length ? hostels.map((hostel) => {
          const selected = data.hostel_id === hostel.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setData("hostel_id", hostel.id),
              className: `flex h-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition ${selected ? "border-emerald-500 ring-2 ring-emerald-100" : "border-zinc-100 hover:border-emerald-200"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500", children: hostel.code }),
                    /* @__PURE__ */ jsx("h2", { className: "mt-2 text-lg font-semibold text-zinc-950", children: hostel.name })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-emerald-50 p-3 text-emerald-700", children: /* @__PURE__ */ jsx(Home, { className: "h-5 w-5" }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 text-sm text-zinc-500", children: hostel.description || hostel.location || "Hostel accommodation" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-zinc-50 px-3 py-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Fee" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: currency(
                      hostel.session_fee_amount
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-zinc-50 px-3 py-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Available Beds" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: hostel.available_beds_count })
                  ] })
                ] })
              ]
            },
            hostel.id
          );
        }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 text-sm text-zinc-500 lg:col-span-3", children: "No hostel with an available bed is currently open for your session." }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: selectedHostel ? selectedHostel.name : "Select a hostel" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: selectedHostel ? `Invoice amount ${currency(selectedHostel.session_fee_amount)}` : "A hostel invoice will be generated for payment." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing || !data.hostel_id,
              className: "inline-flex justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
              children: processing ? "Booking..." : "Book Hostel"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
