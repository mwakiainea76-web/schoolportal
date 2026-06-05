import { jsx, jsxs } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-DbLPTvUh.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import { g as gender_types, r as religion, d as disability_types } from "./constants-Cy-OTT5f.js";
import React from "react";
import "ziggy-js";
function PersonalStep({ data, setData, errors }) {
  const handleChange = (e) => {
    const key = e.target.name;
    setData(key, e.target.value);
  };
  return /* @__PURE__ */ jsx(React.Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "First Name", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "first_name",
          value: data.first_name,
          onChange: handleChange,
          error: errors.first_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.first_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Last Name", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "last_name",
          value: data.last_name,
          onChange: handleChange,
          error: errors.last_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.last_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Other Name" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "other_name",
          value: data.other_name,
          onChange: handleChange,
          error: errors.other_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.other_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Email", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "email",
          name: "email",
          value: data.email,
          onChange: handleChange,
          error: errors.email
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.email })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Phone Number", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "phone_number",
          value: data.phone_number,
          onChange: handleChange,
          error: errors.phone_number
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.phone_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Gender", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: gender_types,
          value: data.gender,
          onChange: (g) => setData("gender", g.name),
          error: errors.gender
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.gender })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Date of Birth", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "date",
          name: "date_of_birth",
          value: data.date_of_birth,
          onChange: handleChange,
          error: errors.date_of_birth
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.date_of_birth })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "County", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "county",
          value: data.county,
          onChange: handleChange,
          error: errors.county
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.county })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Address", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "address",
          value: data.address,
          onChange: handleChange,
          error: errors.address
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.address })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Religion", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: religion,
          value: data.religion,
          onChange: (r) => setData("religion", r.name),
          error: errors.religion
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.religion })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Any medical condition" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "medical_condition",
          value: data.medical_condition,
          onChange: handleChange,
          error: errors.medical_condition
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.medical_condition })
    ] }),
    /* @__PURE__ */ jsx(
      ToggleSwitch,
      {
        label: "Person with disability",
        checked: data.is_pwd,
        onChange: (v) => setData("is_pwd", v)
      }
    ),
    data.is_pwd && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Disability Type" }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: disability_types,
          value: data.disability_type,
          onChange: (d) => setData("disability_type", d.name),
          error: errors.disability_type
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.disability_type })
    ] })
  ] }) });
}
export {
  PersonalStep as default
};
