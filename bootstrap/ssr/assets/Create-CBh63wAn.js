import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import "ziggy-js";
function CreateCurriculum() {
  const { data, setData, post, processing, errors, reset } = useForm({
    curriculum_id: "",
    exam_body_id: "",
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("courses.curriculum-mappings.store"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Curriculum Mapping" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "curriculums.search",
              defaultOptions: [],
              value: data.curriculum_id,
              placeholder: "Select curriculum...",
              preloadOptions: true,
              onChange: (c) => setData("curriculum_id", c.id),
              error: errors.curriculum_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.curriculum_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "exam.bodies.search",
              defaultOptions: [],
              value: data.exam_body_id,
              placeholder: "Search exam body...",
              preloadOptions: true,
              onChange: (c) => setData("exam_body_id", c.id),
              error: errors.exam_body_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
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
            placeholder: "Additional details about this curriculum mapping...",
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
            href: route("courses.curriculum-mappings.index"),
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
  CreateCurriculum as default
};
