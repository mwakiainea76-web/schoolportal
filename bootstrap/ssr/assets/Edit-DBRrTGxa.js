import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { a as relation_type, e as employment_types, d as disability_types, r as religion, g as gender_types } from "./constants-F4k489nP.js";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
function FormSection({ number, title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "overflow-visible rounded-xl border border-zinc-200 p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-white", children: number }),
      /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-zinc-200 pt-5", children })
  ] });
}
function findOptionLabel(options, value) {
  if (value === null || value === void 0 || value === "") {
    return "";
  }
  return options.find(
    (option) => String(option.id) === String(value) || String(option.name) === String(value)
  )?.name || String(value);
}
function PersonalSection({ data, setData, errors, selectedLabels = {} }) {
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
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: gender_types, value: data.gender, selectedLabel: selectedLabels.gender, onChange: (g) => setData("gender", g.name), error: errors.gender }),
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
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: religion, value: data.religion, selectedLabel: selectedLabels.religion, onChange: (r) => setData("religion", r.name), error: errors.religion }),
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
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: disability_types, value: data.disability_type, selectedLabel: selectedLabels.disability_type, onChange: (d) => setData("disability_type", d.name), error: errors.disability_type }),
      /* @__PURE__ */ jsx(InputError, { message: errors.disability_type })
    ] }) : null
  ] });
}
function EmploymentSection({
  data,
  setData,
  errors,
  departments,
  roles,
  selectedLabels = {}
}) {
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
      /* @__PURE__ */ jsx(SearchSelect, { routeName: "departments.search", defaultOptions: departments, value: data.department_id, selectedLabel: selectedLabels.department, onChange: (d) => setData("department_id", d.id), error: errors.department_id }),
      /* @__PURE__ */ jsx(InputError, { message: errors.department_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Role", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { routeName: "roles.search", defaultOptions: roles, value: data.role_name, selectedLabel: selectedLabels.role, onChange: (r) => setData("role_name", r.name), error: errors.role_name }),
      /* @__PURE__ */ jsx(InputError, { message: errors.role_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Employment Type", required: true }),
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: employment_types, value: data.employment_type, selectedLabel: selectedLabels.employment_type, onChange: (e) => setData("employment_type", e.name), error: errors.employment_type }),
      /* @__PURE__ */ jsx(InputError, { message: errors.employment_type })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Date Hired", required: true }),
      /* @__PURE__ */ jsx(TextInput, { required: true, type: "date", name: "hired_date", value: data.hired_date, onChange: handleChange, error: errors.hired_date }),
      /* @__PURE__ */ jsx(InputError, { message: errors.hired_date })
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
function KinSection({ data, setData, errors, selectedLabels = {} }) {
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
      /* @__PURE__ */ jsx(SearchSelect, { defaultOptions: relation_type, value: data.kin_relationship, selectedLabel: selectedLabels.relationship, onChange: (r) => setData("kin_relationship", r.name), error: errors.kin_relationship }),
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
function EditStaff({ staff, departments, roles }) {
  const selectedLabels = {
    gender: findOptionLabel(gender_types, staff.gender),
    religion: findOptionLabel(religion, staff.religion),
    disability_type: findOptionLabel(
      disability_types,
      staff.disability_type
    ),
    department: staff.department?.name || departments.find(
      (department) => String(department.id) === String(staff.department_id)
    )?.name || "",
    role: staff.role_name || "",
    employment_type: findOptionLabel(
      employment_types,
      staff.employment_type
    ),
    relationship: findOptionLabel(
      relation_type,
      staff.next_of_kin?.[0]?.relationship || ""
    )
  };
  const { data, setData, put, processing, errors } = useForm({
    first_name: staff.first_name || "",
    last_name: staff.last_name || "",
    other_name: staff.other_name || "",
    email: staff.email || "",
    phone_number: staff.phone_number || "",
    gender: staff.gender || "",
    date_of_birth: staff.date_of_birth || "",
    county: staff.county || "",
    address: staff.address || "",
    religion: staff.religion || "",
    is_pwd: staff.is_pwd ?? false,
    disability_type: staff.disability_type || "",
    medical_condition: staff.medical_condition || "",
    profile_photo: null,
    department_id: staff.department_id || "",
    staff_number: staff.staff_number || "",
    role_name: staff.role_name || "",
    designation: staff.designation || "",
    national_id_number: staff.national_id_number || "",
    salary: staff.salary || "",
    employment_type: staff.employment_type || "",
    hired_date: staff.hired_date || "",
    highest_qualification: staff.highest_qualification || "",
    specialization: staff.specialization || "",
    kra_pin: staff.kra_pin || "",
    nhif_number: staff.nhif_number || "",
    nssf_number: staff.nssf_number || "",
    kin_first_name: staff.next_of_kin?.[0]?.first_name || "",
    kin_last_name: staff.next_of_kin?.[0]?.last_name || "",
    kin_relationship: staff.next_of_kin?.[0]?.relationship || "",
    kin_phone: staff.next_of_kin?.[0]?.phone_number || "",
    kin_alt_phone: staff.next_of_kin?.[0]?.alternate_phone_number || "",
    kin_email: staff.next_of_kin?.[0]?.email || ""
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("staffs.update", staff.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Staff" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl pt-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-visible rounded-xl border bg-white shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 p-0", children: [
      /* @__PURE__ */ jsx(FormSection, { number: "1", title: "Personal Details", children: /* @__PURE__ */ jsx(
        PersonalSection,
        {
          data,
          setData,
          errors,
          selectedLabels
        }
      ) }),
      /* @__PURE__ */ jsx(FormSection, { number: "2", title: "Employment Details", children: /* @__PURE__ */ jsx(
        EmploymentSection,
        {
          data,
          setData,
          errors,
          departments,
          roles,
          selectedLabels
        }
      ) }),
      /* @__PURE__ */ jsx(FormSection, { number: "3", title: "Next of Kin", children: /* @__PURE__ */ jsx(
        KinSection,
        {
          data,
          setData,
          errors,
          selectedLabels
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
              "Updating..."
            ] }) : "Update Staff"
          }
        )
      ] })
    ] }) }) }) })
  ] });
}
export {
  EditStaff as default
};
