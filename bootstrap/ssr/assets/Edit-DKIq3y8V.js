import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Edit({
  feeModel,
  templates,
  departments,
  curricula,
  academicSessions
}) {
  const { data, setData, put, processing, errors } = useForm({
    fee_template_id: feeModel.fee_template_id || "",
    scope: feeModel.scope || "global",
    priority: feeModel.priority || "60",
    department_id: feeModel.department_id || "",
    curricula_id: feeModel.curricula_id || "",
    academic_session_id: feeModel.academic_session_id || "",
    valid_from: feeModel.valid_from || "",
    valid_until: feeModel.valid_until || "",
    is_active: feeModel.is_active || false
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("fees.models.update", feeModel.id), {
      preserveScroll: true
    });
  };
  const scopeOptions = [
    { value: "global", label: "Global - Applies to all students" },
    {
      value: "department",
      label: "Department - Applies to specific department"
    },
    {
      value: "curriculum",
      label: "Curriculum - Applies to specific curriculum"
    }
  ];
  const priorityOptions = [
    { value: "60", label: "Low Priority (60)" },
    { value: "70", label: "Medium Priority (70)" },
    { value: "80", label: "High Priority (80)" }
  ];
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Edit Fee Model - ${feeModel.display_name}` }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl w-full", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "bg-white p-10 space-y-6 border rounded-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Fee Template", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "fee-templates.search",
                    defaultOptions: templates,
                    placeholder: "Search fee templates...",
                    value: data.fee_template_id,
                    onChange: (template) => setData("fee_template_id", template.id),
                    error: errors.fee_template_id
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.fee_template_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Session", required: true }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.sessions.search",
                    defaultOptions: academicSessions,
                    placeholder: "Search academic sessions...",
                    value: data.academic_session_id,
                    onChange: (session) => setData(
                      "academic_session_id",
                      session.id
                    ),
                    error: errors.academic_session_id
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.academic_session_id
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Scope", required: true }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    name: "scope",
                    value: data.scope,
                    onChange: handleChange,
                    className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    children: scopeOptions.map((option) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: option.value,
                        children: option.label
                      },
                      option.value
                    ))
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.scope })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Priority", required: true }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    name: "priority",
                    value: data.priority,
                    onChange: handleChange,
                    className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    children: priorityOptions.map((option) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: option.value,
                        children: option.label
                      },
                      option.value
                    ))
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.priority })
              ] })
            ] }),
            data.scope === "department" && /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Department", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "departments.search",
                  defaultOptions: departments,
                  placeholder: "Search departments...",
                  value: data.department_id,
                  onChange: (dept) => setData("department_id", dept.id),
                  error: errors.department_id
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.department_id
                }
              )
            ] }) }),
            data.scope === "curriculum" && /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "courses.curriculum.search",
                  defaultOptions: curricula,
                  placeholder: "Search curricula...",
                  value: data.curricula_id,
                  onChange: (curr) => setData("curricula_id", curr.id),
                  error: errors.curricula_id
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.curricula_id })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Valid From", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    name: "valid_from",
                    value: data.valid_from,
                    onChange: handleChange,
                    error: errors.valid_from
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.valid_from })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Valid Until (Optional)" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    name: "valid_until",
                    value: data.valid_until,
                    onChange: handleChange,
                    error: errors.valid_until
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.valid_until }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Leave empty for no expiration date" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Active Fee Model",
                checked: data.is_active,
                onChange: (val) => setData("is_active", val)
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-6", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("fees.models.index"),
                className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50",
                children: processing ? "Updating..." : "Update Fee Model"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  Edit as default
};
