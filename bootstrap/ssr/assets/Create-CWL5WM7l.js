import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "axios";
import "react-dom/client";
import "react";
import "lucide-react";
import "react-toastify";
function deriveStudyProgress(moduleNumber) {
  const parsedModule = Number.parseInt(moduleNumber, 10);
  if (!Number.isInteger(parsedModule) || parsedModule < 1) {
    return {
      yearOfStudy: "",
      sessionNumber: ""
    };
  }
  return {
    yearOfStudy: Math.floor((parsedModule - 1) / 3) + 1,
    sessionNumber: (parsedModule - 1) % 3 + 1
  };
}
function Create({ activeSession }) {
  const { data, setData, post, processing, errors } = useForm({
    admission_number: "",
    active_session_id: activeSession?.id ?? "",
    module_number: ""
  });
  const studyProgress = deriveStudyProgress(data.module_number);
  const activeSessionNumber = activeSession?.session_number ?? null;
  const sessionMismatch = data.module_number !== "" && activeSessionNumber !== null && studyProgress.sessionNumber !== "" && studyProgress.sessionNumber !== activeSessionNumber;
  const submit = (e) => {
    e.preventDefault();
    post(route("students.session-enrollment.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Session Enrolment" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-5xl py-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[28px] border border-zinc-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-zinc-100 px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Enrol Student To Session" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route(
              "students.session-enrollment-status.create"
            ),
            className: "inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "Change Student Status"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 px-8 py-8", children: [
        errors.session_registration ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: errors.session_registration }) : null,
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "active_session_id",
            value: data.active_session_id
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "year_of_study",
            value: studyProgress.yearOfStudy
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "session_number",
            value: studyProgress.sessionNumber
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Admission Number", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                required: true,
                name: "admission_number",
                value: data.admission_number,
                onChange: (e) => setData("admission_number", e.target.value),
                error: errors.admission_number,
                placeholder: "TVET/2026/001"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.admission_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Module Number", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                required: true,
                type: "number",
                min: "1",
                name: "module_number",
                value: data.module_number,
                onChange: (e) => setData("module_number", e.target.value),
                error: errors.module_number,
                placeholder: "4"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.module_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Current Year - Current Session" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: activeSession?.name ?? "No active session",
                disabled: true,
                className: "text-zinc-500"
              }
            )
          ] })
        ] }),
        sessionMismatch ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: [
          "Module ",
          data.module_number,
          " maps to Session",
          " ",
          studyProgress.sessionNumber,
          ", but the active session is Session ",
          activeSessionNumber,
          "."
        ] }) : null,
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("academic.sessions.enrollments.index"),
              className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              disabled: processing || !activeSession || !data.admission_number.trim() || !data.module_number || sessionMismatch,
              children: processing ? "Enrolling..." : "Enroll Student"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
