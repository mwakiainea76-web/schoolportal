import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { Transition } from "@headlessui/react";
import { useForm, Link } from "@inertiajs/react";
import { Mail } from "lucide-react";
import "react";
function UpdateProfileInformation({
  user,
  mustVerifyEmail,
  status,
  className = ""
}) {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email,
    phone_number: user.phone_number || "",
    address: user.address || ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };
  const isStudent = !!user.student;
  const isStaff = !!user.staff;
  return /* @__PURE__ */ jsx("section", { className, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      isStudent && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Admission No." }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900", children: user.student.admission_number || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Current Course" }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-sm font-bold text-zinc-900 truncate",
              title: user.student.course_enrollment?.course?.name,
              children: user.student.course_enrollment?.course?.name ?? "Not Enrolled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Curriculum" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900", children: user.student.course_enrollment?.curriculum?.name ?? "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-2 w-2 rounded-full ${user.student.enrollment_status === "active" ? "bg-emerald-500" : "bg-zinc-300"}`
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900 capitalize", children: user.student.enrollment_status ?? "Unknown" })
          ] })
        ] })
      ] }),
      isStaff && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Staff Number" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900", children: user.staff.staff_number || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Department" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900 truncate", children: user.staff.department?.name ?? "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Designation" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900 truncate", children: user.staff.designation ?? "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: "Employment" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-900", children: user.staff.employment_type ?? "N/A" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "first_name",
            className: "text-zinc-600 font-semibold",
            value: "First Name"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "first_name",
            className: "block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
            value: data.first_name,
            onChange: (e) => setData("first_name", e.target.value),
            required: true,
            autoComplete: "given-name"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.first_name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "last_name",
            className: "text-zinc-600 font-semibold",
            value: "Last Name"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "last_name",
            className: "block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
            value: data.last_name,
            onChange: (e) => setData("last_name", e.target.value),
            required: true,
            autoComplete: "family-name"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.last_name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "email",
            className: "text-zinc-600 font-semibold",
            value: "Email Address"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            className: "block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            required: true,
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "phone_number",
            className: "text-zinc-600 font-semibold",
            value: "Phone Number"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "phone_number",
            className: "block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
            value: data.phone_number,
            onChange: (e) => setData("phone_number", e.target.value),
            autoComplete: "tel"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.phone_number })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "address",
            className: "text-zinc-600 font-semibold",
            value: "Home Address"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "address",
            className: "block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
            value: data.address,
            onChange: (e) => setData("address", e.target.value),
            autoComplete: "street-address"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.address })
      ] })
    ] }),
    mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Mail, { className: "text-amber-600 shrink-0", size: 20 }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-amber-800", children: [
        "Your email address is unverified.",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("verification.send"),
            method: "post",
            as: "button",
            className: "ml-2 font-bold underline hover:text-amber-900",
            children: "Send verification email"
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
          children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-emerald-600", children: "Profile saved." })
        }
      ),
      /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          disabled: processing,
          className: "bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 h-11",
          children: processing ? "Saving..." : "Save Changes"
        }
      )
    ] })
  ] }) });
}
export {
  UpdateProfileInformation as default
};
