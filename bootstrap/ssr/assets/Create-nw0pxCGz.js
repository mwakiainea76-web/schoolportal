import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import "lucide-react";
import "react-toastify";
const Create = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    description: "",
    credit_factor: "",
    training_hours: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("units.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Unit" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Add unit" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-10 space-y-6 border rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit Code", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: data.code,
                    onChange: (e) => setData("code", e.target.value),
                    error: errors.code
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.code })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit Name", required: true }),
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
                /* @__PURE__ */ jsx(InputLabel, { value: "Credit Factor ", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    value: data.credit_factor,
                    onChange: (e) => setData("credit_factor", e.target.value),
                    error: errors.credit_factor
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.credit_factor })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Training Hours", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    value: data.training_hours,
                    onChange: (e) => setData("training_hours", e.target.value),
                    error: errors.training_hours
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.training_hours })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  value: data.description,
                  onChange: (e) => setData("description", e.target.value),
                  error: errors.description
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("units.index"),
                  className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  disabled: processing,
                  type: "submit",
                  className: "px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    "Saving",
                    /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
                  ] }) : "Create Unit"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
};
export {
  Create as default
};
