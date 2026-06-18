import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function TablePagination({ pagination, colSpan, summary }) {
  if (!pagination) {
    return null;
  }
  const links = Array.isArray(pagination.links) ? pagination.links : [];
  const showLinks = links.length > 3;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    summary ? /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 bg-slate-50/80 px-8 py-3 text-xs font-semibold tracking-widest text-slate-400", children: summary }) : null,
    showLinks ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 px-2 py-3", children: links.map((link, index) => /* @__PURE__ */ jsx(
      Link,
      {
        href: link.url || "#",
        preserveState: true,
        preserveScroll: true,
        className: `rounded-md border px-3 py-2 text-sm ${link.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"} ${!link.url ? "pointer-events-none opacity-50" : ""}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      index
    )) }) : null
  ] });
}
export {
  TablePagination as T
};
