import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function EditCurriculum({ courses, curriculum }) {
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
    description: "",
    course_id: ""
  });
  useEffect(() => {
    if (!curriculum) {
      reset();
      hasInitialized.current = false;
      return;
    }
    setData({
      name: curriculum.name ?? "",
      start_date: curriculum.start_date ?? "",
      end_date: curriculum.end_date ?? "",
      is_active: !!curriculum.is_active,
      description: curriculum.description ?? "",
      course_id: curriculum.course_id ?? ""
    });
    hasInitialized.current = true;
  }, [curriculum]);
  const submit = (e) => {
    e.preventDefault();
    if (!curriculum) return;
    put(route("courses.curriculum.update", curriculum.id), {
      preserveScroll: true
    });
    setSearchTerm("");
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculum" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Course" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "courses.search",
              defaultOptions: courses,
              value: data.course_id,
              selectedLabel: curriculum?.course?.name,
              placeholder: "Search Course...",
              onChange: (c) => setData("course_id", c.id),
              error: errors.course_id
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.course_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "name",
              value: "Curriculum Name"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "name",
              type: "text",
              className: "mt-1 block w-full",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              error: errors.name
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
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Set as current curriculum",
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
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "start_date",
              value: "Effective Date"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "start_date",
              type: "date",
              className: "mt-1 block w-full",
              value: data.start_date,
              onChange: (e) => setData("start_date", e.target.value),
              error: errors.start_date
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.start_date,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "end_date",
              value: "Expiry Date (Optional)"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "end_date",
              type: "date",
              className: "mt-1 block w-full",
              value: data.end_date,
              onChange: (e) => setData("end_date", e.target.value),
              error: errors.end_date
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.end_date,
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
            href: route("courses.curriculum.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !curriculum,
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
