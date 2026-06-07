import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { u as useRbac, A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import CourseWorkspaceTabs from "./CourseWorkspaceTabs-D8YFDE67.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function CurriculumIndex({
  curricula,
  curriculumOptions = []
}) {
  const [sortField, setSortField] = useState(curricula.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    curricula.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { can } = useRbac();
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("curriculums.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "^" : "v";
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("curriculums.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this curriculum?")) {
      return;
    }
    router.delete(route("curriculums.destroy", { curriculum: id }), {
      preserveState: true,
      replace: true
    });
  };
  const handleDisable = (id) => {
    if (!confirm("Disable this curriculum?")) {
      return;
    }
    router.patch(route("curriculums.disable", { curriculum: id }), {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  const handleReactivate = (id) => {
    if (!confirm("Reactivate this curriculum?")) {
      return;
    }
    router.patch(route("curriculums.reactivate", { curriculum: id }), {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculums" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(CourseWorkspaceTabs, { activeTab: "curriculums" }) }),
      can("curriculums.view") ? /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: curriculumOptions,
                placeholder: "Select curriculum ...",
                onChange: (body) => setSearchTerm(body.name)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
                type: "submit",
                children: "Search"
              }
            )
          ]
        }
      ) : null,
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: curricula,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("name"),
                  className: "cursor-pointer",
                  children: [
                    "Name ",
                    renderArrow("name")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
              /* @__PURE__ */ jsx(THdata, { children: "Status" }),
              can("curriculums.edit") || can("curriculums.delete") ? /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) }) : null
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: curricula?.data?.length ? curricula.data.map((curriculum) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.name }),
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.exam_body ? [curriculum.exam_body.name].filter(Boolean).join(" - ") : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `rounded px-2 py-1 text-xs font-semibold ${curriculum.is_active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`,
                  children: curriculum.is_active ? "Active" : "Disabled"
                }
              ) }),
              can("curriculums.edit") || can("curriculums.delete") ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-x-4 gap-y-2", children: [
                can("curriculums.edit") ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "curriculums.edit",
                      {
                        curriculum: curriculum.id
                      }
                    ),
                    className: "whitespace-nowrap text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ) : null,
                can("curriculums.edit") ? curriculum.is_active ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDisable(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-amber-600 hover:underline",
                    children: "Disable"
                  }
                ) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleReactivate(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-emerald-600 hover:underline",
                    children: "Activate"
                  }
                ) : null,
                can("curriculums.delete") ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-red-600 hover:underline",
                    children: "Delete"
                  }
                ) : null
              ] }) }) : null
            ] }, curriculum.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "5", className: "text-center py-4", children: "No curriculums found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CurriculumIndex as default
};
