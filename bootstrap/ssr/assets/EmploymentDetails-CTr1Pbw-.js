import { jsxs, jsx } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { e as employment_types } from "./constants-ebifoBpv.js";
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
      /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          required: true,
          name: "staff_number",
          value: data.staff_number,
          onChange: handleChange,
          error: errors.staff_number
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
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
    ] })
  ] });
}
export {
  EmploymentStep as default
};
