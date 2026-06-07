import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import { A as AuthenticatedLayout } from "../app.js";
import CourseWorkspaceTabs from "./CourseWorkspaceTabs-D8YFDE67.js";
import "ziggy-js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Createcourse() {
  const { data, setData, post, processing, errors } = useForm({
    exam_body_id: "",
    curriculum_id: "",
    code: "",
    name: "",
    description: "",
    initials: "",
    certification_level_id: "",
    department_id: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("courses.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData("exam_body_id", "");
        setData("curriculum_id", "");
        setData("certification_level_id", "");
        setData("code", "");
        setData("name", "");
        setData("description", "");
        setData("initials", "");
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Course" }),
    /* @__PURE__ */ jsxs("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(CourseWorkspaceTabs, { activeTab: "add-course" }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: " grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3  gap-8", children: [
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
                placeholder: "Select exam body...",
                value: data.exam_body_id,
                preloadOptions: true,
                onChange: (examBody) => {
                  setData({
                    ...data,
                    exam_body_id: examBody.id,
                    curriculum_id: "",
                    certification_level_id: ""
                  });
                },
                error: errors.exam_body_id
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
                placeholder: "Select curriculum...",
                value: data.curriculum_id,
                preloadOptions: true,
                minSearchLength: 0,
                disabled: !data.exam_body_id,
                onChange: (curriculum) => setData("curriculum_id", curriculum.id),
                error: errors.curriculum_id
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
                placeholder: "Search Department...",
                value: data.department_id,
                preloadOptions: true,
                onChange: (dept) => setData("department_id", dept.id),
                error: errors.department_id
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
                placeholder: "Select certification level...",
                value: data.certification_level_id,
                preloadOptions: true,
                minSearchLength: 0,
                disabled: !data.exam_body_id,
                onChange: (level) => setData(
                  "certification_level_id",
                  level.id
                ),
                error: errors.certification_level_id
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.certification_level_id,
                className: "mt-2"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              name: "description",
              rows: "5",
              className: "mt-1 block w-full",
              placeholder: "Provide details about the course...",
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
              href: route("courses.index"),
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
      ] }) })
    ] })
  ] });
}
export {
  Createcourse as default
};
