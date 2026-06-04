import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import { A as AuthenticatedLayout } from "../app.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import "ziggy-js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function EditCourseVersion({
  courseVersionMapping
}) {
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    course_version_id: "",
    is_active: true,
    description: "",
    exam_body_id: ""
  });
  useEffect(() => {
    if (!courseVersionMapping) {
      reset();
      hasInitialized.current = false;
      return;
    }
    setData({
      course_version_id: courseVersionMapping.course_version_id ?? "",
      is_active: !!courseVersionMapping.is_active,
      description: courseVersionMapping.description ?? "",
      exam_body_id: courseVersionMapping.course?.certification_level?.exam_body_id ?? courseVersionMapping.course?.certificationLevel?.exam_body_id ?? ""
    });
    hasInitialized.current = true;
  }, [courseVersionMapping]);
  const submit = (e) => {
    e.preventDefault();
    if (!courseVersionMapping) return;
    put(route("courses.course-version-mappings.update", courseVersionMapping.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Course Version Mapping" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "exam-bodies.search",
              defaultOptions: [],
              value: data.exam_body_id,
              selectedLabel: courseVersionMapping?.course?.certification_level?.exam_body ? `${courseVersionMapping.course.certification_level.exam_body.code} - ${courseVersionMapping.course.certification_level.exam_body.name}` : courseVersionMapping?.course?.certificationLevel?.examBody ? `${courseVersionMapping.course.certificationLevel.examBody.code} - ${courseVersionMapping.course.certificationLevel.examBody.name}` : void 0,
              placeholder: "Search exam body...",
              preloadOptions: true,
              onChange: (item) => setData("exam_body_id", item.id),
              error: errors.exam_body_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.exam_body_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Course Version" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "course-versions.search",
              defaultOptions: [],
              value: data.course_version_id,
              selectedLabel: courseVersionMapping?.course_version?.name,
              placeholder: "Select course version...",
              preloadOptions: true,
              onChange: (item) => setData("course_version_id", item.id),
              error: errors.course_version_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.course_version_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Set as current course version mapping",
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
            href: route("courses.course-version-mappings.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !courseVersionMapping,
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
  EditCourseVersion as default
};
