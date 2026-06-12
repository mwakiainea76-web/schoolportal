import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Link, Head } from "@inertiajs/react";
import { useEffect } from "react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import "@headlessui/react";
function Create({
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const { data, setData, post, processing, errors } = useForm({
    academic_year: "",
    start_date: "",
    end_date: ""
  });
  useEffect(() => {
    if (modalMode && open) {
      setData("academic_year", "");
      setData("start_date", "");
      setData("end_date", "");
    }
  }, [modalMode, open]);
  const submit = (e) => {
    e.preventDefault();
    post(route("academic.years.store"), {
      preserveScroll: true,
      onSuccess: () => {
        if (modalMode) {
          onClose();
        }
      }
    });
  };
  const content = /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
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
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
      modalMode ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
          children: "Cancel"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          href: route("academic.years.index"),
          className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          disabled: processing,
          type: "submit",
          className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
          children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            "Saving",
            /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" })
          ] }) : "Save"
        }
      )
    ] })
  ] }) });
  if (modalMode) {
    return /* @__PURE__ */ jsx(Modal, { show: open, onClose, maxWidth: "3xl", align: "top", children: content });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Academic Year" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: content })
  ] });
}
export {
  Create as default
};
