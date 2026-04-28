import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function Create({ templates }) {
  const { data, setData, post, processing, errors } = useForm({
    fee_template_id: "",
    name: "",
    type: "",
    amount: "",
    frequency: "session",
    is_optional: false,
    sort_order: 0
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("fees.components.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Fee Component" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Fee Template", required: true }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              defaultOptions: templates,
              value: data.fee_template_id,
              onChange: (t) => setData("fee_template_id", t.id),
              error: errors.fee_template_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.fee_template_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Component Name", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              error: errors.name
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Type", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: data.type,
              onChange: (e) => setData("type", e.target.value),
              error: errors.type
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.type })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Amount", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              value: data.amount,
              onChange: (e) => setData("amount", e.target.value),
              error: errors.amount
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.amount })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Frequency" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: data.frequency,
              onChange: (e) => setData("frequency", e.target.value),
              className: "mt-1 block w-full border rounded p-2",
              children: [
                /* @__PURE__ */ jsx("option", { value: "admission", children: "Admission" }),
                /* @__PURE__ */ jsx("option", { value: "always", children: "Always" }),
                /* @__PURE__ */ jsx("option", { value: "session", children: "Session" }),
                /* @__PURE__ */ jsx("option", { value: "year", children: "Year" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.frequency })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Sort Order" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              value: data.sort_order,
              onChange: (e) => setData("sort_order", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsx(
          ToggleSwitch,
          {
            label: "Optional Component",
            checked: data.is_optional,
            onChange: (v) => setData("is_optional", v)
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("fees.components.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing,
            type: "submit",
            className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
            children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              "Saving",
              /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
            ] }) : "Save"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  Create as default
};
