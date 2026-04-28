import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import "lucide-react";
import "react-toastify";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    is_active: true,
    is_reusable: true
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("fees.templates.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Fee Template" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl w-full", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "bg-white p-10 space-y-6 border rounded-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: " gap-6 ", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid   gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { className: " ", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Template Name", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    name: "name",
                    value: data.name,
                    onChange: handleChange,
                    error: errors.name,
                    placeholder: "e.g 2026 Standard Fee Structure"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx(
                  ToggleSwitch,
                  {
                    label: "Active Template",
                    checked: data.is_active,
                    onChange: (val) => setData("is_active", val)
                  }
                ),
                /* @__PURE__ */ jsx(
                  ToggleSwitch,
                  {
                    label: "Reusable Template",
                    checked: data.is_reusable,
                    onChange: (val) => setData("is_reusable", val)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  name: "description",
                  value: data.description,
                  onChange: handleChange,
                  error: errors.description,
                  placeholder: "Optional description of this template..."
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-6", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("fees.templates.index"),
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
                children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                  "Saving",
                  /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
                ] }) : "Create Template"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  Create as default
};
