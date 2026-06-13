import { jsx, jsxs } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
function EditModal({ item, feePlanOptions, setShowModal }) {
  const { data, setData, put, processing, errors } = useForm({
    fee_plan_id: item?.fee_plan_id ?? "",
    name: item?.name ?? "",
    amount: item?.amount ?? ""
  });
  useEffect(() => {
    if (item) {
      setData("fee_plan_id", item.fee_plan_id);
      setData("name", item.name);
      setData("amount", item.amount);
    }
  }, [item]);
  const submit = (e) => {
    e.preventDefault();
    put(route("fees.plans.items.update", encodeURIComponent(item.id)), {
      preserveScroll: true,
      onSuccess: () => {
        if (setShowModal) {
          setShowModal(false);
        }
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Edit Fee Plan Item" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Fee Plan" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              defaultOptions: feePlanOptions,
              placeholder: "Search fee plan...",
              value: data.fee_plan_id,
              onChange: (plan) => setData("fee_plan_id", plan.id),
              disabled: true,
              error: errors.fee_plan_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.fee_plan_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Item Name" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              name: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              error: errors.name
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Amount" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              name: "amount",
              value: data.amount,
              placeholder: "e.g. 5000 (Ksh)",
              onChange: (e) => setData("amount", e.target.value),
              error: errors.amount
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.amount })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4 border-t border-zinc-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowModal(false),
            className: "px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition",
            children: processing ? "Updating..." : "Update Item"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  EditModal as default
};
