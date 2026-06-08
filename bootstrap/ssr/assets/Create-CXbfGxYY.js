import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { useEffect } from "react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import "@headlessui/react";
function Create({
  academic_year,
  session_no,
  prerequisite_error,
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const { data, setData, post, processing, errors } = useForm({
    session_No: session_no,
    academic_year_id: academic_year?.id
  });
  useEffect(() => {
    setData({
      session_No: session_no,
      academic_year_id: academic_year?.id
    });
  }, [session_no, academic_year?.id]);
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.sessions.store"), {
      preserveScroll: true,
      onSuccess: () => {
        if (modalMode) {
          onClose();
        }
      }
    });
  };
  const content = /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
    prerequisite_error ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: prerequisite_error }) : null,
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "cursor-not-allowed bg-slate-100",
            value: academic_year?.academic_year ?? "No active academic year",
            disabled: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Session no." }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.session_No,
            onChange: (e) => setData("session_No", e.target.value),
            error: errors.session_No
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "hidden",
        name: "academic_year_id",
        value: data.academic_year_id || ""
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center justify-end gap-4", children: [
      modalMode ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
          children: "Cancel"
        }
      ) : null,
      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing || !academic_year, children: "Create academic session" })
    ] })
  ] }) });
  if (modalMode) {
    return /* @__PURE__ */ jsx(Modal, { show: open, onClose, maxWidth: "3xl", align: "top", children: content });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Academic session" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: content })
  ] });
}
export {
  Create as default
};
