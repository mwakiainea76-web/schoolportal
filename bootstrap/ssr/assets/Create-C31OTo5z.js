import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import "react";
import "ziggy-js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    permissions: []
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("roles.store"));
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Role" }),
    /* @__PURE__ */ jsx("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "Role Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "e.g. admin, staff, student",
            error: errors.name
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("roles.index"),
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
              "Saving...",
              /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
            ] }) : "Create Role"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  Create as default
};
