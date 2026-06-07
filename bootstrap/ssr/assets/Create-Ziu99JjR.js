import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "../app.js";
import DepartmentWorkspaceTabs from "./DepartmentWorkspaceTabs-B9DqQFLw.js";
import "react";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function CreateDepartment() {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    hod_staff_number: "",
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("departments.store"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Department" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(DepartmentWorkspaceTabs, { activeTab: "add-department" }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
        /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Add department" }),
        /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  htmlFor: "code",
                  value: "Department Code"
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "code",
                  error: errors.code,
                  type: "text",
                  name: "code",
                  className: "mt-1 block w-full",
                  placeholder: "e.g. HR, FIN, IT",
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
                  value: "Department Name"
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "name",
                  error: errors.name,
                  type: "text",
                  name: "name",
                  className: "mt-1 block w-full",
                  placeholder: "e.g. Human Resources",
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
              /* @__PURE__ */ jsx(InputLabel, { value: "HOD (Staff number)" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "hod_staff_number",
                  error: errors.hod_staff_number,
                  type: "text",
                  name: "hod_staff_number",
                  className: "mt-1 block w-full",
                  placeholder: "Nullable: enter exact staff number",
                  value: data.hod_staff_number,
                  onChange: (e) => setData(
                    "hod_staff_number",
                    e.target.value
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.hod_staff_number,
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
                error: errors.description,
                rows: "5",
                className: "mt-1 block w-full",
                placeholder: "Provide details about the department...",
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
                href: route("departments.index"),
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
        ] })
      ] })
    ] })
  ] });
}
export {
  CreateDepartment as default
};
