import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { A as AuthenticatedLayout } from "../app.js";
import "ziggy-js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const Edit = ({ curriculum }) => {
  const c = curriculum;
  const lifecycleText = c?.end_date ? "Session is done" : c?.start_date ? "Session is ongoing" : "Upcoming";
  const isVersionStateLocked = Boolean(c?.end_date);
  const versionStateOptions = [
    { id: "start", name: "Start Version" },
    { id: "end", name: "End Version" }
  ];
  const { data, setData, put, processing, errors } = useForm({
    program_id: c?.program_id || "",
    exam_body_id: c?.exam_body_id || c?.program?.certification_level?.exam_body_id || "",
    name: c?.name || "",
    description: c?.description || "",
    version_state: c?.is_active ? "start" : "end"
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("program-versions.update", c.id), {
      preserveState: true,
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Course Version" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("legend", { className: "text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit course version details" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-10 space-y-6 border rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Course", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "programs.search",
                    defaultOptions: [],
                    value: data.program_id,
                    selectedLabel: c?.program?.display_name || c?.program?.name,
                    placeholder: "Search course...",
                    preloadOptions: true,
                    minSearchLength: 3,
                    onChange: (program) => setData({
                      ...data,
                      program_id: program.id,
                      exam_body_id: program.exam_body_id ?? ""
                    }),
                    error: errors.program_id
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.program_id }),
                /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Course Version Name", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    className: "cursor-not-allowed bg-gray-100",
                    disabled: true,
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    error: errors.name
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Version State", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: null,
                    defaultOptions: versionStateOptions,
                    value: data.version_state,
                    selectedLabel: data.version_state === "start" ? "Start Version" : "End Version",
                    placeholder: "Select version state",
                    onChange: (item) => setData("version_state", item.id),
                    error: errors.version_state,
                    disabled: isVersionStateLocked
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.version_state }),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: `mt-1 text-xs ${isVersionStateLocked ? "text-amber-600" : "text-slate-500"}`,
                    children: isVersionStateLocked ? "This course version is closed and cannot be reactivated." : lifecycleText
                  }
                )
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
                  href: route("program-versions.index"),
                  className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  disabled: processing || !c,
                  type: "submit",
                  className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    "Saving",
                    /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
                  ] }) : "Save"
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
  Edit as default
};
