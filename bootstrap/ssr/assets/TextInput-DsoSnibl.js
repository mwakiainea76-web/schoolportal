import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
const TextInput = forwardRef(function TextInput2({
  error = false,
  type = "text",
  className = "",
  isFocused = false,
  ...props
}, ref) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus()
  }));
  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type,
      className: `w-full bg-zinc-50 border rounded-xl py-2.5 px-5 text-sm focus:ring-zinc-300 transition-colors
                ${error ? "border-red-400" : "border-zinc-200"}
                ${className}`,
      ref: localRef
    }
  );
});
export {
  TextInput as T
};
