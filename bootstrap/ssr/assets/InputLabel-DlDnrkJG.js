import { jsxs, jsx } from "react/jsx-runtime";
function InputLabel({
  value,
  className = "",
  children,
  required = false,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "label",
    {
      ...props,
      className: `block text-sm font-medium text-gray-700  ` + className,
      children: [
        value ? value : children,
        " ",
        required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ]
    }
  );
}
export {
  InputLabel as I
};
