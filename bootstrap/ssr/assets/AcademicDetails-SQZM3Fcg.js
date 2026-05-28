import { jsxs, jsx } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { m as modules, b as student_status } from "./constants-Cy-OTT5f.js";
import "react";
import "ziggy-js";
function AcademicStep({
  data,
  setData,
  errors,
  courseCurricula,
  isEdit = false
}) {
  const hasProgramVersionMappings = courseCurricula.length > 0;
  const handleChange = (e) => setData(e.target.name, e.target.value);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [
    !hasProgramVersionMappings ? /* @__PURE__ */ jsx("div", { className: "md:col-span-2 xl:col-span-3 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "You cannot continue with academic details until a program version mapping exists." }) : null,
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Previous School", required: true }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          name: "previous_school",
          placeholder: "e.g. Nairobi School",
          value: data.previous_school,
          onChange: handleChange,
          error: errors.previous_school
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.previous_school })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Program", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: courseCurricula,
          value: data.course_curriculum_id,
          disabled: !hasProgramVersionMappings,
          onChange: (m) => setData("course_curriculum_id", m.id),
          error: errors.course_curriculum_id
        }
      ),
      !hasProgramVersionMappings ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a program version mapping first to continue." }) : null,
      /* @__PURE__ */ jsx(InputError, { message: errors.course_curriculum_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Current Module", required: true }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: modules,
          value: data.current_module,
          onChange: (m) => setData("current_module", m.name),
          error: errors.current_module
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.current_module })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Fee Discount (%)" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "number",
          name: "fee_discount_percentage",
          placeholder: "0",
          min: "0",
          max: "100",
          value: data.fee_discount_percentage,
          onChange: handleChange,
          error: errors.fee_discount_percentage
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.fee_discount_percentage })
    ] }),
    isEdit && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(InputLabel, { value: "Student Status" }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          defaultOptions: student_status,
          value: data.student_status,
          onChange: (s) => setData("student_status", s.name),
          error: errors.student_status
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.student_status })
    ] })
  ] });
}
export {
  AcademicStep as default
};
