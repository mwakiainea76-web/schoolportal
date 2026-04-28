import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Login" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-400 px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-xl p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "Editrack" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Sign in to your account" })
      ] }),
      status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-emerald-600 text-center", children: status }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Email", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "email",
              name: "email",
              value: data.email,
              onChange: handleChange,
              error: errors.email,
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Password", required: true }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: showPassword ? "text" : "password",
                name: "password",
                value: data.password,
                onChange: handleChange,
                error: errors.password
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword((prev) => !prev),
                className: "absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-slate-700",
                children: showPassword ? "Hide" : "Show"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Remember me",
              checked: data.remember,
              onChange: (v) => setData("remember", v)
            }
          ),
          canResetPassword && /* @__PURE__ */ jsx(
            Link,
            {
              href: route("password.request"),
              className: "text-sm text-emerald-600 hover:underline",
              children: "Forgot password?"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50",
            children: processing ? "Logging in..." : "Login"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Login as default
};
