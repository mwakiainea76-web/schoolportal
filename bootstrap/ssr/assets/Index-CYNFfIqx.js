import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import Create from "./Create-DcdMp56Q.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "@headlessui/react";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./TextInput-DsoSnibl.js";
import "./SearchSelect-iSHxFhW9.js";
import "ziggy-js";
function FeePlans({ feePlans }) {
  const [sortField, setSortField] = useState(feePlans.sort || "created_at");
  const [plan, setPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortDirection, setSortDirection] = useState(
    feePlans.direction || "desc"
  );
  const [filters, setFilters] = useState({
    search: feePlans.search || "",
    is_active: feePlans.is_active ?? "",
    version: feePlans.version || "",
    approval_status: feePlans.approval_status || ""
  });
  const onClose = () => {
    setShowModal(false);
  };
  const applyFilters = (extra = {}) => {
    router.get(
      route("fees.plans.index"),
      {
        ...filters,
        sort: sortField,
        direction: sortDirection,
        ...extra
      },
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    applyFilters({ sort: field, direction });
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this fee plan?")) return;
    router.delete(route("fees.plans.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const handleApproval = (id, action) => {
    const actionText = action === "approve" ? "approve" : "reject";
    const confirmMessage = `Are you sure you want to ${actionText} this fee plan?`;
    if (!confirm(confirmMessage)) return;
    router.post(
      route("fees.plans.approval", { feePlan: id, action }),
      {},
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters({ [key]: value });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Plans" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Fee Plans" }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: filters.search,
            onChange: (e) => updateFilter("search", e.target.value),
            placeholder: "Search fee plans...",
            className: "border border-zinc-200 px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.is_active,
            onChange: (e) => updateFilter("is_active", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "1", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "0", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.version,
            onChange: (e) => updateFilter("version", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Versions" }),
              /* @__PURE__ */ jsx("option", { value: "v1", children: "v1" }),
              /* @__PURE__ */ jsx("option", { value: "v2", children: "v2" }),
              /* @__PURE__ */ jsx("option", { value: "v3", children: "v3" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.approval_status,
            onChange: (e) => updateFilter("approval_status", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Approvals" }),
              /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
              /* @__PURE__ */ jsx("option", { value: "pending_approval", children: "Pending Approval" }),
              /* @__PURE__ */ jsx("option", { value: "approved", children: "Approved" }),
              /* @__PURE__ */ jsx("option", { value: "rejected", children: "Rejected" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const reset = {
                search: "",
                is_active: "",
                version: "",
                approval_status: ""
              };
              setFilters(reset);
              router.get(route("fees.plans.index"));
            },
            className: "px-4 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition",
            children: "Reset"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: feePlans,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
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
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("version"),
                  className: "cursor-pointer",
                  children: [
                    "Version ",
                    renderArrow("version")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("is_active"),
                  className: "cursor-pointer",
                  children: [
                    "Status ",
                    renderArrow("is_active")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("approval_status"),
                  className: "cursor-pointer",
                  children: [
                    "Approval ",
                    renderArrow("approval_status")
                  ]
                }
              ),
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
            /* @__PURE__ */ jsx(TBody, { children: feePlans?.data?.length ? feePlans.data.map((plan2) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: plan2.name }),
              /* @__PURE__ */ jsx(Tdata, { children: plan2.version }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${plan2.is_active == 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`,
                  children: plan2.is_active == 1 ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${plan2.approval_status === "approved" ? "bg-emerald-100 text-emerald-700" : plan2.approval_status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : plan2.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                  children: plan2.approval_status === "pending_approval" ? "Pending" : plan2.approval_status.charAt(0).toUpperCase() + plan2.approval_status.slice(1).replace("_", " ")
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(plan2.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "fees.plans.edit",
                      plan2.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                plan2.approval_status === "pending_approval" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleApproval(
                        plan2.id,
                        "approve"
                      ),
                      className: "text-green-600 hover:underline text-sm",
                      children: "Approve"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleApproval(
                        plan2.id,
                        "reject"
                      ),
                      className: "text-red-600 hover:underline text-sm",
                      children: "Reject"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "fees.plans.items",
                      plan2.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Fee Items"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(plan2.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, plan2.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "6",
                className: "text-center py-6 text-zinc-500",
                children: "No fee plans found"
              }
            ) }) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { onClose, show: showModal, children: /* @__PURE__ */ jsx(Create, { plan, setShowModal }) })
  ] });
}
export {
  FeePlans as default
};
