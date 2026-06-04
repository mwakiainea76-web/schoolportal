import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { useForm, Head } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Create({ academic_year, session_no, prerequisite_error }) {
  const { post, processing, errors } = useForm({
    session_No: session_no,
    academic_year_id: academic_year?.id
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.sessions.store"));
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Academic session" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Create new academic session" }),
      /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        prerequisite_error ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: prerequisite_error }) : null,
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "cursor-not-allowed bg-slate-100",
                value: academic_year?.academic_year ?? "No active academic year",
                disabled: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Session no." }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "cursor-not-allowed bg-slate-100",
                value: session_no,
                disabled: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing || !academic_year, children: "Create academic session" }) })
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
