import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import Form from "./Form-DIg5RwBF.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./SearchSelect-DbLPTvUh.js";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
function Edit({ allocation, enrollments, hostels, rooms, beds }) {
  const form = useForm({
    academic_session_enrollment_id: allocation.academic_session_enrollment_id || "",
    hostel_id: allocation.hostel_id || "",
    hostel_room_id: allocation.hostel_room_id || "",
    hostel_bed_id: allocation.hostel_bed_id || "",
    allocated_on: allocation.allocated_on || "",
    status: allocation.status || "active",
    notes: allocation.notes || ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.put(route("hostel-allocations.update", allocation.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Hostel Allocation" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl", children: /* @__PURE__ */ jsx(
      Form,
      {
        form: { ...form, onSubmit },
        title: `Edit Hostel Allocation${allocation.registration_number ? ` - ${allocation.registration_number}` : ""}`,
        description: "Move the student within the approved hostel inventory only where a fully paid hostel invoice already exists for that session.",
        submitLabel: "Update Allocation",
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
  Edit as default
};
