import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { A as AuthenticatedLayout } from "../app.js";
import "ziggy-js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    program_version_id: "",
    program_version_mapping_id: "",
    unit_id: "",
    module_taught: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("units.program-version-units.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData({
          ...data,
          unit_id: "",
          module_taught: ""
        });
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Assign Unit to Course Version" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2", children: [
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
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "program_version_mapping_id",
              value: "Course"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "program-version-mappings.search",
              routeParams: {
                program_version_id: data.program_version_id
              },
              defaultOptions: [],
              placeholder: data.program_version_id ? "Search course under cycle..." : "Select cycle first...",
              value: data.program_version_mapping_id,
              preloadOptions: true,
              minSearchLength: 3,
              onChange: (curr) => setData("program_version_mapping_id", curr.id),
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
            href: route("units.program-version-units.index"),
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
