import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function Edit({ lecture_room, departments }) {
  const { data, setData, put, processing, errors } = useForm({
    department_id: String(lecture_room.department_id ?? ""),
    name: lecture_room.name ?? "",
    code: lecture_room.code ?? "",
    capacity: lecture_room.capacity ?? "",
    location: lecture_room.location ?? "",
    description: lecture_room.description ?? "",
    is_active: Boolean(lecture_room.is_active)
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("lecture-rooms.update", lecture_room.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Lecture Room" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]", children: /* @__PURE__ */ jsxs("form", { className: "space-y-8 p-10", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Edit Lecture Room" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Update the teaching space details used by the timetable." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Department", required: true }),
          /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: null,
              defaultOptions: departments,
              value: data.department_id,
              placeholder: "Select department...",
              onChange: (department) => setData("department_id", department.id),
              error: errors.department_id
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.department_id,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Room Name", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              className: "mt-1 block w-full",
              error: errors.name
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.name,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Room Code", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: data.code,
              onChange: (e) => setData("code", e.target.value),
              className: "mt-1 block w-full",
              error: errors.code
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.code,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Capacity" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "number",
              min: "1",
              value: data.capacity,
              onChange: (e) => setData("capacity", e.target.value),
              className: "mt-1 block w-full",
              error: errors.capacity
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.capacity,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Location" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: data.location,
              onChange: (e) => setData("location", e.target.value),
              className: "mt-1 block w-full",
              error: errors.location
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.location,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              rows: "5",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              className: "mt-1 block w-full",
              error: errors.description
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.description,
              className: "mt-2"
            }
          )
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
        "Room is active and available for scheduling"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("lecture-rooms.index"),
            className: "rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing,
            type: "submit",
            className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50",
            children: processing ? "Updating..." : "Update Room"
          }
        )
      ] })
    ] }) }) })
  ] });
}
export {
  Edit as default
};
