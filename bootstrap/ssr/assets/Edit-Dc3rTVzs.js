import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "ziggy-js";
const Edit = ({ certification_level, exam_bodies, selectedExamBody }) => {
  const cert = certification_level || null;
  const { data, setData, put, processing, errors } = useForm({
    code: certification_level?.code ?? "",
    exam_body_id: certification_level?.exam_body_id ?? "",
    name: certification_level?.name ?? "",
    description: certification_level?.description ?? "",
    entry_grade: certification_level?.entry_grade ?? "",
    modules: certification_level?.modules ?? 1
  });
  const submit = (e) => {
    e.preventDefault();
    if (!cert) return;
    put(route("certification-levels.update", encodeURIComponent(cert.id)), {
      preserveScroll: true,
      preserveState: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Certification Level" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border shadow overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Edit certification level" }),
      /* @__PURE__ */ jsxs("form", { className: "w-full p-10 space-y-8", onSubmit: submit, children: [
        null,
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Certification Code" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                error: errors.code,
                value: data.code,
                onChange: (e) => setData("code", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Certification Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                error: errors.name,
                value: data.name,
                onChange: (e) => setData("name", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name })
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
            /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Entry Grade" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                error: errors.entry_grade,
                value: data.entry_grade,
                onChange: (e) => setData("entry_grade", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.entry_grade })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Modules" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                error: errors.modules,
                value: data.modules,
                onChange: (e) => setData("modules", e.target.value)
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
              "Duration: ",
              Math.max(parseInt(data.modules || 1, 10), 1) * 4,
              " months"
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.modules })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              error: errors.description,
              value: data.description,
              onChange: (e) => setData("description", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("certification-levels.index", selectedExamBody?.id ? {
                exam_body_id: selectedExamBody.id
              } : {}),
              className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing || !cert || false,
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
};
export {
  Edit as default
};
