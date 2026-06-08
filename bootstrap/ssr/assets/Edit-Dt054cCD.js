import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm, Link, Head } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import "@headlessui/react";
function Edit({
  academic_session,
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const { data, setData, put, processing, errors } = useForm({
    session_No: academic_session.session_No || "",
    academic_year_id: academic_session.academic_year_id || ""
  });
  useEffect(() => {
    setData({
      session_No: academic_session?.session_No || "",
      academic_year_id: academic_session?.academic_year_id || ""
    });
  }, [academic_session?.id]);
  const submit = (e) => {
    e.preventDefault();
    put(
      route(
        "academic.sessions.update",
        encodeURIComponent(academic_session.id)
      ),
      {
        preserveScroll: true,
        onSuccess: () => {
          if (modalMode) {
            onClose();
          }
        }
      }
    );
  };
  const academicYearLabel = academic_session?.academicYear?.academic_year || academic_session?.academic_year?.academic_year || "";
  const content = /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
      "Current status",
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `ml-2 rounded px-2 py-0.5 text-xs ${academic_session.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
          children: academic_session.is_active ? "Active" : "Inactive"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "cursor-not-allowed bg-gray-100",
            value: academicYearLabel,
            disabled: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "academic_year_id",
            value: data.academic_year_id
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "Session Number" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.session_No,
            onChange: (e) => setData("session_No", e.target.value),
            placeholder: "e.g. 1",
            error: errors.session_No
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-6 flex items-center justify-end gap-4 border-t border-zinc-50", children: [
      modalMode ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
          children: "Cancel"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          href: route("academic.sessions.index"),
          className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Updating..." : "Update Academic Session" })
    ] })
  ] }) });
  if (modalMode) {
    return /* @__PURE__ */ jsx(Modal, { show: open, onClose, maxWidth: "3xl", align: "top", children: content });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Edit Academic Session - ${academic_session?.session_No}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: content })
  ] });
}
export {
  Edit as default
};
