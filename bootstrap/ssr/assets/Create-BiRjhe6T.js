import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-DbLPTvUh.js";
import "react";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function AddCertificationLevel({
  examBodies,
  selectedExamBodyId,
  selectedExamBody
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    exam_body_id: selectedExamBodyId ?? "",
    name: "",
    description: "",
    entry_grade: "",
    modules: 1
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("certification-levels.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData("code", "");
        setData("name", "");
        setData("description", "");
        setData("entry_grade", "");
        setData("modules", 1);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Certification Level" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Add certification level" }),
      /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        null,
        selectedExamBody ? /* @__PURE__ */ jsxs("div", { className: "rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: [
          "Creating a certification level for",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedExamBody.name }),
          selectedExamBody.code ? ` (${selectedExamBody.code})` : "",
          "."
        ] }) : null,
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "code",
                value: "Certification Code"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "code",
                type: "text",
                name: "code",
                className: `mt-1 block w-full ${errors.code ? "border-red-400" : "border-zinc-200"}`,
                placeholder: "e.g. KNEC-ART, NITA-CERT, CDACC-DIP",
                isFocused: true,
                value: data.code,
                onChange: (e) => setData("code", e.target.value)
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
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "name",
                value: "Certification Name"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                type: "text",
                name: "name",
                className: `mt-1 block w-full ${errors.name ? "border-red-400" : "border-zinc-200"}`,
                placeholder: "e.g. Artisan, Certificate, Diploma",
                value: data.name,
                onChange: (e) => setData("name", e.target.value)
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
                htmlFor: "exam_body_id",
                value: "Exam Body"
              }
            ),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "exam-bodies.search",
                defaultOptions: [],
                value: data.exam_body_id,
                selectedLabel: selectedExamBody ? `${selectedExamBody.code} - ${selectedExamBody.name}` : null,
                placeholder: "Search Exam Body...",
                disabled: false,
                onChange: (body) => setData("exam_body_id", body.id),
                error: errors.exam_body_id
              }
            ),
            null,
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.exam_body_id,
                className: "mt-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "entry_grade",
                value: "Entry Grade"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "entry_grade",
                type: "text",
                name: "entry_grade",
                className: `mt-1 block w-full ${errors.entry_grade ? "border-red-400" : "border-zinc-200"}`,
                placeholder: "e.g. C, C+",
                value: data.entry_grade,
                onChange: (e) => setData("entry_grade", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.entry_grade,
                className: "mt-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "modules",
                value: "Modules"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "modules",
                type: "number",
                name: "modules",
                className: `mt-1 block w-full ${errors.modules ? "border-red-400" : "border-zinc-200"}`,
                min: "1",
                value: data.modules,
                onChange: (e) => setData("modules", e.target.value)
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
              "Duration: ",
              Math.max(parseInt(data.modules || 1, 10), 1) * 4,
              " months"
            ] }),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.modules,
                className: "mt-2"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "description",
              value: "Certification Description"
            }
          ),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              name: "description",
              rows: "5",
              className: `mt-1 block w-full ${errors.description ? "border-red-400" : "border-zinc-200"}`,
              placeholder: "Provide details about the certification level...",
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
              href: route("certification-levels.index", selectedExamBodyId ? {
                exam_body_id: selectedExamBodyId
              } : {}),
              className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing || false,
              type: "submit",
              className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
              children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                "Saving",
                /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
              ] }) : "Save"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AddCertificationLevel as default
};
