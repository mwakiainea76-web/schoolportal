import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useMemo, useCallback } from "react";
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
const ACTIONS_HEADER = "actions";
const escapeCsvValue = (value) => {
  const normalized = `${value ?? ""}`.replace(/\r?\n|\r/g, " ").trim();
  if (normalized.includes(",") || normalized.includes('"') || normalized.includes(";")) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};
const buildFilename = () => {
  const pageTitle = document.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${pageTitle || "table-export"}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
};
const DirectoryTable = ({
  children,
  pagination,
  print = false,
  exportable = true
}) => {
  const tableRef = useRef(null);
  const hasRows = useMemo(
    () => (pagination?.data?.length ?? 0) > 0,
    [pagination?.data?.length]
  );
  const exportToCsv = useCallback(() => {
    const table = tableRef.current;
    if (!table) {
      return;
    }
    const headers = Array.from(table.querySelectorAll("thead th")).map((cell, index) => ({
      index,
      value: cell.textContent.replace(/\s+/g, " ").trim()
    })).filter(({ value }) => value);
    const headerIndexesToSkip = new Set(
      headers.filter(({ value }) => value.toLowerCase() === ACTIONS_HEADER).map(({ index }) => index)
    );
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(
      (row) => Array.from(row.querySelectorAll("td")).map((cell, index) => ({ index, value: cell.textContent })).filter(({ index }) => !headerIndexesToSkip.has(index)).map(({ value }) => escapeCsvValue(value))
    ).filter((row) => row.length > 0);
    if (rows.length === 0) {
      return;
    }
    const filteredHeaders = headers.filter(({ index }) => !headerIndexesToSkip.has(index)).map(({ value }) => escapeCsvValue(value));
    const csvContent = [filteredHeaders, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", buildFilename());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "py-6 font-sans", children: [
    (print || exportable) && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap justify-end gap-3", children: [
      exportable && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: exportToCsv,
          disabled: !hasRows,
          className: "rounded bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
          children: "Export CSV"
        }
      ),
      print && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => window.print(),
          className: "rounded bg-slate-500 px-4 py-2 text-sm text-white transition hover:bg-slate-700",
          children: "Print Table"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ jsx(
        "table",
        {
          ref: tableRef,
          className: "min-w-max w-full table-auto border-collapse text-left",
          children
        }
      ) }),
      pagination ? /* @__PURE__ */ jsx(TFooter, { pagination }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-sm text-zinc-500", children: "No data available." })
    ] })
  ] });
};
const Thead = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx("thead", { ...props, children: /* @__PURE__ */ jsx("tr", { className: `bg-zinc-200 ${className}`, children }) });
};
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
const TBody = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx("tbody", { ...props, className: `divide-y divide-slate-100 ${className}`, children });
};
const Trow = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      ...props,
      className: `group cursor-default transition-all duration-200 hover:bg-indigo-50/40 ${className}`,
      "data-te-table-row-ref": "",
      children
    }
  );
};
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
export {
  DirectoryTable as D,
  Thead as T,
  THdata as a,
  TBody as b,
  Trow as c,
  Tdata as d
};
