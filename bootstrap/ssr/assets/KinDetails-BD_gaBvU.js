import { jsxs, jsx } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { a as relation_type } from "./constants-Cy-OTT5f.js";
import "react";
import "ziggy-js";
function KinStep({ data, setData, errors }) {
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "First Name" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kin_first_name",
          value: data.kin_first_name,
          onChange: handleChange,
          error: errors.kin_first_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_first_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Last Name" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kin_last_name",
          value: data.kin_last_name,
          onChange: handleChange,
          error: errors.kin_last_name
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_last_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Relationship" }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: relation_type,
          value: data.kin_relationship,
          onChange: (r) => setData("kin_relationship", r.name),
          error: errors.kin_relationship
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_relationship })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Phone" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kin_phone",
          value: data.kin_phone,
          onChange: handleChange,
          error: errors.kin_phone
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_phone })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Alternative Phone" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kin_alt_phone",
          value: data.kin_alt_phone,
          onChange: handleChange,
          error: errors.kin_alt_phone
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_alt_phone })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Email" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "kin_email",
          value: data.kin_email,
          onChange: handleChange,
          error: errors.kin_email
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.kin_email })
    ] })
  ] });
}
export {
  KinStep as default
};
