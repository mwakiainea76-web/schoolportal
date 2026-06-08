import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Link, Head, router } from "@inertiajs/react";
import { useEffect } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "ziggy-js";
function Create({
  feePlanOptions = [],
  feePlans = [],
  plan,
  setShowModal
}) {
  const isModal = typeof setShowModal === "function";
  const options = feePlanOptions.length ? feePlanOptions : feePlans;
  const { data, setData, post, processing, errors } = useForm({
    fee_plan_id: plan ? plan.id : "",
    name: "",
    amount: ""
  });
  useEffect(() => {
    if (plan) {
      setData("fee_plan_id", plan.id);
    }
  }, [plan]);
  const submit = (e) => {
    e.preventDefault();
    post(route("fees.plans.items.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData("amount", "");
        setData("name", "");
        if (!isModal) {
          router.visit(route("fees.plans.items.index"));
        }
      }
    });
  };
  const form = /* @__PURE__ */ jsx("div", { className: "w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-slate-600 text-white text-center py-2 text-sm font-medium tracking-wide", children: "ADD FEE PLAN ITEM" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Select Fee Plan" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              value: data.fee_plan_id,
              placeholder: "Search fee plan...",
              defaultOptions: options,
              onChange: (plan2) => setData("fee_plan_id", plan2.id),
              disabled: !!plan
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
              placeholder: "e.g. Registration Fee",
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
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-zinc-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (isModal) {
                setShowModal(false);
                return;
              }
              setData("fee_plan_id", "");
              setData("amount", "");
              setData("name", "");
            },
            className: "px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition",
            children: isModal ? "Cancel" : "Clear"
          }
        ),
        !isModal ? /* @__PURE__ */ jsx(
          Link,
          {
            href: route("fees.plans.items.index"),
            className: "px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition",
            children: "Back"
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" }),
              "Saving..."
            ] }) : "Save Item"
          }
        )
      ] })
    ] })
  ] }) });
  if (isModal) {
    return form;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Fee Plan Item" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-3xl", children: form })
  ] });
}
export {
  Create as default
};
