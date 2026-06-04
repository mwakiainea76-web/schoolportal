import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function EditProgramVersionUnit({ curriculum_unit }) {
  const hasInitialized = useRef(false);
  const mapping = curriculum_unit?.program_version_mapping;
  const cycleLabel = curriculum_unit?.program_version?.name ?? mapping?.program_version?.name ?? "";
  const courseLabel = mapping?.program?.name ? `${mapping.program_version?.name} (${mapping.program.name})` : mapping?.program_version?.name ?? "";
  const unitLabel = curriculum_unit?.unit ? [curriculum_unit.unit.code, curriculum_unit.unit.name].filter(Boolean).join(" - ") : "";
  const { data, setData, put, processing, errors } = useForm({
    program_version_id: "",
    program_version_mapping_id: "",
    unit_id: "",
    module_taught: ""
  });
  useEffect(() => {
    if (!curriculum_unit || hasInitialized.current) return;
    setData({
      program_version_id: curriculum_unit.program_version_id ?? curriculum_unit.program_version_mapping?.program_version_id ?? "",
      program_version_mapping_id: curriculum_unit.program_version_mapping_id ?? "",
      unit_id: curriculum_unit.unit_id ?? "",
      module_taught: curriculum_unit.module_taught ?? ""
    });
    hasInitialized.current = true;
  }, [curriculum_unit]);
  const submit = (e) => {
    e.preventDefault();
    put(route("units.program-version-units.update", curriculum_unit.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Course Version Unit" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "program_version_id",
              value: "Cycle"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "program-versions.search",
              defaultOptions: [],
              placeholder: "Search cycle...",
              value: data.program_version_id,
              selectedLabel: cycleLabel,
              preloadOptions: true,
              minSearchLength: 3,
              onChange: (cycle) => {
                const cycleId = cycle.id ?? "";
                setData({
                  ...data,
                  program_version_id: cycleId,
                  program_version_mapping_id: String(cycleId) === String(data.program_version_id) ? data.program_version_mapping_id : ""
                });
              },
              error: errors.program_version_id
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.program_version_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Course" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "program-version-mappings.search",
              routeParams: {
                program_version_id: data.program_version_id
              },
              defaultOptions: [],
              value: data.program_version_mapping_id,
              selectedLabel: courseLabel,
              placeholder: data.program_version_id ? "Search course under cycle..." : "Select cycle first...",
              preloadOptions: true,
              minSearchLength: 3,
              onChange: (item) => setData("program_version_mapping_id", item.id),
              error: errors.program_version_mapping_id,
              disabled: !data.program_version_id
            },
            data.program_version_id || "no-cycle"
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.program_version_mapping_id,
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
              defaultOptions: [],
              placeholder: "Search Unit...",
              value: data.unit_id,
              selectedLabel: unitLabel,
              preloadOptions: true,
              minSearchLength: 3,
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
            href: route("units.program-version-units.index"),
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
            ] }) : "Update Course Version Unit"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  EditProgramVersionUnit as default
};
