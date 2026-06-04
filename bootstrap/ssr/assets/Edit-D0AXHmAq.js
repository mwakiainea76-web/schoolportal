import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "../app.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
const Edit = ({
  program,
  selected_filters = {}
}) => {
  const activeProgram = program || null;
  const activeMapping = program?.program_version_mappings?.find(
    (mapping) => mapping.is_active
  );
  const selectedMapping = activeMapping || program?.program_version_mappings?.[0] || null;
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors } = useForm({
    code: "",
    name: "",
    description: "",
    program_version_id: "",
    certification_level_id: "",
    department_id: "",
    initials: ""
  });
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!program) {
      setData({
        code: "",
        name: "",
        description: "",
        program_version_id: "",
        certification_level_id: "",
        department_id: "",
        initials: ""
      });
      return;
    }
    setData({
      code: program.code ?? "",
      name: program.name ?? "",
      description: program.description ?? "",
      program_version_id: selectedMapping?.program_version_id ?? "",
      certification_level_id: program.certification_level_id ?? "",
      department_id: program.department_id ?? "",
      initials: program.initials ?? ""
    });
    hasInitialized.current = true;
  }, [program]);
  const submit = (e) => {
    e.preventDefault();
    if (!activeProgram) return;
    put(route("programs.update", activeProgram.id), {
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
              htmlFor: "program_version_id",
              value: "Course Version"
            }
          ),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "program-versions.search",
              defaultOptions: [],
              value: data.program_version_id,
              selectedLabel: selected_filters.program_version,
              placeholder: "Select course version...",
              preloadOptions: true,
              onChange: (version) => setData("program_version_id", version.id)
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.program_version_id,
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
              defaultOptions: [],
              value: data.certification_level_id,
              selectedLabel: selected_filters.certification_level,
              placeholder: "Type in certification name ...",
              preloadOptions: true,
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
            href: route("programs.index"),
            className: "px-4 py-2 bg-slate-400 text-white rounded",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing || !activeProgram,
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
