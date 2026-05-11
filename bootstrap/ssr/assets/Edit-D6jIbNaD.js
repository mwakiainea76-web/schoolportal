import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import axios from "axios";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import PersonalStep from "./PersonalDetails-BYnVyVD_.js";
import AcademicStep from "./AcademicDetails-DImZFRj5.js";
import KinStep from "./KinDetails-DHpDSKE8.js";
import "lucide-react";
import "react-toastify";
import "./TextInput-DsoSnibl.js";
import "./InputLabel-DlDnrkJG.js";
import "./InputError-CBvD_6aD.js";
import "./SearchSelect-Bxy39qA_.js";
import "ziggy-js";
import "./ToggleSwitch-Dmb9fkxK.js";
import "./constants-ebifoBpv.js";
const STEP_LABELS = ["Personal", "Academic", "Next of Kin"];
const STEP_FIELDS = {
  1: [
    "first_name",
    "last_name",
    "other_name",
    "email",
    "phone_number",
    "gender",
    "date_of_birth",
    "county",
    "address",
    "religion",
    "is_pwd",
    "disability_type",
    "medical_condition"
  ],
  2: [
    "previous_school",
    "admission_date",
    "current_module",
    "fee_discount_percentage",
    "student_status"
  ],
  3: [
    "kin_first_name",
    "kin_last_name",
    "kin_relationship",
    "kin_phone",
    "kin_alt_phone",
    "kin_email"
  ]
};
function EditStudent({ student }) {
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [validating, setValidating] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    // Personal
    first_name: student.user?.first_name || "",
    last_name: student.user?.last_name || "",
    other_name: student.user?.other_name || "",
    email: student.user?.email || "",
    phone_number: student.user?.phone_number || "",
    gender: student.user?.gender || "",
    date_of_birth: student.user?.date_of_birth || "",
    county: student.user?.county || "",
    address: student.user?.address || "",
    religion: student.user?.religion || "",
    is_pwd: student.user?.is_pwd ?? false,
    disability_type: student.user?.disability_type || "",
    medical_condition: student.user?.medical_condition || "",
    // Academic
    previous_school: student.previous_school || "",
    admission_date: student.admission_date || "",
    current_module: student.current_module || "",
    fee_discount_percentage: student.fee_discount_percentage || "",
    student_status: student.student_status || "active",
    // Kin
    kin_first_name: student.user?.nextofkin?.first_name || "",
    kin_last_name: student.user?.nextofkin?.last_name || "",
    kin_relationship: student.user?.nextofkin?.relationship || "",
    kin_phone: student.user?.nextofkin?.phone_number || "",
    kin_alt_phone: student.user?.nextofkin?.alternate_phone_number || "",
    kin_email: student.user?.nextofkin?.email || ""
  });
  const allErrors = { ...errors, ...stepErrors };
  const nextStep = async () => {
    setStepErrors({});
    setValidating(true);
    const payload = { step, _student_id: student.id };
    STEP_FIELDS[step].forEach((field) => {
      payload[field] = data[field];
    });
    try {
      await axios.post(route("students.validateStep"), payload);
      setStep((s) => Math.min(s + 1, 3));
    } catch (err) {
      if (err.response?.status === 422) {
        setStepErrors(err.response.data.errors ?? {});
      }
    } finally {
      setValidating(false);
    }
  };
  const prevStep = () => {
    setStepErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("students.update", student.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Student" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl pt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mb-4", children: STEP_LABELS.map((label, i) => {
        const s = i + 1;
        const done = s < step;
        const current = s === step;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                                        ${done ? "bg-emerald-500 text-white" : current ? "bg-emerald-600 text-white ring-2 ring-emerald-300" : "bg-zinc-200 text-zinc-500"}`,
                  children: done ? "✓" : s
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-xs hidden sm:block
                                        ${current ? "text-emerald-700 font-medium" : "text-zinc-400"}`,
                  children: label
                }
              )
            ]
          },
          s
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: [
          STEP_LABELS[step - 1],
          " Details"
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 p-6", children: [
          step === 1 && /* @__PURE__ */ jsx(
            PersonalStep,
            {
              data,
              setData,
              errors: allErrors
            }
          ),
          step === 2 && /* @__PURE__ */ jsx(
            AcademicStep,
            {
              data,
              setData,
              errors: allErrors,
              isEdit: true
            }
          ),
          step === 3 && /* @__PURE__ */ jsx(
            KinStep,
            {
              data,
              setData,
              errors: allErrors
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
            step === 1 ? /* @__PURE__ */ jsx(
              Link,
              {
                href: route("students.index"),
                className: "px-5 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition text-sm",
                children: "Cancel"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: prevStep,
                className: "px-5 py-2 bg-zinc-200 rounded-lg hover:bg-zinc-300 transition text-sm",
                children: "← Back"
              }
            ),
            step < 3 ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: nextStep,
                disabled: validating,
                className: "px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition text-sm flex items-center gap-2",
                children: validating ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" }),
                  "Checking..."
                ] }) : "Next →"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition text-sm flex items-center gap-2",
                children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" }),
                  "Updating..."
                ] }) : "Update"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  EditStudent as default
};
