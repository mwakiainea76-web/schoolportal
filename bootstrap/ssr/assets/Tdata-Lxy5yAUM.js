import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useMemo } from "react";
import { router } from "@inertiajs/react";
const paginationWindow = (currentPage, lastPage) => {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }
  const pages = /* @__PURE__ */ new Set([1, lastPage]);
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);
  for (let page = start; page <= end; page++) {
    pages.add(page);
  }
  return Array.from(pages).sort((a, b) => a - b).flatMap((page, index, items) => {
    if (index === 0 || page === items[index - 1] + 1) {
      return [page];
    }
    return [`ellipsis-${page}`, page];
  });
};
const TFooter = ({ pagination }) => {
  if (!pagination) return null;
  const { current_page, last_page } = pagination;
  const pages = useMemo(
    () => paginationWindow(current_page, last_page),
    [current_page, last_page]
  );
  const goToPage = (page) => {
    if (page < 1 || page > last_page || page === current_page) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", page);
    router.get(
      `${window.location.pathname}?${urlParams.toString()}`,
      {},
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "TFooter bg-slate-50/80 px-8 py-3 border-t border-slate-100 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-slate-400 tracking-widest", children: [
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
          children: "<"
        }
      ),
      pages.map(
        (page) => typeof page === "string" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-slate-400", children: "..." }, page) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => goToPage(page),
            className: `px-3 py-1 rounded ${page === current_page ? "bg-slate-400 text-white" : "text-slate-600 hover:bg-slate-100"} transition-colors`,
            children: page
          },
          page
        )
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => goToPage(current_page + 1),
          disabled: current_page === last_page,
          className: "p-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: ">"
        }
      )
    ] })
  ] });
};
const TFooter$1 = React__default.memo(TFooter);
const DirectoryTable = ({ children, pagination }) => {
  return /* @__PURE__ */ jsx("div", { className: "py-2 font-sans", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "min-w-max w-full table-auto border-collapse text-left", children }) }),
    pagination ? /* @__PURE__ */ jsx(TFooter$1, { pagination }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-sm text-zinc-500", children: "No data available." })
  ] }) });
};
const Table = React__default.memo(DirectoryTable);
const Thead = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx("thead", { ...props, children: /* @__PURE__ */ jsx("tr", { className: `bg-zinc-200 ${className}`, children }) });
};
const Thead$1 = React__default.memo(Thead);
const THdata = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "th",
    {
      ...props,
      className: `whitespace-nowrap bg-zinc-0 p-2 text-left text-xs text-zinc-500 border/90 cursor-pointer tracking-wider ${className}`,
      children
    }
  );
};
const THdata$1 = React__default.memo(THdata);
const TBody = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx("tbody", { ...props, className: `divide-y divide-slate-100 ${className}`, children });
};
const Tbody = React__default.memo(TBody);
const Trow = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      ...props,
      className: `group cursor-default transition-colors duration-200 hover:bg-indigo-50/40 ${className}`,
      "data-te-table-row-ref": "",
      children
    }
  );
};
const Trow$1 = React__default.memo(Trow);
const Tdata = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "td",
    {
      ...props,
      className: `whitespace-nowrap p-2 text-sm text-slate-500 ${className}`,
      children
    }
  );
};
const Tdata$1 = React__default.memo(Tdata);
export {
  Table as T,
  Thead$1 as a,
  THdata$1 as b,
  Tbody as c,
  Trow$1 as d,
  Tdata$1 as e
};
