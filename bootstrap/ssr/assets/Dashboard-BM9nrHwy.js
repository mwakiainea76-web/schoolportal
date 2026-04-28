import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import "react";
import "lucide-react";
import "react-toastify";
function Dashboard() {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-zinc-900 tracking-tight", children: "Academic Overview" }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-500 mt-1", children: "Manage courses and institutional scheduling from one place." }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-10", children: /* @__PURE__ */ jsx("div", { className: "h-64 rounded-3xl bg-white border border-zinc-100 shadow-sm p-8 flex items-center justify-center text-zinc-300 italic", children: "Page Content Area..." }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
