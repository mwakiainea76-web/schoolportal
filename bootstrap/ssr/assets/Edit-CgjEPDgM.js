import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import Form from "./Form-CHozdKvX.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "./TextArea-DrH8CNbm.js";
import "react";
import "./TextInput-DsoSnibl.js";
function Edit({ hostel }) {
  const form = useForm({
    name: hostel.name || "",
    code: hostel.code || "",
    session_fee_amount: hostel.session_fee_amount || "",
    gender: hostel.gender || "",
    location: hostel.location || "",
    description: hostel.description || "",
    is_active: hostel.is_active ?? true,
    rooms: hostel.rooms?.map((room) => ({
      id: room.id,
      name: room.name,
      code: room.code,
      floor: room.floor || "",
      bed_count: room.bed_count || 1,
      is_active: room.is_active ?? true
    })) || [{ id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true }]
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.put(route("hostels.update", hostel.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Hostel" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl space-y-6", children: /* @__PURE__ */ jsx(
      Form,
      {
        form: { ...form, onSubmit },
        title: `Edit ${hostel.name}`,
        description: "Update the hostel profile, revise room inventory, and keep the boarding bed structure current for future allocations.",
        submitLabel: "Update Hostel",
        cancelHref: route("hostels.index")
      }
    ) })
  ] });
}
export {
  Edit as default
};
