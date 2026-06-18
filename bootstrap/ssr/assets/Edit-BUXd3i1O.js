import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import Form from "./Form-BNKutuHE.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./SearchSelect-PvfiRNjv.js";
import "react";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Hostel Allocation" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl space-y-6", children: /* @__PURE__ */ jsx(
      Form,
      {
        form: { ...form, onSubmit },
        title: `Edit Hostel Allocation${allocation.admission_number ? ` - ${allocation.admission_number}` : ""}`,
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
