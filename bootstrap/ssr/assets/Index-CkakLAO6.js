import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import EditModal from "./EditModal-DQzLv2Yh.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "@radix-ui/react-dropdown-menu";
import "ziggy-js";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
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
        Table,
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
            /* @__PURE__ */ jsx(Tbody, { children: feePlans?.data?.length || feePlans?.length ? (feePlans?.data || feePlans).map(
              (feePlanItem, index) => /* @__PURE__ */ jsxs(Trow, { children: [
                /* @__PURE__ */ jsx(Tdata, { children: index + 1 }),
                /* @__PURE__ */ jsx(Tdata, { children: feePlanItem?.name }),
                /* @__PURE__ */ jsx(Tdata, { children: feePlanItem.amount }),
                /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-8",
                      children: [
                        /* @__PURE__ */ jsx(MoreHorizontalIcon, {}),
                        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    DropdownMenuContent,
                    {
                      side: "left",
                      align: "start",
                      sideOffset: 8,
                      className: "w-40",
                      children: [
                        /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            onClick: () => openEditModal(
                              feePlanItem
                            ),
                            children: "Edit"
                          }
                        ),
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            variant: "destructive",
                            onClick: () => deleteItem(
                              feePlanItem.id
                            ),
                            children: "Delete"
                          }
                        )
                      ]
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
const Table = ({ children, pagination, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Table$1, { ...props, children }),
  /* @__PURE__ */ jsx(TablePagination, { pagination })
] });
const Thead = ({ children, ...props }) => /* @__PURE__ */ jsx(TableHeader, { ...props, children: /* @__PURE__ */ jsx(TableRow, { children }) });
const THdata = (props) => /* @__PURE__ */ jsx(TableHead, { ...props });
const Tbody = (props) => /* @__PURE__ */ jsx(TableBody, { ...props });
const Trow = (props) => /* @__PURE__ */ jsx(TableRow, { ...props });
const Tdata = (props) => /* @__PURE__ */ jsx(TableCell, { ...props });
export {
  Index as default
};
