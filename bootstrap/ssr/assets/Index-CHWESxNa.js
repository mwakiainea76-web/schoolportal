import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function Index({ courseEnrollments }) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Program Enrollments" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto w-full", children: /* @__PURE__ */ jsxs(DirectoryTable, { pagination: courseEnrollments, children: [
      /* @__PURE__ */ jsxs(Thead, { children: [
        /* @__PURE__ */ jsx(THdata, { children: "Student" }),
        /* @__PURE__ */ jsx(THdata, { children: "Reg No" }),
        /* @__PURE__ */ jsx(THdata, { children: "Program" }),
        /* @__PURE__ */ jsx(THdata, { children: "Program Version" }),
        /* @__PURE__ */ jsx(THdata, { children: "Admitted" })
      ] }),
      /* @__PURE__ */ jsx(TBody, { children: courseEnrollments?.data?.length ? courseEnrollments.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
        /* @__PURE__ */ jsxs(Tdata, { children: [
          item.student?.user?.first_name,
          " ",
          item.student?.user?.last_name
        ] }),
        /* @__PURE__ */ jsx(Tdata, { children: item.student?.registration_number }),
        /* @__PURE__ */ jsx(Tdata, { children: item.program_version_mapping?.program?.name ?? item.course_curriculum?.course?.name ?? "-" }),
        /* @__PURE__ */ jsx(Tdata, { children: item.program_version_mapping?.program_version?.name ?? item.course_curriculum?.curriculum?.name ?? "-" }),
        /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.created_at) })
      ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "5", className: "text-center py-6", children: "No program enrollments found." }) }) })
    ] }) })
  ] });
}
export {
  Index as default
};
