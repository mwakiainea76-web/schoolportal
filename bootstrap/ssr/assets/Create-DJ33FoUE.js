import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "ziggy-js";
function Create({
  curriculum_mapping,
  selected_mapping_option
}) {
  const { data, setData, post, processing, errors } = useForm({
    curriculum_mapping_id: selected_mapping_option?.id || curriculum_mapping?.id || "",
    code: "",
    name: "",
    credit_factor: "",
    training_hours: "",
    description: "",
    scope: "core",
    module_taught: ""
  });
  const selectedMappingLabel = selected_mapping_option?.name || [
    curriculum_mapping?.curriculum?.name,
    curriculum_mapping?.course?.display_name || curriculum_mapping?.course?.name
  ].filter(Boolean).join(" - ");
  const submit = (e) => {
    e.preventDefault();
    post(route("units.store"));
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Unit" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm", children: /* @__PURE__ */ jsxs("form", { className: "space-y-6 p-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border  p-4", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "curriculum_mapping_id",
            value: "Versioned Course"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(
          SearchSelect,
          {
            value: data.curriculum_mapping_id,
            selectedLabel: selectedMappingLabel,
            defaultOptions: selected_mapping_option ? [selected_mapping_option] : [],
            routeName: "courses.curriculum-mappings.search",
            preloadOptions: true,
            minSearchLength: 2,
            placeholder: "Search active course by code, name, curriculum, or level...",
            onChange: (item) => setData(
              "curriculum_mapping_id",
              item.id || ""
            ),
            error: errors.curriculum_mapping_id
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-600", children: "The selected course includes its certification level for easier identification." }),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.curriculum_mapping_id,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "code", value: "Unit Code" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "code",
              type: "text",
              className: "mt-1 block w-full",
              value: data.code,
              onChange: (e) => setData("code", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.code,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Unit Name" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "name",
              type: "text",
              className: "mt-1 block w-full",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.name,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "credit_factor",
              value: "Credit Factor"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "credit_factor",
              type: "number",
              className: "mt-1 block w-full",
              value: data.credit_factor,
              onChange: (e) => setData("credit_factor", e.target.value),
              required: true,
              min: "1"
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.credit_factor,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "training_hours",
              value: "Training Hours"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "training_hours",
              type: "number",
              className: "mt-1 block w-full",
              value: data.training_hours,
              onChange: (e) => setData(
                "training_hours",
                e.target.value
              ),
              required: true,
              min: "1"
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.training_hours,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "scope",
              value: "Unit Scope"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "scope",
              className: "mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
              value: data.scope,
              onChange: (e) => setData("scope", e.target.value),
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "basic", children: "Basic" }),
                /* @__PURE__ */ jsx("option", { value: "common", children: "Common" }),
                /* @__PURE__ */ jsx("option", { value: "core", children: "Core" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.scope,
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
              value: data.module_taught,
              onChange: (e) => setData("module_taught", e.target.value),
              required: true,
              min: "1",
              max: "6"
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
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "description",
            value: "Description (Optional)"
          }
        ),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "description",
            className: "mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
            rows: "3",
            value: data.description,
            onChange: (e) => setData("description", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.description,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-x-4 border-t border-zinc-100 pt-6", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("units.index", {
              curriculum_mapping_id: data.curriculum_mapping_id || ""
            }),
            className: "rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing,
            type: "submit",
            className: "rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50",
            children: processing ? "Saving..." : "Save Unit"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  Create as default
};
