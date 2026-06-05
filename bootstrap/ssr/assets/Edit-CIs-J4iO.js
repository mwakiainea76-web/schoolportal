import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import axios from "axios";
import { A as AuthenticatedLayout } from "../app.js";
import PersonalStep from "./PersonalDetails-BPJhvTwg.js";
import EmploymentStep from "./EmploymentDetails-BJHnNYce.js";
import KinStep from "./KinDetails-BWYD1zJe.js";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "./TextInput-DsoSnibl.js";
import "./InputLabel-DlDnrkJG.js";
import "./InputError-CBvD_6aD.js";
import "./SearchSelect-8eQtXAlf.js";
import "ziggy-js";
import "./ToggleSwitch-Dmb9fkxK.js";
import "./constants-Cy-OTT5f.js";
const STEP_LABELS = ["Personal", "Employment", "Next of kin"];
const STEP_HEADERS = [
  "Personal details",
  "Employment details",
  "Next of kin details"
];
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
    "department_id",
    "staff_number",
    "role_name",
    "designation",
    "national_id_number",
    "salary",
    "employment_type",
    "hired_date",
    "staff_status",
    "highest_qualification",
    "specialization",
    "kra_pin",
    "nhif_number",
    "nssf_number"
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
function EditStaff({ staff, departments, roles }) {
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [validating, setValidating] = useState(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    first_name: staff.user?.first_name || "",
    last_name: staff.user?.last_name || "",
    other_name: staff.user?.other_name || "",
    email: staff.user?.email || "",
    phone_number: staff.user?.phone_number || "",
    gender: staff.user?.gender || "",
    date_of_birth: staff.user?.date_of_birth || "",
    county: staff.user?.county || "",
    address: staff.user?.address || "",
    religion: staff.user?.religion || "",
    profile_photo: null,
    department_id: staff.department_id || "",
    staff_number: staff.staff_number || "",
    role_name: staff.user?.roles?.[0]?.name || "",
    designation: staff.designation || "",
    national_id_number: staff.national_id_number || "",
    salary: staff.salary || "",
    employment_type: staff.employment_type || "",
    hired_date: staff.hired_date || "",
    staff_status: staff.staff_status || "",
    highest_qualification: staff.highest_qualification || "",
    specialization: staff.specialization || "",
    kra_pin: staff.kra_pin || "",
    nhif_number: staff.nhif_number || "",
    nssf_number: staff.nssf_number || "",
    kin_first_name: staff.user?.nextofkin?.first_name || "",
    kin_last_name: staff.user?.nextofkin?.last_name || "",
    kin_relationship: staff.user?.nextofkin?.relationship || "",
    kin_phone: staff.user?.nextofkin?.phone_number || "",
    kin_alt_phone: staff.user?.nextofkin?.alternate_phone_number || "",
    kin_email: staff.user?.nextofkin?.email || "",
    is_pwd: staff.user?.is_pwd ?? false,
    disability_type: staff.user?.disability_type || "",
    medical_condition: staff.user?.medical_condition || ""
  });
  const allErrors = { ...errors, ...stepErrors };
  const nextStep = async () => {
    setStepErrors({});
    setValidating(true);
    const payload = { step };
    STEP_FIELDS[step].forEach((field) => {
      payload[field] = data[field];
    });
    payload._staff_id = staff.id;
    try {
      await axios.post(route("staffs.validateStep"), payload);
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
    put(route("staffs.update", staff.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Staff" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl shadow-inner pt-2", children: [
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
        /* @__PURE__ */ jsx("div", { className: "bg-slate-400 text-white text-center py-2 text-sm font-medium", children: STEP_HEADERS[step - 1] }),
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
            EmploymentStep,
            {
              data,
              setData,
              errors: allErrors,
              departments,
              roles
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
                href: route("staffs.index"),
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
                ] }) : "Update staff"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  EditStaff as default
};
