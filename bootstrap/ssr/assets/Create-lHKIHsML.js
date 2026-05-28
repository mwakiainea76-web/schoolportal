import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function CreateProgramVersion({
  program_versions,
  programs
}) {
  const hasPrograms = programs.length > 0;
  const hasProgramVersions = program_versions.length > 0;
  const canMap = hasPrograms && hasProgramVersions;
  const { data, setData, post, processing, errors, reset } = useForm({
    program_version_id: "",
    program_id: "",
    is_active: false,
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("programs.program-version-mappings.store"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Program Version Mapping" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      !canMap ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "You cannot map a program version to a program until both a program and a program version exist." }) : null,
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Program Version" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "programs.program-version-mappings.search",
              defaultOptions: program_versions,
              value: data.program_version_id,
              placeholder: "Search program version...",
              onChange: (c) => setData("program_version_id", c.id),
              error: errors.program_version_id,
              disabled: !hasProgramVersions
            }
          ),
          !hasProgramVersions ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a program version first to continue." }) : null,
          /* @__PURE__ */ jsx(InputError, { message: errors.program_version_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Program" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "programs.program-version-mappings.program-search",
              defaultOptions: programs,
              value: data.program_id,
              placeholder: "Search program...",
              onChange: (c) => setData("program_id", c.id),
              error: errors.program_id,
              disabled: !hasPrograms
            }
          ),
          !hasPrograms ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a program first to continue." }) : null,
          /* @__PURE__ */ jsx(InputError, { message: errors.program_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Set as current program version mapping",
              checked: data.is_active,
              onChange: (checked) => setData("is_active", checked),
              error: errors.is_active
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.is_active,
              className: "mt-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Description" }),
        /* @__PURE__ */ jsx(
          TextArea,
          {
            name: "description",
            rows: "4",
            className: "mt-1 block w-full",
            placeholder: "Additional details about this program version mapping...",
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
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("programs.program-version-mappings.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !canMap,
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
  CreateProgramVersion as default
};
