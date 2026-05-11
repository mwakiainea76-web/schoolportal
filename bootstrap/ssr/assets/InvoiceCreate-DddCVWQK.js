import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function InvoiceCreate({ students, enrollments }) {
  const { data, setData, post, processing, errors } = useForm({
    student_id: "",
    enrollment_id: "",
    issue_date: "",
    due_date: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("billing.invoices.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Invoice" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow border p-8 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Create Invoice" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Student" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "students.search",
              defaultOptions: students,
              onChange: (item) => setData("student_id", item.id)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.student_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Enrollment" }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "enrollments.search",
              defaultOptions: enrollments,
              onChange: (item) => setData("enrollment_id", item.id)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.enrollment_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Issue Date" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "date",
              value: data.issue_date,
              onChange: (e) => setData("issue_date", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.issue_date })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Due Date" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "date",
              value: data.due_date,
              onChange: (e) => setData("due_date", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.due_date })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.invoices.index"),
              className: "px-4 py-2 bg-slate-400 text-white rounded",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing,
              className: "px-4 py-2 bg-emerald-600 text-white rounded",
              children: processing ? "Saving..." : "Create Invoice"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  InvoiceCreate as default
};
