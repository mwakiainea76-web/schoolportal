import { jsxs, jsx } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import { e as employment_types, s as staff_status } from "./constants-Cy-OTT5f.js";
import "react";
import "ziggy-js";
function EmploymentStep({
  data,
  setData,
  errors,
  departments,
  roles
}) {
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "staff_number",
          value: data.staff_number,
          onChange: handleChange,
          error: errors.staff_number,
          disabled: true,
          placeholder: "Auto-generated on save"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Designation / Job Title", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          required: true,
          name: "designation",
          value: data.designation,
          onChange: handleChange,
          error: errors.designation,
          placeholder: "e.g. Lecturer, Registrar, Accountant"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.designation })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "National ID / Passport No.", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          required: true,
          name: "national_id_number",
          value: data.national_id_number,
          onChange: handleChange,
          error: errors.national_id_number,
          placeholder: "e.g. 12345678"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.national_id_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Salary" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "number",
          name: "salary",
          value: data.salary,
          onChange: handleChange,
          error: errors.salary
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.salary })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Department", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "departments.search",
          defaultOptions: departments,
          value: data.department_id,
          onChange: (d) => setData("department_id", d.id),
          error: errors.department_id
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.department_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Role", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "roles.search",
          defaultOptions: roles,
          value: data.role_name,
          onChange: (r) => setData("role_name", r.name),
          error: errors.role_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.role_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Employment Type", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: employment_types,
          value: data.employment_type,
          onChange: (e) => setData("employment_type", e.name),
          error: errors.employment_type
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.employment_type })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Date Hired", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          required: true,
          type: "date",
          name: "hired_date",
          value: data.hired_date,
          onChange: handleChange,
          error: errors.hired_date
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.hired_date })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Staff Status", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: staff_status,
          value: data.staff_status,
          onChange: (s) => setData("staff_status", s.name.trim()),
          error: errors.staff_status
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.staff_status })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Highest Qualification", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          required: true,
          name: "highest_qualification",
          value: data.highest_qualification,
          onChange: handleChange,
          error: errors.highest_qualification,
          placeholder: "e.g. Masters in Education"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.highest_qualification })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Specialization" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "specialization",
          value: data.specialization,
          onChange: handleChange,
          error: errors.specialization,
          placeholder: "e.g. Mathematics, HR, Procurement"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.specialization })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "KRA PIN" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kra_pin",
          value: data.kra_pin,
          onChange: handleChange,
          error: errors.kra_pin,
          placeholder: "e.g. A123456789X"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kra_pin })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "NHIF Number" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "nhif_number",
          value: data.nhif_number,
          onChange: handleChange,
          error: errors.nhif_number
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.nhif_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "NSSF Number" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "nssf_number",
          value: data.nssf_number,
          onChange: handleChange,
          error: errors.nssf_number
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.nssf_number })
    ] })
  ] });
}
export {
  EmploymentStep as default
};
