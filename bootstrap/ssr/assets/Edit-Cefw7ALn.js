import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import "lucide-react";
import "react-toastify";
const Edit = ({ exam_body }) => {
  const exam = exam_body || null;
  const { data, setData, put, processing, errors, reset } = useForm({
    code: exam?.code || "",
    name: exam?.name || "",
    description: exam?.description || ""
  });
  useEffect(() => {
    if (!exam) {
      reset();
      return;
    }
    setData((prev) => {
      if (prev.code === exam.code) return prev;
      return {
        code: exam.code || "",
        name: exam.name || "",
        description: exam.description || ""
      };
    });
  }, [exam?.code]);
  const submit = (e) => {
    e.preventDefault();
    if (!exam) return;
    put(route("exam.bodies.update", encodeURIComponent(exam.id)), {
      preserveScroll: true,
      preserveState: true
      // 🔥 CRITICAL: prevents form reset on validation failure
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Exam Body" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border shadow overflow-hidden", children: [
      /* @__PURE__ */ jsx("legend", { className: " text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full", children: "Edit exam body" }),
      /* @__PURE__ */ jsxs("form", { className: "w-full p-10 space-y-6", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "code",
                value: "Entity Code"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "code",
                error: errors.code,
                value: data.code,
                onChange: (e) => setData("code", e.target.value),
                className: "mt-1 block w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "name",
                value: "Entity Name"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                error: errors.name,
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: "mt-1 block w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              error: errors.description,
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("exam.bodies.index"),
              className: "px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing || !exam,
              type: "submit",
              className: "px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
              children: processing ? "Updating..." : "Update"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
export {
  Edit as default
};
