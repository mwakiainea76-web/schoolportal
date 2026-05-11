import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import "react";
import "lucide-react";
import "react-toastify";
function AddFeePlan() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    version: "",
    is_active: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("fees.plans.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Fee Plan" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Add Fee Plan" }),
      /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "name",
                value: "Fee Plan Name"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                name: "name",
                placeholder: "e.g. ICT Fee Structure 2026",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                error: errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "version", value: "Version" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "version",
                name: "version",
                placeholder: "e.g. v1, v2",
                value: data.version,
                onChange: (e) => setData("version", e.target.value),
                error: errors.version
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.version })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Set Fee Plan Active",
                checked: data.is_active,
                onChange: (checked) => setData("is_active", checked),
                error: errors.is_active
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.is_active })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.plans.index"),
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
              ] }) : "Save Fee Plan"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AddFeePlan as default
};
