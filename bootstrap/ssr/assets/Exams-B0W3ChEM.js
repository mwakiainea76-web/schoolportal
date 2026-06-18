import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "react";
import "lucide-react";
import "react-toastify";
function Exams() {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-900", children: "Examinations" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-1", children: "Another nested page inside the same layout." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Examinations" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-zinc-600", children: "Use this as a placeholder for exam setup or listings." }) })
      ]
    }
  );
}
export {
  Exams as default
};
