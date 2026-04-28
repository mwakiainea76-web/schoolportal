import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-7Blz_WO8.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "lucide-react";
import "react-toastify";
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-amber-50 text-amber-700",
  graduated: "bg-blue-50 text-blue-700",
  dropped: "bg-red-50 text-red-700"
};
function StudentIndex({ students }) {
  const [searchTerm, setSearchTerm] = useState("");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("students.index"),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    router.delete(route("students.destroy", studentId), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Student Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("form", { className: "flex gap-2", onSubmit: submit, children: [
          /* @__PURE__ */ jsx(
            TextInput,
            {
              className: "w-full",
              placeholder: "Search by email or reg. number...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition",
              children: "Search"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("students.create"),
            className: "px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition",
            children: "+ Add Student"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: students, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Reg. No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Name" }),
          /* @__PURE__ */ jsx(THdata, { children: "Email" }),
          /* @__PURE__ */ jsx(THdata, { children: "Module" }),
          /* @__PURE__ */ jsx(THdata, { children: "Admission Date" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: students?.data?.length > 0 ? students.data.map((student) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { className: "font-mono text-xs", children: student.registration_number }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            student.user.last_name,
            " ",
            student.user.first_name
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: student.user.email }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            "Module ",
            student.current_module
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: student.admission_date }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 py-0.5 rounded-md text-xs font-medium capitalize
                                            ${STATUS_STYLES[student.student_status] ?? "bg-zinc-100 text-zinc-600"}`,
              children: student.student_status ?? "—"
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route(
                  "students.edit",
                  student.id
                ),
                className: "text-emerald-600 hover:underline text-sm",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(student.id),
                className: "text-red-500 hover:underline text-sm",
                children: "Delete"
              }
            )
          ] }) })
        ] }, student.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: "7",
            className: "text-center py-6 text-zinc-400",
            children: "No students found."
          }
        ) }) })
      ] })
    ] })
  ] });
}
export {
  StudentIndex as default
};
