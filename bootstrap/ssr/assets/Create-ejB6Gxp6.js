import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import Form from "./Form-7C8Wb0nG.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./SearchSelect-CY7NDfHZ.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function Create({ enrollments, hostels, rooms, beds }) {
  const form = useForm({
    academic_session_enrollment_id: "",
    hostel_id: "",
    hostel_room_id: "",
    hostel_bed_id: "",
    allocated_on: today,
    status: "active",
    notes: ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("hostel-allocations.store"), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Allocate Hostel Bed" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl space-y-6", children: /* @__PURE__ */ jsx(
      Form,
      {
        form: { ...form, onSubmit },
        title: "Allocate Hostel Bed",
        description: "Assign a hostel bed only after the student is enrolled for the academic session and the hostel invoice has been fully paid.",
        submitLabel: "Save Allocation",
        cancelHref: route("hostel-allocations.index"),
        enrollments,
        hostels,
        rooms,
        beds
      }
    ) })
  ] });
}
export {
  Create as default
};
