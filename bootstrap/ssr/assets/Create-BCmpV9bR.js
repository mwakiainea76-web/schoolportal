import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { A as AuthenticatedLayout } from "../app.js";
import "react";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
function Create({ activeSession }) {
  const { data, setData, post, processing, errors } = useForm({
    registration_number: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.sessions.enrollments.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Enroll Student in Session" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-800", children: "Enroll Student in Academic Session" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "The system will automatically detect the current active session and calculate the student's module." })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "bg-white p-8 space-y-6 border rounded-lg shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  InputLabel,
                  {
                    value: "Student Registration Number",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    name: "registration_number",
                    value: data.registration_number,
                    onChange: (e) => setData(
                      "registration_number",
                      e.target.value
                    ),
                    placeholder: "e.g. STD/001/2026",
                    className: "mt-1 block w-full"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.registration_number })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Active Academic Session" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    value: activeSession ? activeSession.name : "No active session",
                    disabled: true,
                    className: "mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  }
                ),
                !activeSession && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: "No active session found. Please activate a session before enrolling." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("academic.sessions.enrollments.index"),
                  className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700 transition",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing || !activeSession,
                  className: "px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50",
                  children: processing ? "Enrolling..." : "Enroll Student"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  Create as default
};
