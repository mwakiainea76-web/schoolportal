import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { useForm, Head } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as ToggleSwitch } from "./ToggleSwitch-Dmb9fkxK.js";
import "react";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function Edit({ academic_session }) {
  const { data, setData, put, processing, errors } = useForm({
    session_No: academic_session.session_No || "",
    academic_year_id: academic_session.academic_year_id || "",
    is_active: academic_session.is_active || false,
    close_session: academic_session.end_date ? false : true
  });
  const submit = (e) => {
    e.preventDefault();
    put(
      route(
        "academic.sessions.update",
        encodeURIComponent(academic_session.id)
      )
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Academic Session" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit academic year details" }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-xs", children: [
        " ",
        "Current status",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `px-2 py-0.5 rounded text-xs ${academic_session.end_date ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
            children: academic_session.end_date ? "Ongoing" : "Completed"
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
                className: "cursor-not-allowed bg-slate-100",
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
                className: "cursor-not-allowed bg-slate-100",
                disabled: true,
                value: data.session_No,
                onChange: (e) => setData("session_No", e.target.value),
                placeholder: "e.g. 1",
                error: errors.session_No
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.session_No })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: academic_session.is_active ? "De activate this session now" : `Activate to current session now`,
                checked: data.is_active,
                onChange: (checked) => setData("is_active", checked),
                error: errors.is_active
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.is_active })
          ] }),
          academic_session.start_date && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: academic_session.end_date ? "Re open this session now" : `Close this Academic session`,
                checked: data.close_session,
                onChange: (checked) => setData("close_session", checked),
                error: errors.close_session
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.close_session
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 flex items-center gap-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Update academic session" }) })
      ] })
    ] }) })
  ] });
}
export {
  Edit as default
};
