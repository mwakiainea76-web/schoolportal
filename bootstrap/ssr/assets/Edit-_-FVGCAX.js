import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
function EditCurriculum({
  curriculumMapping
}) {
  const { data, setData, put, processing, errors, reset } = useForm({
    curriculum_id: "",
    description: "",
    exam_body_id: ""
  });
  useEffect(() => {
    if (!curriculumMapping) {
      reset();
      hasInitialized.current = false;
      return;
    }
    setData({
      curriculum_id: curriculumMapping.curriculum_id ?? "",
      description: curriculumMapping.description ?? "",
      exam_body_id: curriculumMapping.course?.certification_level?.exam_body_id ?? curriculumMapping.course?.certificationLevel?.exam_body_id ?? ""
    });
  }, [curriculumMapping]);
  const submit = (e) => {
    e.preventDefault();
    if (!curriculumMapping) return;
    put(route("courses.curriculum-mappings.update", curriculumMapping.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculum Mapping" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "exam.bodies.search",
              defaultOptions: [],
              value: data.exam_body_id,
              selectedLabel: curriculumMapping?.course?.certification_level?.exam_body ? `${curriculumMapping.course.certification_level.exam_body.code} - ${curriculumMapping.course.certification_level.exam_body.name}` : curriculumMapping?.course?.certificationLevel?.examBody ? `${curriculumMapping.course.certificationLevel.examBody.code} - ${curriculumMapping.course.certificationLevel.examBody.name}` : void 0,
              placeholder: "Search exam body...",
              preloadOptions: true,
              onChange: (item) => setData("exam_body_id", item.id),
              error: errors.exam_body_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "curriculums.search",
              defaultOptions: [],
              value: data.curriculum_id,
              selectedLabel: curriculumMapping?.curriculum?.name,
              placeholder: "Select curriculum...",
              preloadOptions: true,
              onChange: (item) => setData("curriculum_id", item.id),
              error: errors.curriculum_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.curriculum_id })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
        /* @__PURE__ */ jsx(
          TextArea,
          {
            rows: "4",
            className: "mt-1 block w-full",
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
            disabled: processing || !curriculumMapping,
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
  EditCurriculum as default
};
