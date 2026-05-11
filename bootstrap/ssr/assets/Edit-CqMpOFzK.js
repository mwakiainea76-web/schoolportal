import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import "lucide-react";
import "react-toastify";
const Edit = ({ curriculum }) => {
  const c = curriculum;
  const formatDateForInput = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      return value.slice(0, 10);
    }
    return "";
  };
  const { data, setData, put, processing, errors } = useForm({
    name: c?.name || "",
    description: c?.description || "",
    start_date: formatDateForInput(c?.start_date),
    end_date: formatDateForInput(c?.end_date),
    is_active: !!c?.is_active
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("curriculum.update", c.id), {
      preserveState: true,
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculum" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("legend", { className: "text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit curriculum details" }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-10 space-y-6 border rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum Name", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    error: errors.name
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { children: "Start Date" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    value: data.start_date,
                    onChange: (e) => setData("start_date", e.target.value),
                    error: errors.start_date
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.start_date })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "End Date" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    value: data.end_date,
                    onChange: (e) => setData("end_date", e.target.value),
                    error: errors.end_date
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.end_date })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                ToggleSwitch,
                {
                  label: "Set as active curriculum",
                  checked: data.is_active,
                  onChange: (checked) => setData("is_active", checked),
                  error: errors.is_active
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.is_active })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  value: data.description,
                  onChange: (e) => setData("description", e.target.value),
                  error: errors.description
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("curriculum.index"),
                  className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  disabled: processing || !c,
                  type: "submit",
                  className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    "Saving",
                    /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
                  ] }) : "Save"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
};
export {
  Edit as default
};
