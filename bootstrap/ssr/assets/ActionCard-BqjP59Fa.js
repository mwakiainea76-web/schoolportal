import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function ActionCard({
  href,
  icon: Icon,
  imageSrc,
  imageAlt,
  title,
  description,
  onClick
}) {
  const classes = "block w-full rounded-[1.75rem] border border-zinc-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md";
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    imageSrc ? /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: imageSrc,
        alt: imageAlt ?? title,
        className: "h-10 w-auto"
      }
    ) }) : /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-2xl bg-zinc-100 p-3 text-zinc-700", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mt-5 text-lg font-semibold text-zinc-900", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: description })
  ] });
  if (onClick) {
    return /* @__PURE__ */ jsx("button", { type: "button", onClick, className: classes, children: content });
  }
  return /* @__PURE__ */ jsx(Link, { href, className: classes, children: content });
}
export {
  ActionCard as default
};
