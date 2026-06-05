import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { S as SearchSelect } from "./SearchSelect-8eQtXAlf.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import EditModal from "./EditModal-Bh67IqSB.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
import "@headlessui/react";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./TextInput-DsoSnibl.js";
function Index({
  feePlans,
  sort,
  direction,
  feePlanOptions,
  feePlan
}) {
  const [sortField, setSortField] = useState(sort || "created_at");
  const [sortDirection, setSortDirection] = useState(direction || "desc");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleSort = (field) => {
    const dir = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(dir);
    router.get(route("fees.plans.items.index"), {
      sort: field,
      direction: dir
    });
  };
  const submitSearch = (e) => {
    e.preventDefault();
    router.get(route("fees.plans.items.index"), {
      search,
      sort: sortField,
      direction: sortDirection
    });
  };
  const deleteItem = (id) => {
    if (!confirm("Delete this item?")) return;
    router.delete(route("fees.plans.items.destroy", id));
  };
  const openEditModal = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };
  const totalAmount = feePlans?.data ? feePlans.data.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  ) : feePlans?.length ? feePlans.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  ) : 0;
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Plan Items" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      feePlan && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-white border border-zinc-100 shadow-sm rounded-lg", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-zinc-800", children: [
          "Fee Plan: ",
          feePlan.name
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500 mt-1", children: [
          "Total Items:",
          " ",
          feePlans?.data ? feePlans.data.length : feePlans?.length || 0,
          " ",
          "| Total Amount: Ksh ",
          totalAmount.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7 align-content-center text-center",
          onSubmit: submitSearch,
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
              SearchSelect,
              {
                placeholder: "Search fee plan..."
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
                type: "submit",
                children: "Search"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: feePlans,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsx(THdata, { children: "#" }),
              /* @__PURE__ */ jsx(
                THdata,
                {
                  onClick: () => handleSort("name"),
                  className: "cursor-pointer",
                  children: "Fee component name"
                }
              ),
              /* @__PURE__ */ jsx(
                THdata,
                {
                  onClick: () => handleSort("amount"),
                  className: "cursor-pointer",
                  children: "Amount"
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: feePlans?.data?.length || feePlans?.length ? (feePlans?.data || feePlans).map(
              (feePlanItem, index) => /* @__PURE__ */ jsxs(Trow, { children: [
                /* @__PURE__ */ jsx(Tdata, { children: index + 1 }),
                /* @__PURE__ */ jsx(Tdata, { children: feePlanItem?.name }),
                /* @__PURE__ */ jsx(Tdata, { children: feePlanItem.amount }),
                /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openEditModal(
                        feePlanItem
                      ),
                      className: "text-emerald-600 hover:underline",
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => deleteItem(
                        feePlanItem.id
                      ),
                      className: "text-red-600 hover:underline",
                      children: "Delete"
                    }
                  )
                ] }) })
              ] }, feePlanItem.id)
            ) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "6",
                className: "text-center py-4 text-zinc-500",
                children: "No fee plan items found"
              }
            ) }) })
          ]
        }
      )
    ] }),
    showEditModal && editingItem && /* @__PURE__ */ jsx(
      Modal,
      {
        show: showEditModal,
        onClose: () => setShowEditModal(false),
        align: "top",
        children: /* @__PURE__ */ jsx(
          EditModal,
          {
            item: editingItem,
            feePlanOptions,
            setShowModal: setShowEditModal
          }
        )
      }
    )
  ] });
}
export {
  Index as default
};
