import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
const TextArea = forwardRef(function Textarea({ className = "", isFocused = false, rows = 4, ...props }, ref) {
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
    "textarea",
    {
      ...props,
      rows,
      className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full " + className,
      ref: localRef
    }
  );
});
export {
  TextArea as T
};
