import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function Edit({ academic_year }) {
  const lifecycleText = academic_year?.end_date ? "Academic year is done" : academic_year?.start_date ? "Academic year is ongoing" : "Upcoming";
  const isYearStateLocked = Boolean(academic_year?.end_date);
  const yearStateOptions = [
    { id: "start", name: "Start Year" },
    { id: "end", name: "End Year" }
  ];
  const { data, setData, put, processing, errors } = useForm({
    academic_year: academic_year?.academic_year || "",
    year_state: academic_year?.is_active ? "start" : "end"
  });
  const submit = (e) => {
    e.preventDefault();
    put(
      route(
        "academic.years.update",
        encodeURIComponent(academic_year.id)
      ),
      {
        preserveScroll: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Edit Academic Year - ${academic_year?.academic_year}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit academic year" }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-xs", children: [
        " ",
        "Current status",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `px-2 py-0.5 rounded text-xs ${academic_year.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
            children: academic_year.is_active ? "Ongoing" : "Completed"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { children: "Academic Year Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "cursor-not-allowed bg-gray-100",
                disabled: true,
                value: data.academic_year,
                onChange: (e) => setData("academic_year", e.target.value),
                placeholder: "e.g. 2023/2024",
                error: errors.academic_year
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.academic_year })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Year State", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: null,
                defaultOptions: yearStateOptions,
                value: data.year_state,
                selectedLabel: data.year_state === "start" ? "Start Year" : "End Year",
                placeholder: "Select year state",
                onChange: (item) => setData("year_state", item.id),
                error: errors.year_state,
                disabled: isYearStateLocked
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.year_state,
                className: "mt-2"
              }
            ),
            /* @__PURE__ */ jsx(
              "p",
              {
                className: `mt-1 text-xs ${isYearStateLocked ? "text-amber-600" : "text-slate-500"}`,
                children: isYearStateLocked ? "This academic year is closed and cannot be reactivated." : lifecycleText
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 flex items-center justify-end gap-4 border-t border-zinc-50", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("academic.years.index"),
              className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Updating..." : "Update Academic Year" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Edit as default
};
