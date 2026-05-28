import { jsx } from "react/jsx-runtime";
import { PuffLoader } from "react-spinners";
function LoadingSpinner({
  size = "md",
  className = "",
  centered = false
}) {
  const sizes = {
    sm: 18,
    md: 32,
    lg: 48
  };
  const wrapperClass = centered ? "flex items-center justify-center" : "inline-flex items-center";
  return /* @__PURE__ */ jsx("div", { className: `${wrapperClass} ${className}`.trim(), children: /* @__PURE__ */ jsx(
    PuffLoader,
    {
      color: "#10B981",
      loading: true,
      size: sizes[size] ?? sizes.md,
      speedMultiplier: 0.9
    }
  ) });
}
export {
  LoadingSpinner as L
};
