import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import Form from "./Form-CHozdKvX.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
function Create() {
  const form = useForm({
    name: "",
    code: "",
    session_fee_amount: "",
    gender: "",
    location: "",
    description: "",
    is_active: true,
    rooms: [{ id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true }]
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("hostels.store"), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Hostel" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl", children: /* @__PURE__ */ jsx(
      Form,
      {
        form: { ...form, onSubmit },
        title: "Create Hostel",
        description: "Set up a boarding hostel, define its room structure, and generate beds that can later be allocated per academic session.",
        submitLabel: "Save Hostel",
        cancelHref: route("hostels.index")
      }
    ) })
  ] });
}
export {
  Create as default
};
