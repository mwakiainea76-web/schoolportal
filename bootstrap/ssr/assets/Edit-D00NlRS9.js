import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-DbLPTvUh.js";
import "react";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function Edit({ item, feePlans }) {
  const { data, setData, put, processing, errors } = useForm({
    fee_plan_id: item?.fee_plan_id ?? "",
    name: item?.name ?? "",
    amount: item?.amount ?? ""
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("fees.plans.items.update", encodeURIComponent(item.id)), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Fee Plan Item" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Edit Fee Plan Item" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-10 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Fee Plan" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "fee-plans.search",
                defaultOptions: feePlans,
                placeholder: "Search fee plan...",
                value: data.fee_plan_id,
                onChange: (plan) => setData("fee_plan_id", plan.id),
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
                onChange: (e) => setData("amount", e.target.value),
                error: errors.amount
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.amount })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4 border-t border-zinc-100", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.plans.items.index"),
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
    ] }) })
  ] });
}
export {
  Edit as default
};
