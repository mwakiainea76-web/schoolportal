import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import "ziggy-js";
const Edit = ({ department, selectedHod = null }) => {
  const dept = department || null;
  const hasInitialized = useRef(false);
  const { data, setData, put, processing, errors } = useForm({
    code: "",
    name: "",
    hod_staff_number: "",
    description: ""
  });
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!department) {
      setData({
        code: "",
        name: "",
        hod_staff_number: "",
        description: ""
      });
      return;
    }
    setData({
      code: department.code ?? "",
      name: department.name ?? "",
      hod_staff_number: selectedHod?.staff_number ?? "",
      description: department.description ?? ""
    });
    hasInitialized.current = true;
  }, [department]);
  const submit = (e) => {
    e.preventDefault();
    if (!dept) return;
    put(route("departments.update", dept.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Department" }),
    /* @__PURE__ */ jsx("div", { className: " mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border shadow overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: "Edit department details" }),
      /* @__PURE__ */ jsxs("form", { className: "w-full p-10 space-y-8", onSubmit: submit, children: [
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
                value: "Department Name"
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
            /* @__PURE__ */ jsx(InputLabel, { value: "Head of Department" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                value: data.hod_staff_number,
                selectedLabel: selectedHod?.name,
                defaultOptions: selectedHod ? [
                  {
                    ...selectedHod,
                    id: selectedHod.staff_number
                  }
                ] : [],
                routeName: "staffs.search",
                routeParams: { limit: 10 },
                placeholder: "Search staff by name, staff number, email...",
                minSearchLength: 1,
                preloadOptions: true,
                error: errors.hod_staff_number,
                onChange: (staff) => setData(
                  "hod_staff_number",
                  staff?.staff_number || staff?.id || ""
                )
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.hod_staff_number })
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
              disabled: processing || !dept,
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
    ] }) })
  ] });
};
export {
  Edit as default
};
