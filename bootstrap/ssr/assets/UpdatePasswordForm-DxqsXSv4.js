import { jsx, jsxs } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";
function UpdatePasswordForm({ className = "" }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        if (errors2.password) {
          reset("password", "password_confirmation");
          passwordInput.current.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          currentPasswordInput.current.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsx("section", { className, children: /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "space-y-6 max-w-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(
        InputLabel,
        {
          htmlFor: "current_password",
          className: "text-zinc-600 font-semibold",
          value: "Current Password"
        }
      ),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "current_password",
          ref: currentPasswordInput,
          value: data.current_password,
          onChange: (e) => setData("current_password", e.target.value),
          type: "password",
          className: "block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl",
          autoComplete: "current-password"
        }
      ),
      /* @__PURE__ */ jsx(
        InputError,
        {
          message: errors.current_password,
          className: "mt-1"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1  gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password",
            className: "text-zinc-600 font-semibold",
            value: "New Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            ref: passwordInput,
            value: data.password,
            onChange: (e) => setData("password", e.target.value),
            type: "password",
            className: "block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password,
            className: "mt-1"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password_confirmation",
            className: "text-zinc-600 font-semibold",
            value: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password_confirmation",
            value: data.password_confirmation,
            onChange: (e) => setData("password_confirmation", e.target.value),
            type: "password",
            className: "block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password_confirmation,
            className: "mt-1"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 pt-4", children: [
      /* @__PURE__ */ jsx(
        Transition,
        {
          show: recentlySuccessful,
          enter: "transition ease-in-out duration-300",
          enterFrom: "opacity-0 translate-y-1",
          leave: "transition ease-in-out duration-300",
          leaveTo: "opacity-0 translate-y-1",
          children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-sky-600", children: "Password updated." })
        }
      ),
      /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          disabled: processing,
          className: "bg-zinc-900 hover:bg-zinc-800 rounded-xl px-8 h-11",
          children: processing ? "Saving..." : "Update Password"
        }
      )
    ] })
  ] }) });
}
export {
  UpdatePasswordForm as default
};
