import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import "react";
function AddExamBody() {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    description: ""
  });
  const handleChange = (e) => setData(e.target.name, e.target.value);
  const submit = (e) => {
    e.preventDefault();
    post(route("exam.bodies.store"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Exam Body" }),
    /* @__PURE__ */ jsx("div", { className: " mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Add exam body" }),
      /* @__PURE__ */ jsxs("form", { className: "p-6 space-y-6", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "code",
                value: "Entity Code"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "code",
                name: "code",
                isFocused: true,
                placeholder: "e.g. KNEC, NITA",
                value: data.code,
                onChange: handleChange,
                error: errors.code
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "name",
                value: "Entity Name"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                name: "name",
                placeholder: "e.g. Kenya National Examination Council",
                value: data.name,
                onChange: handleChange,
                error: errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              name: "description",
              rows: "4",
              placeholder: "Provide details about the exam body...",
              value: data.description,
              onChange: handleChange,
              error: errors.description
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("exam.bodies.index"),
              className: "px-5 py-2 bg-zinc-400 text-white rounded-lg text-sm hover:bg-zinc-500 transition",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" }),
                "Saving..."
              ] }) : "Save"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AddExamBody as default
};
