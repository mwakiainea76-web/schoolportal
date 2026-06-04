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
const Create = () => {
  const { data, setData, post, processing, errors } = useForm({
    program_id: "",
    exam_body_id: "",
    name: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("program-versions.store"), {
      preserveState: true,
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Course Version" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: "text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Add course version" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-10 space-y-6 border rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Course", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "programs.search",
                    defaultOptions: [],
                    placeholder: "Search course...",
                    value: data.program_id,
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
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    error: errors.name
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] })
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
                  disabled: processing,
                  type: "submit",
                  className: "px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    "Saving",
                    /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
                  ] }) : "Create Course Version"
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
  Create as default
};
