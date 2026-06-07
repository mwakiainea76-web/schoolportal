import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import AcademicCalendarWorkspaceTabs from "./AcademicCalendarWorkspaceTabs-BIDzA_tP.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-700",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-gray-100 text-gray-600"
};
function Edit({ enrollment, statuses }) {
  const { data, setData, patch, processing, errors } = useForm({
    status: enrollment.status
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("academic.sessions.enrollments.update", enrollment.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Enrollment" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-5xl space-y-6", children: [
      /* @__PURE__ */ jsx(
        AcademicCalendarWorkspaceTabs,
        {
          activeTab: "edit-enrollment",
          enrollmentId: enrollment.id
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-800", children: "Edit Enrollment" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Update the status for this student's session enrollment." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-lg shadow-sm p-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Student" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: enrollment.student_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Admission Number" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: enrollment.admission_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic Session" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: enrollment.session })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Year Of Study" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: [
              "Year ",
              enrollment.year_of_study
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Module" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: [
              "Module ",
              enrollment.module
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: enrollment.curriculum })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Course" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700", children: enrollment.course })
          ] })
        ] }),
        /* @__PURE__ */ jsx("hr", {}),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Status", required: true }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: statuses.map((s) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("status", s),
                className: `px-4 py-1.5 rounded-full text-sm font-medium border transition ${data.status === s ? `${STATUS_STYLES[s]} border-transparent ring-2 ring-offset-1 ring-current` : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"}`,
                children: s.charAt(0).toUpperCase() + s.slice(1)
              },
              s
            )) }),
            /* @__PURE__ */ jsx(InputError, { message: errors.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "academic.sessions.enrollments.index"
                ),
                className: "px-4 py-2 bg-slate-400 text-white text-sm rounded hover:bg-slate-700 transition",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-6 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition disabled:opacity-50",
                children: processing ? "Saving..." : "Save Changes"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Edit as default
};
