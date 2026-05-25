import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import "lucide-react";
import "react-toastify";
function BulkOperations({ enrollments, students }) {
  const [operation, setOperation] = useState("invoices");
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const invoiceForm = useForm({
    enrollment_ids: [],
    issue_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0]
  });
  const discountForm = useForm({
    student_ids: [],
    amount: "",
    description: "",
    type: "discount"
  });
  const handleBulkInvoices = async () => {
    if (selectedEnrollments.length === 0) {
      alert("Please select at least one enrollment");
      return;
    }
    setLoading(true);
    invoiceForm.setData("enrollment_ids", selectedEnrollments);
    try {
      const response = await fetch(route("billing.bulk.invoices"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
        },
        body: JSON.stringify(invoiceForm.data)
      });
      const result = await response.json();
      if (response.ok) {
        alert(
          `Successfully generated ${result.invoices_created} invoices. ${result.errors.length} errors occurred.`
        );
        setSelectedEnrollments([]);
        invoiceForm.reset();
      } else {
        alert("Error generating invoices");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating invoices");
    } finally {
      setLoading(false);
    }
  };
  const handleBulkDiscount = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }
    if (!discountForm.data.amount || parseFloat(discountForm.data.amount) <= 0) {
      alert("Please enter a valid discount amount");
      return;
    }
    setLoading(true);
    discountForm.setData("student_ids", selectedStudents);
    try {
      const response = await fetch(route("billing.bulk.discounts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
        },
        body: JSON.stringify(discountForm.data)
      });
      const result = await response.json();
      if (response.ok) {
        alert(
          `Successfully applied discounts to ${result.adjustments_created} invoices. ${result.errors.length} errors occurred.`
        );
        setSelectedStudents([]);
        discountForm.reset();
      } else {
        alert("Error applying discounts");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while applying discounts");
    } finally {
      setLoading(false);
    }
  };
  const toggleEnrollment = (id) => {
    setSelectedEnrollments(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const toggleStudent = (id) => {
    setSelectedStudents(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const selectAllEnrollments = () => {
    setSelectedEnrollments(enrollments.map((e) => e.id));
  };
  const selectAllStudents = () => {
    setSelectedStudents(students.map((s) => s.id));
  };
  const clearAllEnrollments = () => {
    setSelectedEnrollments([]);
  };
  const clearAllStudents = () => {
    setSelectedStudents([]);
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Bulk Operations" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Bulk Operations" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("billing.invoices.index"),
            className: "px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition",
            children: "Back to Invoices"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 mb-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setOperation("invoices"),
              className: `px-4 py-2 rounded-lg font-medium ${operation === "invoices" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
              children: "Bulk Generate Invoices"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setOperation("discounts"),
              className: `px-4 py-2 rounded-lg font-medium ${operation === "discounts" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
              children: "Bulk Apply Discounts"
            }
          )
        ] }),
        operation === "invoices" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: selectAllEnrollments,
                className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
                children: "Select All"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: clearAllEnrollments,
                className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
                children: "Clear All"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
              selectedEnrollments.length,
              " of",
              " ",
              enrollments.length,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Issue Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: invoiceForm.data.issue_date,
                  onChange: (e) => invoiceForm.setData(
                    "issue_date",
                    e.target.value
                  ),
                  className: "border border-zinc-200 px-3 py-2 rounded-lg w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Due Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: invoiceForm.data.due_date,
                  onChange: (e) => invoiceForm.setData(
                    "due_date",
                    e.target.value
                  ),
                  className: "border border-zinc-200 px-3 py-2 rounded-lg w-full"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto border border-zinc-200 rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedEnrollments.length === enrollments.length,
                  onChange: selectedEnrollments.length === enrollments.length ? clearAllEnrollments : selectAllEnrollments
                }
              ) }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Student" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Program" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Session" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-zinc-200", children: enrollments.map((enrollment) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedEnrollments.includes(
                    enrollment.id
                  ),
                  onChange: () => toggleEnrollment(
                    enrollment.id
                  )
                }
              ) }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: [
                enrollment.student?.registration_number,
                " ",
                "- ",
                enrollment.student?.name
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: enrollment.courseProgramVersion?.course?.name }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: enrollment.academicSession?.name })
            ] }, enrollment.id)) })
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBulkInvoices,
              disabled: loading || selectedEnrollments.length === 0,
              className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
              children: loading ? "Generating Invoices..." : `Generate ${selectedEnrollments.length} Invoices`
            }
          )
        ] }),
        operation === "discounts" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: selectAllStudents,
                className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
                children: "Select All"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: clearAllStudents,
                className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
                children: "Clear All"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
              selectedStudents.length,
              " of",
              " ",
              students.length,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Discount Amount" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: discountForm.data.amount,
                  onChange: (e) => discountForm.setData(
                    "amount",
                    e.target.value
                  ),
                  placeholder: "0.00",
                  className: "border border-zinc-200 px-3 py-2 rounded-lg w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: discountForm.data.type,
                  onChange: (e) => discountForm.setData(
                    "type",
                    e.target.value
                  ),
                  className: "border border-zinc-200 px-3 py-2 rounded-lg w-full",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "discount", children: "Discount" }),
                    /* @__PURE__ */ jsx("option", { value: "waiver", children: "Waiver" }),
                    /* @__PURE__ */ jsx("option", { value: "scholarship", children: "Scholarship" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: discountForm.data.description,
                  onChange: (e) => discountForm.setData(
                    "description",
                    e.target.value
                  ),
                  placeholder: "Reason for discount",
                  className: "border border-zinc-200 px-3 py-2 rounded-lg w-full"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto border border-zinc-200 rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedStudents.length === students.length,
                  onChange: selectedStudents.length === students.length ? clearAllStudents : selectAllStudents
                }
              ) }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Student ID" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider", children: "Department" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-zinc-200", children: students.map((student) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedStudents.includes(
                    student.id
                  ),
                  onChange: () => toggleStudent(
                    student.id
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: student.adm_no }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: student.name }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-900", children: student.department?.name })
            ] }, student.id)) })
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBulkDiscount,
              disabled: loading || selectedStudents.length === 0,
              className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
              children: loading ? "Applying Discounts..." : `Apply Discounts to ${selectedStudents.length} Students`
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  BulkOperations as default
};
