import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
const Edit = ({ course, certification_levels, departments }) => {
  const crs = course || null;
  let certs = certification_levels.map((cert) => ({
    id: cert.id,
    name: ` ${cert.exam_body.code} - ${cert.name}`
  }));
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors } = useForm({
    code: "",
    name: "",
    description: "",
    duration_in_months: "",
    is_active: "",
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
        duration_in_months: "",
        is_active: "",
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
      duration_in_months: course.duration_in_months ?? "",
      is_active: course.is_active ?? "",
      certification_level_id: course.certification_level_id ?? "",
      department_id: course.department_id ?? "",
      initials: course.initials ?? ""
    });
    hasInitialized.current = true;
  }, [course]);
  const submit = (e) => {
    e.preventDefault();
    if (!crs) return;
    put(route("courses.update", crs.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Course" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border shadow overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "w-full p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [
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
              defaultOptions: departments,
              value: data.department_id,
              onChange: (e) => setData("department_id", e.target.value)
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
              defaultOptions: certs,
              value: data.certification_level_id,
              onChange: (e) => setData(
                "certification_level_id",
                e.target.value
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
              value: data.code,
              error: errors.code,
              onChange: (e) => setData("code", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.code })
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
              value: data.name,
              error: errors.name,
              onChange: (e) => setData("name", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name })
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
              htmlFor: "duration_in_months",
              value: "Duration (months)"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              min: "1",
              value: data.duration_in_months,
              error: errors.duration_in_months,
              onChange: (e) => setData(
                "duration_in_months",
                e.target.value
              )
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.duration_in_months
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Set course active",
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
            disabled: processing || !crs,
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
