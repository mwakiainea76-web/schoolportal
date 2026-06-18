import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
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
function SchoolIdCards({
  filters,
  selectedOptions,
  selectedStudents = [],
  cards = [],
  schoolName
}) {
  const [type, setType] = useState(filters?.type ?? "student");
  const [identifier, setIdentifier] = useState(filters?.identifier ?? "");
  const [selected, setSelected] = useState(selectedStudents);
  const [searchKey, setSearchKey] = useState(0);
  const isStudent = type === "student";
  const searchRoute = isStudent ? "students.search" : "staffs.search";
  const selectedLabel = useMemo(
    () => selectedOptions?.find((item) => String(item.id) === String(identifier))?.name,
    [identifier, selectedOptions]
  );
  const changeType = (nextType) => {
    setType(nextType);
    setIdentifier("");
    setSelected([]);
  };
  const submit = (event) => {
    event.preventDefault();
    router.get(
      route("hr.id-cards.index"),
      {
        type,
        identifier: isStudent ? "" : identifier,
        selected_ids: isStudent ? selected.map((student) => student.id).join(",") : "",
        generate: 1
      },
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const addStudent = (student) => {
    if (!student?.id) return;
    setSelected((current) => {
      if (current.some((item) => String(item.id) === String(student.id))) {
        return current;
      }
      return [
        ...current,
        {
          id: student.id,
          name: student.name?.replace(/\s*\([^)]*\)\s*$/, "") ?? "",
          admission_number: student.admission_number ?? student.name?.match(/\(([^)]+)\)/)?.[1] ?? "",
          course: student.course ?? null,
          status: student.status ?? null
        }
      ];
    });
    setIdentifier("");
    setSearchKey((current) => current + 1);
  };
  const removeStudent = (studentId) => {
    setSelected(
      (current) => current.filter((student) => String(student.id) !== String(studentId))
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "School ID Cards" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm print:hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "School ID Cards" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Generate printable school ID fronts." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 px-5 py-5", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Card Type", required: true }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 grid max-w-md grid-cols-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1", children: ["student", "staff"].map((item) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => changeType(item),
                className: `rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${type === item ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-600 hover:text-zinc-950"}`,
                children: item
              },
              item
            )) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  value: isStudent ? "Search Student" : "Staff Number",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: searchRoute,
                  value: identifier,
                  selectedLabel,
                  defaultOptions: selectedOptions ?? [],
                  onChange: (person) => isStudent ? addStudent(person) : setIdentifier(person.id ?? ""),
                  placeholder: isStudent ? "Search admission number" : "Search staff number",
                  minSearchLength: 1,
                  preloadOptions: true
                },
                `${type}-${searchKey}`
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: isStudent && selected.length === 0,
                className: "min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
                children: "Generate ID"
              }
            )
          ] }),
          isStudent && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-zinc-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1.2fr_1fr_auto] bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase text-zinc-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Student" }),
              /* @__PURE__ */ jsx("span", { children: "Admission No" }),
              /* @__PURE__ */ jsx("span", { className: "text-right", children: "Action" })
            ] }),
            selected.length ? selected.map((student) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "grid grid-cols-[1.2fr_1fr_auto] items-center gap-3 border-t border-zinc-100 px-4 py-3 text-sm",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-900", children: student.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: student.course ?? "N/A" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: student.admission_number ?? "N/A" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeStudent(student.id),
                      className: "rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50",
                      children: "Remove"
                    }
                  )
                ]
              },
              student.id
            )) : /* @__PURE__ */ jsx("div", { className: "border-t border-zinc-100 px-4 py-5 text-center text-sm text-zinc-500", children: "No students selected." })
          ] })
        ] })
      ] }),
      cards.length ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 print:hidden", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-zinc-600", children: [
            cards.length,
            " card",
            cards.length === 1 ? "" : "s",
            " ",
            "generated"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => window.print(),
              className: "min-h-[40px] rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50",
              children: "Print Cards"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("section", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 print:block", children: cards.map((card) => /* @__PURE__ */ jsx(
          SchoolIdCard,
          {
            card,
            schoolName
          },
          `${card.type}-${card.number}`
        )) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500", children: "Select students and generate school ID cards." })
    ] })
  ] });
}
function SchoolIdCard({ card, schoolName }) {
  const isStaff = card.type?.toLowerCase().includes("staff");
  const initials = card.name.split(" ").filter(Boolean).slice(0, 2).map((name) => name[0]).join("");
  return /* @__PURE__ */ jsx("article", { className: "mx-auto w-full max-w-[520px] overflow-hidden rounded-[18px] border border-zinc-200 bg-white shadow-sm print:mb-4 print:h-[2.125in] print:w-[3.375in] print:break-inside-avoid print:rounded-none print:border print:shadow-none", children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[1.586/1] overflow-hidden bg-white print:h-full print:aspect-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-[35%] bg-emerald-800" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -right-12 top-0 h-28 w-48 rotate-12 bg-yellow-400 print:h-20 print:w-36" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-[35%] h-2 bg-yellow-400" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col p-4 print:p-3", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex items-start gap-3 text-white", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-300 bg-white text-sm font-black text-emerald-800 print:h-10 print:w-10", children: schoolName?.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("") || "SP" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-black uppercase leading-tight print:text-[11px]", children: schoolName }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-semibold uppercase text-yellow-200 print:text-[8px]", children: isStaff ? "Staff Identification Card" : "Student Identification Card" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid flex-1 grid-cols-[96px_minmax(0,1fr)] gap-4 print:mt-3 print:grid-cols-[68px_minmax(0,1fr)] print:gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border-4 border-white bg-zinc-100 shadow-md print:rounded-md print:border-2", children: card.photo_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: card.photo_url,
            alt: "",
            className: "h-full w-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-28 w-full items-center justify-center bg-emerald-50 text-3xl font-black text-emerald-800 print:min-h-20 print:text-xl", children: initials }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 pt-2 text-zinc-950 print:pt-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold uppercase text-emerald-700 print:text-[7px]", children: card.number ?? "N/A" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 text-xl font-black uppercase leading-tight print:text-[13px]", children: card.name }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-3 space-y-1 text-xs print:mt-2 print:space-y-0.5 print:text-[7px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[76px_minmax(0,1fr)] gap-2", children: [
              /* @__PURE__ */ jsx("dt", { className: "font-bold text-zinc-500", children: isStaff ? "Role" : "Course" }),
              /* @__PURE__ */ jsx("dd", { className: "truncate font-semibold", children: card.role ?? "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[76px_minmax(0,1fr)] gap-2", children: [
              /* @__PURE__ */ jsx("dt", { className: "font-bold text-zinc-500", children: "Module" }),
              /* @__PURE__ */ jsx("dd", { className: "truncate font-semibold", children: card.module ?? card.unit ?? "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[76px_minmax(0,1fr)] gap-2", children: [
              /* @__PURE__ */ jsx("dt", { className: "font-bold text-zinc-500", children: "Status" }),
              /* @__PURE__ */ jsx("dd", { className: "truncate font-semibold capitalize", children: card.status ?? "N/A" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("footer", { className: "mt-3 flex items-center justify-between border-t border-zinc-200 pt-2 text-[10px] font-semibold text-zinc-500 print:mt-2 print:pt-1 print:text-[6px]", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Issued ",
          card.issued_at
        ] }),
        /* @__PURE__ */ jsx("span", { children: card.phone ?? card.email ?? "" })
      ] })
    ] })
  ] }) });
}
export {
  SchoolIdCards as default
};
