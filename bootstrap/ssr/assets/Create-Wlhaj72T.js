import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { useForm, Head } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import "react";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function Create({ academic_years }) {
  const { data, setData, post, processing, errors } = useForm({
    session_No: "",
    academic_year_id: "",
    start_date: "",
    end_date: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.sessions.store"));
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Academic session" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              value: data.academic_year_id,
              routeName: "academic-years.search",
              defaultOptions: academic_years,
              placeholder: "Search Academic Year...",
              onChange: (c) => setData("academic_year_id", c.id)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { children: "Session Number" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              value: data.session_No,
              onChange: (e) => setData("session_No", e.target.value),
              placeholder: "e.g. 1",
              error: errors.session_No
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
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
          /* @__PURE__ */ jsx(InputLabel, { children: "End Date" }),
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
      /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Create academic session" }) })
    ] }) }) })
  ] });
}
export {
  Create as default
};
