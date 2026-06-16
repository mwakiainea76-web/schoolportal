import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { l as loadSecurityContext } from "./securityContext-m8y6D16M.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
const campusPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80";
const schoolLogo = "/images/school%20logo.png";
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    login: "",
    password: "",
    remember: false,
    device_id: "",
    location_hint: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasActiveProfileSession, setHasActiveProfileSession] = useState(false);
  useEffect(() => {
    const context = loadSecurityContext();
    setData("device_id", context.device_id);
    setData("location_hint", context.location_hint);
  }, [setData]);
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    if (hasActiveProfileSession) {
      return;
    }
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Login" }),
    /* @__PURE__ */ jsx("div", { className: "h-screen overflow-hidden bg-stone-100", children: /* @__PURE__ */ jsxs("div", { className: "grid h-screen lg:grid-cols-[1.18fr_0.82fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative hidden overflow-hidden lg:block", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: campusPhoto,
            alt: "School building",
            className: "h-full w-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-[-1px] w-32 bg-[#f6f7fb] [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)]" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex h-screen items-center justify-center bg-[#f6f7fb] px-4 sm:px-8", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 hidden w-28 bg-white/35 lg:block [clip-path:polygon(0_0,68%_0,22%_100%,0_100%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[400px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: schoolLogo,
                alt: "School logo",
                className: "mx-auto h-10 w-auto object-contain"
              }
            ),
            /* @__PURE__ */ jsx("h2", { className: "mt-5 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl", children: "Hi, welcome back" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium text-slate-600 sm:text-base", children: "Please fill in your details to log in" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-zinc-100 sm:p-8", children: [
            status && /* @__PURE__ */ jsx("div", { className: "mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: status }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Username", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    name: "login",
                    value: data.login,
                    onChange: handleChange,
                    error: errors.login,
                    placeholder: "Admission No",
                    autoFocus: true,
                    className: "mt-2 bg-white"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Password", required: true }),
                /* @__PURE__ */ jsxs("div", { className: "relative mt-2", children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: showPassword ? "text" : "password",
                      name: "password",
                      value: data.password,
                      onChange: handleChange,
                      error: errors.password,
                      placeholder: "Enter your password",
                      className: "bg-white pr-16"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(
                        (prev) => !prev
                      ),
                      className: "absolute inset-y-0 right-4 flex items-center text-sm font-medium text-slate-500 hover:text-slate-700",
                      children: showPassword ? "Hide" : "Show"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between", children: [
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
                    className: "text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline",
                    children: "Forgot Password?"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "w-full rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50",
                  children: processing ? "Signing In..." : "Sign In"
                }
              ),
              errors.login && /* @__PURE__ */ jsx("div", { className: "mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700", children: errors.login })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center text-sm text-slate-600", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              "Don't have an account?",
              " ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("register"),
                  className: "font-semibold text-emerald-600 hover:underline",
                  children: "Sign Up"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-6 text-slate-500", children: [
              "Copyright (c) ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              " - Apex"
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Login as default
};
