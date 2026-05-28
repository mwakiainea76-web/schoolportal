import { jsx, jsxs } from "react/jsx-runtime";
import { Transition, Dialog, TransitionChild, DialogPanel } from "@headlessui/react";
function Modal({
  children,
  show = false,
  maxWidth = "2xl",
  closeable = true,
  onClose = () => {
  },
  align = "center"
  // "center" | "top"
}) {
  const close = () => {
    if (closeable) {
      onClose();
    }
  };
  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl"
  }[maxWidth];
  const alignClass = align === "top" ? "items-start py-6" : "items-center py-6";
  return /* @__PURE__ */ jsx(Transition, { show, leave: "duration-200", children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      id: "modal",
      className: `fixed inset-0 z-50 flex transform overflow-y-auto px-4 ${alignClass}`,
      onClose: close,
      children: [
        /* @__PURE__ */ jsx(
          TransitionChild,
          {
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm" })
          }
        ),
        /* @__PURE__ */ jsx(
          TransitionChild,
          {
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsx(
              DialogPanel,
              {
                className: `mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`,
                children
              }
            )
          }
        )
      ]
    }
  ) });
}
export {
  Modal as M
};
