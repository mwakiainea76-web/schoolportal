import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function BulkAssign({ feePlans, academicYear, departments }) {
  const { data, setData, post, processing, errors } = useForm({
    fee_plan_id: "",
    academic_year_id: "",
    department_id: "",
    certification_level_id: "",
    year_of_study: "",
    session_number: "",
    selected_course_curriculum_ids: [],
    visible_course_curriculum_ids: []
  });
  const [certificationLevels, setCertificationLevels] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingRows, setLoadingRows] = useState(false);
  useEffect(() => {
    if (!data.department_id) {
      setCertificationLevels([]);
      setRows([]);
      setData("certification_level_id", "");
      setData("selected_course_curriculum_ids", []);
      setData("visible_course_curriculum_ids", []);
      return;
    }
    const loadCertificationLevels = async () => {
      setLoadingLevels(true);
      try {
        const response = await fetch(
          route("fees.assignments.bulk.certification-levels", {
            department_id: data.department_id
          })
        );
        const result = await response.json();
        setCertificationLevels(result);
      } catch (error) {
        console.error("Failed to load certification levels", error);
        setCertificationLevels([]);
      } finally {
        setLoadingLevels(false);
      }
    };
    loadCertificationLevels();
  }, [data.department_id]);
  useEffect(() => {
    if (!data.fee_plan_id || !data.academic_year_id || !data.department_id || !data.certification_level_id || !data.year_of_study || !data.session_number) {
      setRows([]);
      setData("selected_course_curriculum_ids", []);
      setData("visible_course_curriculum_ids", []);
      return;
    }
    const loadCurriculums = async () => {
      setLoadingRows(true);
      try {
        const response = await fetch(
          route("fees.assignments.bulk.curriculums", {
            fee_plan_id: data.fee_plan_id,
            academic_year_id: data.academic_year_id,
            department_id: data.department_id,
            certification_level_id: data.certification_level_id,
            year_of_study: data.year_of_study,
            session_number: data.session_number
          })
        );
        const result = await response.json();
        const loadedRows = result.rows ?? [];
        setRows(loadedRows);
        setData(
          "visible_course_curriculum_ids",
          loadedRows.map((row) => row.id)
        );
        setData(
          "selected_course_curriculum_ids",
          loadedRows.filter((row) => row.is_assigned).map((row) => row.id)
        );
      } catch (error) {
        console.error("Failed to load curriculums", error);
        setRows([]);
        setData("selected_course_curriculum_ids", []);
        setData("visible_course_curriculum_ids", []);
      } finally {
        setLoadingRows(false);
      }
    };
    loadCurriculums();
  }, [
    data.fee_plan_id,
    data.academic_year_id,
    data.department_id,
    data.certification_level_id,
    data.year_of_study,
    data.session_number
  ]);
  const selectedIds = data.selected_course_curriculum_ids.map(String);
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(String(row.id)));
  const toggleCurriculum = (id) => {
    const normalizedId = String(id);
    const updated = selectedIds.includes(normalizedId) ? data.selected_course_curriculum_ids.filter(
      (item) => String(item) !== normalizedId
    ) : [...data.selected_course_curriculum_ids, id];
    setData("selected_course_curriculum_ids", updated);
  };
  const toggleAll = () => {
    setData(
      "selected_course_curriculum_ids",
      allVisibleSelected ? [] : rows.map((row) => row.id)
    );
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("fees.assignments.bulk.assign"), {
      preserveScroll: true,
      preserveState: false
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Bulk Fee Assignment" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-600 py-2 text-center text-sm font-medium text-white", children: "Curriculum Fee Assignment" }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-8 p-8", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Fee Plan" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "fee-plans.search",
                defaultOptions: feePlans,
                placeholder: "Select fee plan...",
                onChange: (item) => setData("fee_plan_id", item.id)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.fee_plan_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: academicYear,
                placeholder: "Select academic year...",
                onChange: (item) => setData("academic_year_id", item.id)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.academic_year_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Department" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "departments.search",
                defaultOptions: departments,
                placeholder: "Select department...",
                onChange: (item) => {
                  setData("department_id", item.id);
                  setData("certification_level_id", "");
                }
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.department_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Certification Level" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: data.department_id ? "fees.assignments.bulk.certification-levels" : null,
                routeParams: {
                  department_id: data.department_id
                },
                defaultOptions: certificationLevels,
                placeholder: data.department_id ? "Select certification level..." : "Choose department first...",
                onChange: (item) => setData(
                  "certification_level_id",
                  item.id
                )
              },
              data.department_id || "no-department"
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: errors.certification_level_id
              }
            ),
            loadingLevels && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Loading certification levels..." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Year Of Study" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                value: data.year_of_study,
                onChange: (e) => setData("year_of_study", e.target.value),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.year_of_study })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Session Number" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "1",
                value: data.session_number,
                onChange: (e) => setData(
                  "session_number",
                  e.target.value
                ),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.session_number })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b bg-slate-50 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Curriculums" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Existing assignments for the selected fee plan and session come pre-checked." })
            ] }),
            rows.length > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: toggleAll,
                className: "rounded bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300",
                children: allVisibleSelected ? "Clear All" : "Select All"
              }
            )
          ] }),
          loadingRows ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-sm text-slate-500", children: "Loading curriculums..." }) : rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-sm text-slate-500", children: data.fee_plan_id && data.academic_year_id && data.department_id && data.certification_level_id && data.year_of_study && data.session_number ? "No curriculums found for the selected department and certification level." : "Select fee plan, academic year, department, certification level, year of study, and session number to load curriculums." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-slate-200 text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-white", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: allVisibleSelected,
                  onChange: toggleAll
                }
              ) }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Course" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Curriculum" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Certification Level" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Current Fee Plan" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Year of study" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: rows.map((row) => {
              const checked = selectedIds.includes(
                String(row.id)
              );
              return /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked,
                    onChange: () => toggleCurriculum(
                      row.id
                    )
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-700", children: row.course_name }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-700", children: row.curriculum_name }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-700", children: row.certification_level_name }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-700", children: row.assigned_fee_plan_name || "" }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-slate-700", children: [
                  "Year",
                  " ",
                  row.year_of_study,
                  " ",
                  "Session",
                  row.session_number
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: row.is_assigned ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700", children: "Already assigned" }) : row.has_other_fee_plan ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700", children: "Assigned to another fee plan" }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600", children: "Not assigned" }) })
              ] }, row.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.visible_course_curriculum_ids
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.selected_course_curriculum_ids
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.assignments.index"),
              className: "rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: processing || !data.visible_course_curriculum_ids.length,
              type: "submit",
              className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50",
              children: processing ? "Saving..." : "Save Curriculum Assignments"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BulkAssign as default
};
