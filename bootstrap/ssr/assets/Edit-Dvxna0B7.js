import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-DbLPTvUh.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
const Edit = ({
  course,
  selected_filters = {}
}) => {
  const activecourse = course || null;
  const activeMapping = course?.curriculum_mappings?.find(
    (mapping) => mapping.is_active
  );
  const selectedMapping = activeMapping || course?.curriculum_mappings?.[0] || null;
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors } = useForm({
    code: "",
    name: "",
    description: "",
    exam_body_id: "",
    curriculum_id: "",
    certification_level_id: "",
    department_id: "",
    initials: ""
  });
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!course) {
      setData({
        code: "",
        name: "",
        description: "",
        exam_body_id: "",
        curriculum_id: "",
        certification_level_id: "",
        department_id: "",
        initials: ""
      });
      return;
    }
    setData({
      code: course.code ?? "",
      name: course.name ?? "",
      description: course.description ?? "",
      exam_body_id: course.certification_level?.exam_body_id ?? "",
      curriculum_id: selectedMapping?.curriculum_id ?? "",
      certification_level_id: course.certification_level_id ?? "",
      department_id: course.department_id ?? "",
      initials: course.initials ?? ""
    });
    hasInitialized.current = true;
  }, [course]);
  const submit = (e) => {
    e.preventDefault();
    if (!activecourse) return;
    put(route("courses.update", activecourse.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Course" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "w-full p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [
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
              selectedLabel: selected_filters.exam_body,
              placeholder: "Select exam body...",
              preloadOptions: true,
              onChange: (examBody) => setData({
                ...data,
                exam_body_id: examBody.id,
                curriculum_id: "",
                certification_level_id: ""
              })
            }
          ),
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
              htmlFor: "curriculum_id",
              value: "Curriculum"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "curriculums.search",
              routeParams: {
                exam_body_id: data.exam_body_id
              },
              defaultOptions: [],
              value: data.curriculum_id,
              selectedLabel: selected_filters.curriculum,
              placeholder: "Select curriculum...",
              preloadOptions: true,
              minSearchLength: 0,
              disabled: !data.exam_body_id,
              onChange: (curriculum) => setData(
                "curriculum_id",
                curriculum.id
              )
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.curriculum_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "department_id",
              value: "Department"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "departments.search",
              defaultOptions: [],
              value: data.department_id,
              selectedLabel: selected_filters.department,
              placeholder: "Search Department...",
              preloadOptions: true,
              onChange: (dept) => setData("department_id", dept.id)
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.department_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "certification_level_id",
              value: "Certification Level"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "certification-levels.search",
              routeParams: {
                exam_body_id: data.exam_body_id
              },
              defaultOptions: [],
              value: data.certification_level_id,
              selectedLabel: selected_filters.certification_level,
              placeholder: "Select certification level...",
              preloadOptions: true,
              minSearchLength: 0,
              disabled: !data.exam_body_id,
              onChange: (level) => setData(
                "certification_level_id",
                level.id
              )
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.certification_level_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "code",
              value: "Course Code"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "code",
              type: "text",
              name: "code",
              className: "mt-1 block w-full",
              placeholder: "e.g. CS101",
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
              value: "Course Name"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "name",
              type: "text",
              name: "name",
              className: "mt-1 block w-full",
              placeholder: "e.g. Certificate in ICT",
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
              htmlFor: "Initials",
              value: "Course Initials"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "Initials",
              type: "text",
              name: "initials",
              className: "mt-1 block w-full",
              placeholder: "e.g. FB,HD",
              value: data.initials,
              onChange: (e) => setData("initials", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.initials,
              className: "mt-2"
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
            onChange: (e) => setData("description", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-6 border-t", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("courses.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !activecourse,
            type: "submit",
            className: "px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50",
            children: processing ? "Updating..." : "Update"
          }
        )
      ] })
    ] }) }) })
  ] });
};
export {
  Edit as default
};
