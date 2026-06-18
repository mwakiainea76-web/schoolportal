import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
const Edit = ({ curriculum }) => {
  const c = curriculum;
  const { data, setData, put, processing, errors } = useForm({
    exam_body_id: c?.exam_body?.id || "",
    name: c?.name || "",
    description: c?.description || ""
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("curriculums.update", c.id), {
      preserveState: true,
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculum" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("legend", { className: "text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit curriculum details" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-10 space-y-6 border rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body ", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "exam.bodies.search",
                    value: data.exam_body_id,
                    selectedLabel: c?.exam_body?.name || "",
                    placeholder: "Select exam body...",
                    minSearchLength: 0,
                    preloadOptions: true,
                    onChange: (examBody) => setData("exam_body_id", examBody.id ?? ""),
                    error: errors.exam_body_id
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum Name", required: true }),
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
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Brief Description" }),
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
                  href: route("curriculums.index"),
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
