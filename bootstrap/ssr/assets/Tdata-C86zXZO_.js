import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { router } from "@inertiajs/react";
const TFooter = ({ pagination }) => {
  if (!pagination) return null;
  const { current_page, last_page, prev_page_url, next_page_url } = pagination;
  const goToPage = (page) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", page);
    router.get(
      `${window.location.pathname}?${urlParams.toString()}`,
      {},
      { preserveState: true, replace: true }
    );
  };
  const pages = Array.from({ length: last_page }, (_, i) => i + 1);
  return /* @__PURE__ */ jsxs("div", { className: "TFooter bg-slate-50/80 px-8 py-3 border-t border-slate-100 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-slate-400  tracking-widest", children: [
      "Page ",
      current_page,
      " of ",
      last_page
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => goToPage(current_page - 1),
          disabled: current_page === 1,
          className: "p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: "←"
        }
      ),
      pages.map((page) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => goToPage(page),
          className: `px-3 py-1 rounded ${page === current_page ? "bg-slate-400 text-white" : "text-slate-600 hover:bg-slate-100"} transition-colors`,
          children: page
        },
        page
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => goToPage(current_page + 1),
          disabled: current_page === last_page,
          className: "p-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: "→"
        }
      )
    ] })
  ] });
};
const DirectoryTable = ({ children, pagination, print = false }) => {
  return /* @__PURE__ */ jsxs("div", { className: " py-6 font-sans", children: [
    print && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.print(),
        className: "mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700",
        children: "Print Table"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table min-w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-w-full", children: /* @__PURE__ */ jsx("table", { className: "w-full table-auto border-collapse text-left", children }) }),
      pagination ? /* @__PURE__ */ jsx(TFooter, { pagination }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-sm text-zinc-500", children: "No data available." })
    ] })
  ] });
};
const Thead = ({ children }) => {
  return /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-zinc-200", children }) });
};
const THdata = ({ children, ...props }) => {
  return /* @__PURE__ */ jsx(
    "th",
    {
      ...props,
      className: "p-2 text-left text-xs  text-zinc-500  bg-zinc-0 border/90 cursor-pointer tracking-wider",
      children
    }
  );
};
const TBody = ({ children }) => {
  return /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children });
};
const Trow = ({ children }) => {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      className: "group transition-all duration-200 hover:bg-indigo-50/40 cursor-default",
      "data-te-table-row-ref": "",
      children
    }
  );
};
const Tdata = ({ children }) => {
  return /* @__PURE__ */ jsx("td", { className: "p-2 text-sm   text-slate-500", children });
};
export {
  DirectoryTable as D,
  Thead as T,
  THdata as a,
  TBody as b,
  Trow as c,
  Tdata as d
};
