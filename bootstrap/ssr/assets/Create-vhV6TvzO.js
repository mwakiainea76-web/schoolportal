import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Create({ curricula, units }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    curriculum_id: "",
    unit_id: "",
    module_taught: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("units.curriculum.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData("unit_id", "");
        setData("module_taught", "");
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Assign Unit to Curriculum" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "curriculum_id",
              value: "Curriculum"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "curriculum.search",
              defaultOptions: curricula,
              placeholder: "Search Curriculum...",
              value: data.curriculum_id,
              onChange: (curr) => setData("curriculum_id", curr.id),
              error: errors.curriculum_id
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.curriculum_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "unit_id", value: "Unit" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "units.search",
              defaultOptions: units,
              placeholder: "Search Unit...",
              value: data.unit_id,
              onChange: (unit) => setData("unit_id", unit.id),
              error: errors.unit_id
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.unit_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "module_taught",
              value: "Module Taught"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "module_taught",
              type: "number",
              name: "module_taught",
              className: "mt-1 block w-full",
              placeholder: "e.g. 1",
              min: "1",
              value: data.module_taught,
              onChange: (e) => setData("module_taught", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.module_taught,
              className: "mt-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("units.curriculum.index"),
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
