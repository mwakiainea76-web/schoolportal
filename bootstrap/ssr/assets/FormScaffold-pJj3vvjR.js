import { jsx, jsxs } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function PageLayout({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children });
}
function FormScaffold({
  title,
  description,
  backHref,
  backLabel = "Back to manual billing",
  children
}) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(PageLayout, { children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Billing Operations" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl font-bold tracking-tight", children: title }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-slate-300", children: description })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: backHref,
            className: "inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20",
            children: backLabel
          }
        )
      ] }) }),
      children
    ] })
  ] });
}
export {
  FormScaffold as default
};
