import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-CYfv_03l.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { g as gender_types, r as religion, d as disability_types, e as employment_types, s as staff_status, a as relation_type } from "./constants-Cy-OTT5f.js";
import "ziggy-js";
const STORAGE_KEY = "staff_form_draft";
function FormSection({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "overflow-visible rounded-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-zinc-200 px-5 py-3 text-center", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-zinc-800", children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4", children })
  ] });
}
function PersonalSection({ data, setData, errors }) {
  const handleChange = (e) => setData(e.target.name, e.target.value);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "First Name", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "first_name", value: data.first_name, onChange: handleChange, error: errors.first_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.first_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Last Name", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "last_name", value: data.last_name, onChange: handleChange, error: errors.last_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.last_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Other Name" }),
      /* @__PURE__ */ jsx(TextInput, { name: "other_name", value: data.other_name, onChange: handleChange, error: errors.other_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.other_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Email", required: true }),
      /* @__PURE__ */ jsx(TextInput, { type: "email", name: "email", value: data.email, onChange: handleChange, error: errors.email }),
      /* @__PURE__ */ jsx(InputError, { message: errors.email })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Phone Number", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "phone_number", value: data.phone_number, onChange: handleChange, error: errors.phone_number }),
      /* @__PURE__ */ jsx(InputError, { message: errors.phone_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Gender", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: gender_types, value: data.gender, onChange: (g) => setData("gender", g.name), error: errors.gender }),
      /* @__PURE__ */ jsx(InputError, { message: errors.gender })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Date of Birth", required: true }),
      /* @__PURE__ */ jsx(TextInput, { type: "date", name: "date_of_birth", value: data.date_of_birth, onChange: handleChange, error: errors.date_of_birth }),
      /* @__PURE__ */ jsx(InputError, { message: errors.date_of_birth })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "County", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "county", value: data.county, onChange: handleChange, error: errors.county }),
      /* @__PURE__ */ jsx(InputError, { message: errors.county })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Address", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "address", value: data.address, onChange: handleChange, error: errors.address }),
      /* @__PURE__ */ jsx(InputError, { message: errors.address })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Religion", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: religion, value: data.religion, onChange: (r) => setData("religion", r.name), error: errors.religion }),
      /* @__PURE__ */ jsx(InputError, { message: errors.religion })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Any medical condition" }),
      /* @__PURE__ */ jsx(TextInput, { name: "medical_condition", value: data.medical_condition, onChange: handleChange, error: errors.medical_condition }),
      /* @__PURE__ */ jsx(InputError, { message: errors.medical_condition })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsx(ToggleSwitch, { label: "Person with disability", checked: data.is_pwd, onChange: (v) => setData("is_pwd", v) }) }),
    data.is_pwd ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Disability Type" }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: disability_types, value: data.disability_type, onChange: (d) => setData("disability_type", d.name), error: errors.disability_type }),
      /* @__PURE__ */ jsx(InputError, { message: errors.disability_type })
    ] }) : null
  ] });
}
function EmploymentSection({ data, setData, errors, departments, roles }) {
  const handleChange = (e) => setData(e.target.name, e.target.value);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number" }),
      /* @__PURE__ */ jsx(TextInput, { name: "staff_number", value: data.staff_number, onChange: handleChange, error: errors.staff_number, disabled: true, placeholder: "Auto-generated on save" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Designation / Job Title", required: true }),
      /* @__PURE__ */ jsx(TextInput, { required: true, name: "designation", value: data.designation, onChange: handleChange, error: errors.designation, placeholder: "e.g. Lecturer, Registrar, Accountant" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.designation })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "National ID / Passport No.", required: true }),
      /* @__PURE__ */ jsx(TextInput, { required: true, name: "national_id_number", value: data.national_id_number, onChange: handleChange, error: errors.national_id_number, placeholder: "e.g. 12345678" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.national_id_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Salary" }),
      /* @__PURE__ */ jsx(TextInput, { type: "number", name: "salary", value: data.salary, onChange: handleChange, error: errors.salary }),
      /* @__PURE__ */ jsx(InputError, { message: errors.salary })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Department", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { routeName: "departments.search", defaultOptions: departments, value: data.department_id, onChange: (d) => setData("department_id", d.id), error: errors.department_id }),
      /* @__PURE__ */ jsx(InputError, { message: errors.department_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Role", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { routeName: "roles.search", defaultOptions: roles, value: data.role_name, onChange: (r) => setData("role_name", r.name), error: errors.role_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.role_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Employment Type", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: employment_types, value: data.employment_type, onChange: (e) => setData("employment_type", e.name), error: errors.employment_type }),
      /* @__PURE__ */ jsx(InputError, { message: errors.employment_type })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Date Hired", required: true }),
      /* @__PURE__ */ jsx(TextInput, { required: true, type: "date", name: "hired_date", value: data.hired_date, onChange: handleChange, error: errors.hired_date }),
      /* @__PURE__ */ jsx(InputError, { message: errors.hired_date })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Staff Status", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: staff_status, value: data.staff_status, onChange: (s) => setData("staff_status", s.name.trim()), error: errors.staff_status }),
      /* @__PURE__ */ jsx(InputError, { message: errors.staff_status })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Highest Qualification", required: true }),
      /* @__PURE__ */ jsx(TextInput, { required: true, name: "highest_qualification", value: data.highest_qualification, onChange: handleChange, error: errors.highest_qualification, placeholder: "e.g. Masters in Education" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.highest_qualification })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Specialization" }),
      /* @__PURE__ */ jsx(TextInput, { name: "specialization", value: data.specialization, onChange: handleChange, error: errors.specialization, placeholder: "e.g. Mathematics, HR, Procurement" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.specialization })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "KRA PIN" }),
      /* @__PURE__ */ jsx(TextInput, { name: "kra_pin", value: data.kra_pin, onChange: handleChange, error: errors.kra_pin, placeholder: "e.g. A123456789X" }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kra_pin })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "NHIF Number" }),
      /* @__PURE__ */ jsx(TextInput, { name: "nhif_number", value: data.nhif_number, onChange: handleChange, error: errors.nhif_number }),
      /* @__PURE__ */ jsx(InputError, { message: errors.nhif_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "NSSF Number" }),
      /* @__PURE__ */ jsx(TextInput, { name: "nssf_number", value: data.nssf_number, onChange: handleChange, error: errors.nssf_number }),
      /* @__PURE__ */ jsx(InputError, { message: errors.nssf_number })
    ] })
  ] });
}
function KinSection({ data, setData, errors }) {
  const handleChange = (e) => setData(e.target.name, e.target.value);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "First Name", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "kin_first_name", value: data.kin_first_name, onChange: handleChange, error: errors.kin_first_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_first_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Last Name", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "kin_last_name", value: data.kin_last_name, onChange: handleChange, error: errors.kin_last_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_last_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Relationship", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: relation_type, value: data.kin_relationship, onChange: (r) => setData("kin_relationship", r.name), error: errors.kin_relationship }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_relationship })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Phone", required: true }),
      /* @__PURE__ */ jsx(TextInput, { name: "kin_phone", value: data.kin_phone, onChange: handleChange, error: errors.kin_phone }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_phone })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Alternative Phone" }),
      /* @__PURE__ */ jsx(TextInput, { name: "kin_alt_phone", value: data.kin_alt_phone, onChange: handleChange, error: errors.kin_alt_phone }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_alt_phone })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Email" }),
      /* @__PURE__ */ jsx(TextInput, { name: "kin_email", value: data.kin_email, onChange: handleChange, error: errors.kin_email }),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_email })
    ] })
  ] });
}
function CreateStaff({ departments, roles }) {
  const { data, setData, post, processing, errors, reset } = useForm({
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
    department_id: "",
    staff_number: "",
    role_name: "",
    designation: "",
    national_id_number: "",
    salary: "",
    employment_type: "",
    hired_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    staff_status: "active",
    highest_qualification: "",
    specialization: "",
    kra_pin: "",
    nhif_number: "",
    nssf_number: "",
    kin_first_name: "",
    kin_last_name: "",
    kin_relationship: "",
    kin_phone: "",
    kin_alt_phone: "",
    kin_email: "",
    is_pwd: false,
    disability_type: "",
    medical_condition: ""
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }
    try {
      Object.entries(JSON.parse(saved)).forEach(
        ([key, value]) => setData(key, value)
      );
    } catch (_) {
    }
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("staffs.store"), {
      onSuccess: () => {
        localStorage.removeItem(STORAGE_KEY);
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Staff Onboarding" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl pt-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border bg-white shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 p-0", children: [
      /* @__PURE__ */ jsx(FormSection, { title: "Personal Details", children: /* @__PURE__ */ jsx(
        PersonalSection,
        {
          data,
          setData,
          errors
        }
      ) }),
      /* @__PURE__ */ jsx(FormSection, { title: "Employment Details", children: /* @__PURE__ */ jsx(
        EmploymentSection,
        {
          data,
          setData,
          errors,
          departments,
          roles
        }
      ) }),
      /* @__PURE__ */ jsx(FormSection, { title: "Next of Kin", children: /* @__PURE__ */ jsx(
        KinSection,
        {
          data,
          setData,
          errors
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between px-4 pb-4 pt-0", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("staffs.index"),
            className: "rounded-lg bg-zinc-400 px-5 py-2 text-sm text-white transition hover:bg-zinc-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white border-t-transparent" }),
              "Saving..."
            ] }) : "Submit"
          }
        )
      ] })
    ] }) }) }) })
  ] });
}
export {
  CreateStaff as default
};
