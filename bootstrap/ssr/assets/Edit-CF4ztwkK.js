import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Link, Head, router } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import "@headlessui/react";
const toDateInputValue = (value) => value ? String(value).slice(0, 10) : "";
const YEAR_STATUS = {
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
  academic_year,
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const [statusProcessing, setStatusProcessing] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    academic_year: academic_year?.academic_year || "",
    start_date: toDateInputValue(academic_year?.start_date),
    end_date: toDateInputValue(academic_year?.end_date)
  });
  useEffect(() => {
    setData("academic_year", academic_year?.academic_year || "");
    setData("start_date", toDateInputValue(academic_year?.start_date));
    setData("end_date", toDateInputValue(academic_year?.end_date));
  }, [academic_year?.id]);
  const statusKey = academic_year?.status || (academic_year?.is_active ? "ongoing" : "upcoming");
  const status = YEAR_STATUS[statusKey] || YEAR_STATUS.upcoming;
  const submit = (e) => {
    e.preventDefault();
    put(
      route(
        "academic.years.update",
        encodeURIComponent(academic_year.id)
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
  const updateStatus = (action = status.action) => {
    setStatusProcessing(true);
    router.patch(
      route("academic.years.status", academic_year.id),
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
        " ",
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
            children: statusProcessing ? "Updating..." : `${status.actionLabel} Academic Year`
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
        /* @__PURE__ */ jsx(InputLabel, { children: "Academic Year Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.academic_year,
            onChange: (e) => setData("academic_year", e.target.value),
            placeholder: "e.g. 2023/2024",
            error: errors.academic_year
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.academic_year })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "Start Date" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            type: "date",
            value: data.start_date,
            onChange: (e) => setData("start_date", e.target.value),
            error: errors.start_date
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.start_date })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { children: "End Date" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            type: "date",
            value: data.end_date,
            onChange: (e) => setData("end_date", e.target.value),
            error: errors.end_date
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.end_date })
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
          href: route("academic.years.index"),
          className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Updating..." : "Update Academic Year" })
    ] })
  ] }) });
  if (modalMode) {
    return /* @__PURE__ */ jsx(Modal, { show: open, onClose, maxWidth: "3xl", align: "top", children: content });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Edit Academic Year - ${academic_year?.academic_year}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: content })
  ] });
}
export {
  Edit as default
};
