import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { c as cn } from "../app.js";
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "table-container",
    className: "min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm printable-table",
    children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ jsx(
      "table",
      {
        ref,
        "data-slot": "table",
        className: cn(
          "min-w-max w-full table-auto border-collapse text-left caption-bottom text-sm",
          className
        ),
        ...props
      }
    ) })
  }
));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "thead",
  {
    ref,
    "data-slot": "table-header",
    className: cn("[&_tr]:bg-zinc-200", className),
    ...props
  }
));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    "data-slot": "table-body",
    className: cn("divide-y divide-slate-100 bg-white", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    "data-slot": "table-footer",
    className: cn(
      "border-t border-slate-100 bg-slate-50/80 [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    "data-slot": "table-row",
    className: cn(
      "transition-colors hover:bg-slate-50 data-[state=selected]:bg-slate-50 [&:has([data-state=open])]:bg-slate-50",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    "data-slot": "table-head",
    className: cn(
      "px-4 py-3 text-left align-middle text-sm font-semibold text-slate-600 [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    "data-slot": "table-cell",
    className: cn(
      "whitespace-nowrap p-3 text-sm text-slate-500 align-middle [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    "data-slot": "table-caption",
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
export {
  Table as T,
  TableHeader as a,
  TableRow as b,
  TableHead as c,
  TableBody as d,
  TableCell as e,
  TableFooter as f
};
