import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "react";
const genders = [
  { value: "", label: "All / Not restricted" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "mixed", label: "Mixed" }
];
function Form({ form, title, description, submitLabel, cancelHref }) {
  const { data, setData, processing, errors } = form;
  const updateRoom = (index, field, value) => {
    const rooms = [...data.rooms];
    rooms[index] = { ...rooms[index], [field]: value };
    setData("rooms", rooms);
  };
  const addRoom = () => {
    setData("rooms", [
      ...data.rooms,
      { id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true }
    ]);
  };
  const removeRoom = (index) => {
    if (data.rooms.length === 1) {
      return;
    }
    setData(
      "rooms",
      data.rooms.filter((_, roomIndex) => roomIndex !== index)
    );
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: form.onSubmit, className: "space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Hostel Name", required: true }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: "mt-1 block w-full",
            placeholder: "e.g. Sunrise Hostel"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Hostel Code", required: true }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.code,
            onChange: (e) => setData("code", e.target.value),
            className: "mt-1 block w-full",
            placeholder: "e.g. HSTL-A"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.code, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Session Hostel Fee", required: true }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            type: "number",
            min: "0",
            step: "0.01",
            value: data.session_fee_amount,
            onChange: (e) => setData("session_fee_amount", e.target.value),
            className: "mt-1 block w-full",
            placeholder: "e.g. 18000"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.session_fee_amount, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Gender" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: data.gender,
            onChange: (e) => setData("gender", e.target.value),
            className: "mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
            children: genders.map((gender) => /* @__PURE__ */ jsx("option", { value: gender.value, children: gender.label }, gender.value || "all"))
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.gender, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Location" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            value: data.location,
            onChange: (e) => setData("location", e.target.value),
            className: "mt-1 block w-full",
            placeholder: "e.g. North Wing"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.location, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
        /* @__PURE__ */ jsx(
          TextArea,
          {
            rows: "4",
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            className: "mt-1 block w-full",
            placeholder: "Optional notes about the hostel..."
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.description, className: "mt-2" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-zinc-700", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: data.is_active,
          onChange: (e) => setData("is_active", e.target.checked),
          className: "h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
        }
      ),
      "Hostel is active and available for boarding allocation"
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Rooms and Beds" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Each room will automatically generate its bed inventory from the bed count you set." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: addRoom,
            className: "rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50",
            children: "Add Room"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(InputError, { message: errors.rooms, className: "mt-1" }),
      data.rooms.map((room, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500", children: [
            "Room ",
            index + 1
          ] }),
          data.rooms.length > 1 ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeRoom(index),
              className: "text-sm font-medium text-red-600 hover:underline",
              children: "Remove"
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Room Name", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: room.name,
                onChange: (e) => updateRoom(index, "name", e.target.value),
                className: "mt-1 block w-full",
                placeholder: "e.g. Blue Wing Room 1"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors[`rooms.${index}.name`], className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Room Code", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: room.code,
                onChange: (e) => updateRoom(index, "code", e.target.value),
                className: "mt-1 block w-full",
                placeholder: "e.g. BWR-01"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors[`rooms.${index}.code`], className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Floor" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: room.floor,
                onChange: (e) => updateRoom(index, "floor", e.target.value),
                className: "mt-1 block w-full",
                placeholder: "e.g. Ground Floor"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors[`rooms.${index}.floor`], className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Beds in Room", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                value: room.bed_count,
                onChange: (e) => updateRoom(index, "bed_count", e.target.value),
                className: "mt-1 block w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors[`rooms.${index}.bed_count`], className: "mt-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "mt-4 flex items-center gap-3 text-sm font-medium text-zinc-700", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: room.is_active,
              onChange: (e) => updateRoom(index, "is_active", e.target.checked),
              className: "h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            }
          ),
          "Room is active for boarding allocation"
        ] })
      ] }, room.id ?? `room-${index}`))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: cancelHref,
          className: "rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
          children: processing ? "Saving..." : submitLabel
        }
      )
    ] })
  ] });
}
export {
  Form as default
};
