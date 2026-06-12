import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Link, Head, router } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import "@headlessui/react";
const SESSION_STATUS = {
  upcoming: {
    label: "Upcoming",
    badgeClass: "bg-amber-100 text-amber-700",
    action: "start",
    actionLabel: "Activate"
  },
  ongoing: {
    label: "Ongoing",
    badgeClass: "bg-green-100 text-green-700",
    action: "end",
    actionLabel: "Deactivate"
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-red-100 text-red-600",
    action: "reactivate",
    actionLabel: "Activate"
  },
  on_hold: {
    label: "On hold",
    badgeClass: "bg-slate-100 text-slate-700",
    action: "start",
    actionLabel: "Activate"
  }
};
function Edit({
  academic_session,
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const [statusProcessing, setStatusProcessing] = useState(false);
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
  const statusKey = academic_session?.status || (academic_session?.is_active ? "ongoing" : "upcoming");
  const status = SESSION_STATUS[statusKey] || SESSION_STATUS.upcoming;
  const updateStatus = (action = status.action) => {
    setStatusProcessing(true);
    router.patch(
      route("academic.sessions.status", academic_session.id),
      { action },
      {
        preserveScroll: true,
        onFinish: () => setStatusProcessing(false),
        onSuccess: () => {
          if (modalMode) {
            onClose();
          }
        }
      }
    );
  };
  const content = /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "Current status",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `ml-2 rounded px-2 py-0.5 text-xs ${status.badgeClass}`,
            children: status.label
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => updateStatus(),
            disabled: statusProcessing || processing,
            className: `rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${status.action === "end" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`,
            children: statusProcessing ? "Updating..." : `${status.actionLabel} Academic Session`
          }
        ),
        statusKey !== "on_hold" ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => updateStatus("hold"),
            disabled: statusProcessing || processing,
            className: "rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50",
            children: "Put On Hold"
          }
        ) : null
      ] })
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
