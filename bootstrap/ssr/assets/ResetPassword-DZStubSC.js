import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { UserRound, KeyRound } from "lucide-react";
import "axios";
import "react-dom/client";
import "react";
import "react-toastify";
function ResetStaffPassword() {
  const { flash = {} } = usePage().props;
  const form = useForm({
    staff_number: "",
    password: "",
    password_confirmation: ""
  });
  const isFormIncomplete = !form.data.staff_number.trim() || !form.data.password || !form.data.password_confirmation;
  const submit = (e) => {
    e.preventDefault();
    form.post(route("staffs.password-reset.store"), {
      preserveScroll: true,
      onSuccess: () => form.reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Reset Staff Password" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-5xl py-6", children: /* @__PURE__ */ jsx("div", { className: "rounded-[28px] border border-zinc-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 px-8 py-8 lg:grid-cols-[0.85fr_1.15fr]", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm", children: /* @__PURE__ */ jsx(UserRound, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "Staff Account Recovery" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4 text-sm text-zinc-600", children: [
          /* @__PURE__ */ jsx("p", { children: "Enter the staff number and choose a new password for that account." }),
          /* @__PURE__ */ jsx("p", { children: "The latest password takes effect immediately after submission." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-zinc-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700", children: /* @__PURE__ */ jsx(KeyRound, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "New Password Details" }) })
        ] }),
        flash.success ? /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700", children: flash.success }) : null,
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  value: "Staff Number",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  required: true,
                  name: "staff_number",
                  value: form.data.staff_number,
                  onChange: (e) => form.setData(
                    "staff_number",
                    e.target.value
                  ),
                  error: form.errors.staff_number,
                  placeholder: "TVET/STAFF/001"
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.staff_number
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  value: "New Password",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "password",
                  required: true,
                  name: "password",
                  value: form.data.password,
                  onChange: (e) => form.setData(
                    "password",
                    e.target.value
                  ),
                  error: form.errors.password
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.password
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  value: "Confirm Password",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "password",
                  required: true,
                  name: "password_confirmation",
                  value: form.data.password_confirmation,
                  onChange: (e) => form.setData(
                    "password_confirmation",
                    e.target.value
                  ),
                  error: form.errors.password_confirmation
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.password_confirmation
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              disabled: form.processing || isFormIncomplete,
              children: "Reset Staff Password"
            }
          ) })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  ResetStaffPassword as default
};
