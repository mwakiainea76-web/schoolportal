import { jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-CmQIlIE5.js";
import PostPenaltyForm from "./PostPenaltyForm-EsMiyZ33.js";
import "./AuthenticatedLayout-DYCvRbZH.js";
import "react";
import "lucide-react";
import "react-toastify";
import "./PrimaryButton-DsDrFqHJ.js";
import "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function PostPenalty({ selectedRegistrationNumber }) {
  const form = useForm({
    registration_number: selectedRegistrationNumber || "",
    amount: "",
    description: "",
    applied_at: today
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.penalties.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Post Penalty",
      description: "Add a penalty that increases the selected invoice balance.",
      backHref: route("billing.manual.index"),
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx(PostPenaltyForm, { form: { ...form, onSubmit } }) })
    }
  );
}
export {
  PostPenalty as default
};
