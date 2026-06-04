import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { L as LoadingSpinner } from "./LoadingSpinner-BaF8hB9B.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "react-spinners";
import "ziggy-js";
function BulkAssign({ feePlans, academicYear, departments }) {
  const hasFeePlans = feePlans.length > 0;
  const hasAcademicYears = academicYear.length > 0;
  const hasDepartments = departments.length > 0;
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
  const hasCertificationLevels = certificationLevels.length > 0;
  const canStartBulkAssignment = hasFeePlans && hasAcademicYears && hasDepartments;
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
    const loadCourseVersions = async () => {
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
    loadCourseVersions();
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
  const toggleCourseVersion = (id) => {
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
      /* @__PURE__ */ jsx("div", { className: "bg-slate-600 py-2 text-center text-sm font-medium text-white", children: "Course Version Fee Assignment" }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-8 p-8", onSubmit: submit, children: [
        !canStartBulkAssignment ? /* @__PURE__ */ jsx("div", { className: "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "You cannot bulk assign fees until a fee plan, an academic year, and a department exist." }) : null,
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Fee Plan" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "fee-plans.search",
                defaultOptions: feePlans,
                placeholder: "Select fee plan...",
                disabled: !hasFeePlans,
                onChange: (item) => setData("fee_plan_id", item.id)
              }
            ),
            !hasFeePlans ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a fee plan first to continue." }) : null,
            /* @__PURE__ */ jsx(InputError, { message: errors.fee_plan_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Academic year" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: academicYear,
                placeholder: "Select academic year...",
                disabled: !hasAcademicYears,
                onChange: (item) => setData("academic_year_id", item.id)
              }
            ),
            !hasAcademicYears ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create an academic year first to continue." }) : null,
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
                disabled: !hasDepartments,
                onChange: (item) => {
                  setData("department_id", item.id);
                  setData("certification_level_id", "");
                }
              }
            ),
            !hasDepartments ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Create a department first to continue." }) : null,
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
                disabled: !data.department_id || !hasCertificationLevels,
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
            loadingLevels && /* @__PURE__ */ jsx(
              LoadingSpinner,
              {
                size: "sm",
                className: "mt-2"
              }
            ),
            !loadingLevels && data.department_id && !hasCertificationLevels ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "No certification levels were found for the selected department." }) : null
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
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Course Versions" }),
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
          loadingRows ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: /* @__PURE__ */ jsx(
            LoadingSpinner,
            {
              size: "md"
            }
          ) }) : rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-sm text-slate-500", children: data.fee_plan_id && data.academic_year_id && data.department_id && data.certification_level_id && data.year_of_study && data.session_number ? "No course versions found for the selected department and certification level." : "Select fee plan, academic year, department, certification level, year of study, and session number to load course versions." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-slate-200 text-sm", children: [
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
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: "Course Version" }),
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
                    onChange: () => toggleCourseVersion(
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
              disabled: processing || !canStartBulkAssignment || !data.visible_course_curriculum_ids.length,
              type: "submit",
              className: "rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50",
              children: processing ? /* @__PURE__ */ jsx(
                LoadingSpinner,
                {
                  size: "sm",
                  className: "mx-auto"
                }
              ) : "Save Course Version Assignments"
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
