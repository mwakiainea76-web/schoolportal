import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { useForm, Link, Head } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import AcademicCalendarWorkspaceTabs from "./AcademicCalendarWorkspaceTabs-BIDzA_tP.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "@headlessui/react";
function Edit({
  academic_year,
  modalMode = false,
  open = false,
  onClose = () => {
  }
}) {
  const { data, setData, put, processing, errors } = useForm({
    academic_year: academic_year?.academic_year || ""
  });
  useEffect(() => {
    setData("academic_year", academic_year?.academic_year || "");
  }, [academic_year?.id]);
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
  const content = /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
      "Current status",
      " ",
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `ml-2 rounded px-2 py-0.5 text-xs ${academic_year.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
          children: academic_year.is_active ? "Ongoing" : "Completed"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: /* @__PURE__ */ jsxs("div", { children: [
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
    ] }) }),
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
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Edit Academic Year - ${academic_year?.academic_year}`
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(AcademicCalendarWorkspaceTabs, { activeTab: "years" }),
      content
    ] })
  ] });
}
export {
  Edit as default
};
