import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function EditCurriculumUnit({ curriculum_unit, units }) {
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors } = useForm({
    curriculum_id: "",
    unit_id: "",
    module_taught: "",
    start_date: "",
    end_date: ""
  });
  useEffect(() => {
    if (!curriculum_unit || hasInitialized.current) return;
    setData({
      curriculum_id: curriculum_unit.curriculum_id ?? "",
      unit_id: curriculum_unit.unit_id ?? "",
      module_taught: curriculum_unit.module_taught ?? "",
      start_date: curriculum_unit.start_date ?? "",
      end_date: curriculum_unit.end_date ?? ""
    });
    hasInitialized.current = true;
  }, [curriculum_unit]);
  const submit = (e) => {
    e.preventDefault();
    put(route("units.curriculum.update", curriculum_unit.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculum Unit" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: `${curriculum_unit.curriculum.name} - ${curriculum_unit.curriculum.course.name}`,
              readOnly: true,
              className: "cursor-not-allowed"
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
      /* @__PURE__ */ jsxs("div", { className: "pt-6 flex items-center justify-end gap-4 border-t border-zinc-50", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("units.curriculum.index"),
            className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing || !curriculum_unit,
            className: "px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              "Updating",
              /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
            ] }) : "Update Curriculum Unit"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  EditCurriculumUnit as default
};
