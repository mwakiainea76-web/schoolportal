import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import "ziggy-js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function AdditionalChargesIndex({
  additionalCharges,
  feeModels
}) {
  const [sortField, setSortField] = useState(
    additionalCharges.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    additionalCharges.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    frequency: "",
    fee_model: "",
    min_amount: "",
    max_amount: ""
  });
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("fees.additional-charges.index"),
      { sort: field, direction, page: 1, ...filters },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    router.get(
      route("fees.additional-charges.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection,
        ...newFilters,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("fees.additional-charges.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection,
        ...filters
      },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this additional charge?")) return;
    router.delete(route("fees.additional-charges.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const getFrequencyBadge = (frequency) => {
    const colors = {
      admission: "bg-blue-100 text-blue-800",
      session: "bg-green-100 text-green-800",
      year: "bg-purple-100 text-purple-800"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-2 py-1 text-xs rounded capitalize ${colors[frequency] || "bg-gray-100 text-gray-800"}`,
        children: frequency
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Additional Charges" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("fees.additional-charges.create"),
          className: "mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block",
          children: "Add Additional Charge"
        }
      ),
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-6 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "Search additional charges...",
            className: "flex-1 px-3 py-2 border border-gray-300 rounded"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
            children: "Search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.frequency,
            onChange: (e) => handleFilterChange("frequency", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Frequencies" }),
              /* @__PURE__ */ jsx("option", { value: "admission", children: "Admission" }),
              /* @__PURE__ */ jsx("option", { value: "session", children: "Session" }),
              /* @__PURE__ */ jsx("option", { value: "year", children: "Year" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.fee_model,
            onChange: (e) => handleFilterChange("fee_model", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Fee Models" }),
              feeModels.map((model) => /* @__PURE__ */ jsx("option", { value: model.id, children: model.name }, model.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: filters.min_amount,
            onChange: (e) => handleFilterChange("min_amount", e.target.value),
            placeholder: "Min Amount",
            className: "px-3 py-2 border border-gray-300 rounded text-sm"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: filters.max_amount,
            onChange: (e) => handleFilterChange("max_amount", e.target.value),
            placeholder: "Max Amount",
            className: "px-3 py-2 border border-gray-300 rounded text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: additionalCharges,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("id"),
                  className: "cursor-pointer",
                  children: [
                    "ID ",
                    renderArrow("id")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("name"),
                  className: "cursor-pointer",
                  children: [
                    "Name ",
                    renderArrow("name")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Fee Model" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("amount"),
                  className: "cursor-pointer",
                  children: [
                    "Amount ",
                    renderArrow("amount")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("frequency"),
                  className: "cursor-pointer",
                  children: [
                    "Frequency ",
                    renderArrow("frequency")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Description" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Created ",
                    renderArrow("created_at")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: additionalCharges?.data?.length ? additionalCharges.data.map((charge) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: charge.id }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: charge.name }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: charge.display_name })
              ] }) }),
              /* @__PURE__ */ jsx(Tdata, { children: charge.fee_model?.display_name || "—" }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                "₦",
                parseFloat(
                  charge.amount
                ).toLocaleString()
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: getFrequencyBadge(charge.frequency) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("div", { className: "max-w-xs truncate", children: charge.description }) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(charge.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "fees.additional-charges.edit",
                      encodeURIComponent(
                        charge.id
                      )
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      encodeURIComponent(
                        charge.id
                      )
                    ),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, charge.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "text-center py-4", children: "No additional charges found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  AdditionalChargesIndex as default
};
