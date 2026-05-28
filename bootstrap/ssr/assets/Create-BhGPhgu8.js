import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import axios from "axios";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import PersonalStep from "./PersonalDetails-CGVroBOk.js";
import AcademicStep from "./AcademicDetails-SQZM3Fcg.js";
import KinStep from "./KinDetails-CgidCCdh.js";
import "lucide-react";
import "react-toastify";
import "./TextInput-DsoSnibl.js";
import "./InputLabel-DlDnrkJG.js";
import "./InputError-CBvD_6aD.js";
import "./SearchSelect-Bxy39qA_.js";
import "ziggy-js";
import "./ToggleSwitch-Dmb9fkxK.js";
import "./constants-Cy-OTT5f.js";
const STORAGE_KEY = "student_form_draft";
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
    "course_curriculum_id",
    "current_module",
    "fee_discount_percentage"
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
function CreateStudent({ courseCurricula }) {
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [validating, setValidating] = useState(false);
  const hasProgramVersionMappings = courseCurricula.length > 0;
  const { data, setData, post, processing, errors, reset } = useForm({
    // Personal
    first_name: "",
    last_name: "",
    other_name: "",
    email: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
    county: "",
    address: "",
    religion: "",
    is_pwd: false,
    disability_type: "",
    medical_condition: "",
    // Academic
    previous_school: "",
    course_curriculum_id: "",
    current_module: "",
    fee_discount_percentage: "",
    // Kin
    kin_first_name: "",
    kin_last_name: "",
    kin_relationship: "",
    kin_phone: "",
    kin_alt_phone: "",
    kin_email: ""
  });
  const allErrors = { ...errors, ...stepErrors };
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        Object.entries(JSON.parse(saved)).forEach(
          ([k, v]) => setData(k, v)
        );
      } catch (_) {
      }
    }
  }, []);
  const nextStep = async () => {
    setStepErrors({});
    setValidating(true);
    const payload = { step };
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
    post(route("students.store"), {
      onSuccess: () => {
        localStorage.removeItem(STORAGE_KEY);
        reset();
        setStep(1);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Student Admission" }),
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
              courseCurricula,
              setData,
              errors: allErrors
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
                disabled: validating || step === 2 && !hasProgramVersionMappings,
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
                  "Saving..."
                ] }) : "Submit"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CreateStudent as default
};
