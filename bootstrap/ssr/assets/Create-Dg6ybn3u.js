import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function CreateProgram({ certification_levels, departments }) {
  const hasDepartments = departments.length > 0;
  const certs = certification_levels.map((cert) => ({
    id: cert.id,
    name: ` ${cert.exam_body.code} - ${cert.name}`
  }));
  const hasCertificationLevels = certs.length > 0;
  const canCreateProgram = hasDepartments && hasCertificationLevels;
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    description: "",
    duration_in_months: "",
    initials: "",
    certification_level_id: "",
    department_id: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("programs.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setData("code", "");
        setData("name", "");
        setData("description", "");
        setData("duration_in_months", "");
        setData("initials", "");
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Program" }),
    /* @__PURE__ */ jsx("div", { className: " mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      !canCreateProgram ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "You cannot create a program until both a department and a certification level exist." }) : null,
      /* @__PURE__ */ jsxs("div", { className: " grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3  gap-8", children: [
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
              placeholder: "Search Department...",
              value: data.department_id,
              onChange: (dept) => setData("department_id", dept.id),
              error: errors.department_id,
              disabled: !hasDepartments
            }
          ),
          !hasDepartments ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a department first to continue." }) : null,
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
              placeholder: "Type in certification name ...",
              value: data.certification_level_id,
              onChange: (level) => setData(
                "certification_level_id",
                level.id
              ),
              error: errors.certification_level_id,
              disabled: !hasCertificationLevels
            }
          ),
          !hasCertificationLevels ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a certification level first to continue." }) : null,
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
              value: "Program Code"
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
              value: "Program Name"
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
              value: "Program Initials"
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
              id: "duration_in_months",
              type: "number",
              name: "duration_in_months",
              className: "mt-1 block w-full",
              placeholder: "e.g. 6",
              min: "1",
              value: data.duration_in_months,
              onChange: (e) => setData(
                "duration_in_months",
                e.target.value
              )
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.duration_in_months,
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
            placeholder: "Provide details about the program...",
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
            href: route("programs.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !canCreateProgram,
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
  CreateProgram as default
};
