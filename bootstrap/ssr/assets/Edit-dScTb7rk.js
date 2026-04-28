import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Edit({ additionalCharge, feeModels }) {
  const { data, setData, put, processing, errors } = useForm({
    fee_model_id: additionalCharge.fee_model_id || "",
    name: additionalCharge.name || "",
    amount: additionalCharge.amount || "",
    frequency: additionalCharge.frequency || "session",
    description: additionalCharge.description || ""
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("fees.additional-charges.update", additionalCharge.id), {
      preserveScroll: true
    });
  };
  const frequencyOptions = [
    {
      value: "admission",
      label: "Admission - One-time charge for new students"
    },
    { value: "session", label: "Session - Charged per academic session" },
    { value: "year", label: "Year - Charged annually" }
  ];
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Additional Charge" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl w-full", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "bg-white p-10 space-y-6 border rounded-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Fee Model", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "fee-models.search",
                    defaultOptions: feeModels,
                    placeholder: "Search fee models...",
                    value: data.fee_model_id,
                    onChange: (model) => setData("fee_model_id", model.id),
                    error: errors.fee_model_id
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.fee_model_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Charge Name", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    name: "name",
                    value: data.name,
                    onChange: handleChange,
                    placeholder: "e.g., Late Registration Fee",
                    error: errors.name
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Amount (₦)", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    name: "amount",
                    value: data.amount,
                    onChange: handleChange,
                    placeholder: "0.00",
                    step: "0.01",
                    min: "0",
                    error: errors.amount
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.amount })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Frequency", required: true }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    name: "frequency",
                    value: data.frequency,
                    onChange: handleChange,
                    className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    children: frequencyOptions.map((option) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: option.value,
                        children: option.label
                      },
                      option.value
                    ))
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.frequency })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Description", required: true }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  name: "description",
                  value: data.description,
                  onChange: handleChange,
                  placeholder: "Describe what this charge is for...",
                  rows: 4,
                  error: errors.description
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-6", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("fees.additional-charges.index"),
                className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50",
                children: processing ? "Updating..." : "Update Additional Charge"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  Edit as default
};
