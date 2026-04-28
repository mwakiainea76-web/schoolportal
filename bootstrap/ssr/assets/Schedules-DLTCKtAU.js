import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import "react";
import "lucide-react";
import "react-toastify";
function Schedules() {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-900", children: "Class Schedules" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-1", children: "This is a simple nested route example." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Class Schedules" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-zinc-600", children: "If you can see this inside the same sidebar and top bar, nested routes are rendering inside the authenticated layout." }) })
      ]
    }
  );
}
export {
  Schedules as default
};
