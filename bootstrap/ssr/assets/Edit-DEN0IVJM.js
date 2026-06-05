import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AuthenticatedLayout } from "../app.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { S as SearchSelect } from "./SearchSelect-8eQtXAlf.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function Edit({ academic_session }) {
  const sessionActionOptions = [
    { id: "activate", name: "Make session active" },
    { id: "end", name: "End session" },
    { id: "disable", name: "Disable session" }
  ];
  const { data, setData, put, processing, errors } = useForm({
    session_No: academic_session.session_No || "",
    academic_year_id: academic_session.academic_year_id || "",
    session_action: academic_session.is_active ? "activate" : academic_session.end_date ? "end" : "disable"
  });
  const submit = (e) => {
    e.preventDefault();
    put(
      route(
        "academic.sessions.update",
        encodeURIComponent(academic_session.id)
      ),
      {
        preserveScroll: true,
        onBefore: (visit) => {
          visit.data = {
            session_No: data.session_No,
            academic_year_id: data.academic_year_id,
            is_active: data.session_action === "activate",
            close_session: data.session_action === "end"
          };
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Edit Academic Session - ${academic_session?.session_No}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit academic session" }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-xs", children: [
        " ",
        "Current status",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `px-2 py-0.5 rounded text-xs ${academic_session.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
            children: academic_session.is_active ? "Active" : "Inactive"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "p-10 space-y-8", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "cursor-not-allowed bg-gray-100",
                value: academic_session.academic_year.academic_year,
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
                className: "cursor-not-allowed bg-gray-100",
                disabled: true,
                value: data.session_No,
                onChange: (e) => setData("session_No", e.target.value),
                placeholder: "e.g. 1",
                error: errors.session_No
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Session Action", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: null,
                defaultOptions: sessionActionOptions,
                value: data.session_action,
                selectedLabel: sessionActionOptions.find(
                  (option) => option.id === data.session_action
                )?.name || "Select session action",
                placeholder: "Select session action",
                onChange: (item) => setData("session_action", item.id),
                error: errors.session_action
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.session_action,
                className: "mt-2"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Choose one action for this academic session." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 flex items-center justify-end gap-4 border-t border-zinc-50", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("academic.sessions.index"),
              className: "px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Updating..." : "Update Academic Session" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Edit as default
};
