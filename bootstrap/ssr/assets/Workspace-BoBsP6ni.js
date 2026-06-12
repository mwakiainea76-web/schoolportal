import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "@headlessui/react";
import "ziggy-js";
const emptyExamBody = {
  code: "",
  name: "",
  description: ""
};
const emptyCertificationLevel = {
  code: "",
  exam_body_id: "",
  name: "",
  description: "",
  entry_grade: "",
  modules: 1
};
function durationFromModules(modules) {
  return Math.max(Number.parseInt(modules || 1, 10), 1) * 4;
}
function Workspace({
  examBodies = [],
  certificationLevels = [],
  selectedExamBodyId
}) {
  const [activeExamBodyId, setActiveExamBodyId] = useState(
    selectedExamBodyId ?? examBodies[0]?.id ?? null
  );
  const [examBodyModal, setExamBodyModal] = useState({ open: false, record: null });
  const [levelModal, setLevelModal] = useState({ open: false, record: null });
  const activeExamBody = useMemo(
    () => examBodies.find((body) => body.id === activeExamBodyId) ?? examBodies[0],
    [activeExamBodyId, examBodies]
  );
  const activeLevels = useMemo(() => {
    if (activeExamBody?.certification_levels) {
      return activeExamBody.certification_levels;
    }
    return certificationLevels.filter(
      (level) => level.exam_body_id === activeExamBody?.id
    );
  }, [activeExamBody, certificationLevels]);
  const examBodyOptions = useMemo(
    () => examBodies.map((body) => ({
      ...body,
      name: `${body.code} - ${body.name}`
    })),
    [examBodies]
  );
  const examBodyForm = useForm(emptyExamBody);
  const levelForm = useForm(emptyCertificationLevel);
  useEffect(() => {
    if (selectedExamBodyId) {
      setActiveExamBodyId(selectedExamBodyId);
    } else if (!activeExamBodyId && examBodies[0]?.id) {
      setActiveExamBodyId(examBodies[0].id);
    }
  }, [selectedExamBodyId, examBodies]);
  const openExamBodyModal = (body = null) => {
    examBodyForm.clearErrors();
    examBodyForm.setData(body ? {
      code: body.code ?? "",
      name: body.name ?? "",
      description: body.description ?? ""
    } : emptyExamBody);
    setExamBodyModal({ open: true, record: body });
  };
  const closeExamBodyModal = () => {
    setExamBodyModal({ open: false, record: null });
    examBodyForm.reset();
    examBodyForm.clearErrors();
  };
  const openLevelModal = (level = null) => {
    levelForm.clearErrors();
    levelForm.setData(level ? {
      code: level.code ?? "",
      exam_body_id: level.exam_body_id ?? activeExamBody?.id ?? "",
      name: level.name ?? "",
      description: level.description ?? "",
      entry_grade: level.entry_grade ?? "",
      modules: level.modules ?? 1
    } : {
      ...emptyCertificationLevel,
      exam_body_id: activeExamBody?.id ?? ""
    });
    setLevelModal({ open: true, record: level });
  };
  const closeLevelModal = () => {
    setLevelModal({ open: false, record: null });
    levelForm.reset();
    levelForm.clearErrors();
  };
  const submitExamBody = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: closeExamBodyModal
    };
    if (examBodyModal.record) {
      examBodyForm.put(
        route("exam.bodies.update", encodeURIComponent(examBodyModal.record.id)),
        options
      );
      return;
    }
    examBodyForm.post(route("exam.bodies.store"), options);
  };
  const submitLevel = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: closeLevelModal
    };
    if (levelModal.record) {
      levelForm.put(
        route("certification-levels.update", encodeURIComponent(levelModal.record.id)),
        options
      );
      return;
    }
    levelForm.post(route("certification-levels.store"), options);
  };
  const deleteExamBody = (body) => {
    if (!confirm(`Delete ${body.code}?`)) return;
    router.delete(route("exam.bodies.destroy", encodeURIComponent(body.id)), {
      preserveScroll: true
    });
  };
  const deleteLevel = (level) => {
    if (!confirm(`Delete ${level.name}?`)) return;
    router.delete(
      route("certification-levels.destroy", encodeURIComponent(level.id)),
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Exams & Certifications" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]", children: [
        /* @__PURE__ */ jsxs("section", { className: "w-full min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-slate-900", children: "Exam Bodies" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-h-[30rem] w-full rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-zinc-600", children: "Exam Bodies" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openExamBodyModal(),
                  className: "shrink-0 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800",
                  children: "Add Exam Board"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: examBodies.length ? examBodies.map((body) => {
              const isActive = body.id === activeExamBody?.id;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: `rounded-lg border px-5 py-5 shadow-sm transition ${isActive ? "border-emerald-100 bg-emerald-50" : "border-zinc-100 bg-zinc-50 hover:bg-white"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setActiveExamBodyId(body.id),
                        className: "min-w-0 flex-1 text-left",
                        children: [
                          /* @__PURE__ */ jsx("p", { className: "text-center text-base font-semibold text-slate-700", children: body.code }),
                          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-zinc-600", children: body.name })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2 pt-8 text-sm", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => openExamBodyModal(body),
                          className: "text-emerald-700 hover:underline",
                          children: "Edit"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => deleteExamBody(body),
                          className: "text-red-600 hover:underline",
                          children: "Delete"
                        }
                      )
                    ] })
                  ] })
                },
                body.id
              );
            }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500", children: "No exam bodies found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "w-full min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Certifications" }) }),
          /* @__PURE__ */ jsxs("div", { className: "w-full rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xl font-medium text-zinc-600", children: [
                "Levels for ",
                activeExamBody?.code ?? "Exam Body"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openLevelModal(),
                  disabled: !activeExamBody,
                  className: "shrink-0 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300",
                  children: "Add Certification"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activeLevels.length ? activeLevels.map((level) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "rounded-lg border border-zinc-100 bg-zinc-50 px-5 py-5 shadow-sm",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-center text-base font-semibold text-slate-700", children: level.name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-zinc-600", children: [
                      "Duration: ",
                      level.duration_in_months ?? durationFromModules(level.modules),
                      " Months",
                      " - ",
                      "Modules: ",
                      level.modules ?? 1
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2 pt-8 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => openLevelModal(level),
                        className: "text-emerald-700 hover:underline",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteLevel(level),
                        className: "text-red-600 hover:underline",
                        children: "Delete"
                      }
                    )
                  ] })
                ] })
              },
              level.id
            )) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500", children: "No certification levels found for this exam body." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Modal, { show: examBodyModal.open, onClose: closeExamBodyModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitExamBody, className: "space-y-5 p-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: examBodyModal.record ? "Edit Exam Body" : "Add Exam Body" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "exam_body_code", value: "Code" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "exam_body_code",
                value: examBodyForm.data.code,
                onChange: (event) => examBodyForm.setData("code", event.target.value),
                error: examBodyForm.errors.code
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: examBodyForm.errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "exam_body_name", value: "Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "exam_body_name",
                value: examBodyForm.data.name,
                onChange: (event) => examBodyForm.setData("name", event.target.value),
                error: examBodyForm.errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: examBodyForm.errors.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "exam_body_description", value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              id: "exam_body_description",
              rows: "4",
              value: examBodyForm.data.description,
              onChange: (event) => examBodyForm.setData("description", event.target.value),
              error: examBodyForm.errors.description
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: examBodyForm.errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 border-t border-zinc-100 pt-5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: closeExamBodyModal, className: "rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { disabled: examBodyForm.processing, type: "submit", className: "rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", children: examBodyForm.processing ? "Saving..." : "Save" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Modal, { show: levelModal.open, onClose: closeLevelModal, maxWidth: "5xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitLevel, className: "space-y-5 p-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: levelModal.record ? "Edit Certification Level" : "Add Certification Level" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "level_code", value: "Code" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "level_code",
                value: levelForm.data.code,
                onChange: (event) => levelForm.setData("code", event.target.value),
                error: levelForm.errors.code
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "level_name", value: "Certification Level" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "level_name",
                value: levelForm.data.name,
                onChange: (event) => levelForm.setData("name", event.target.value),
                error: levelForm.errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "level_exam_body_id", value: "Exam Body" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "exam.bodies.search",
                defaultOptions: examBodyOptions,
                value: levelForm.data.exam_body_id,
                selectedLabel: examBodyOptions.find(
                  (body) => String(body.id) === String(levelForm.data.exam_body_id)
                )?.name,
                placeholder: "Search Exam Body...",
                onChange: (body) => {
                  levelForm.setData("exam_body_id", body.id);
                  setActiveExamBodyId(body.id);
                },
                error: levelForm.errors.exam_body_id,
                disabled: !examBodyOptions.length
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.exam_body_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "entry_grade", value: "Entry Grade" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "entry_grade",
                value: levelForm.data.entry_grade,
                onChange: (event) => levelForm.setData("entry_grade", event.target.value),
                error: levelForm.errors.entry_grade
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.entry_grade })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "modules", value: "Modules" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "modules",
                type: "number",
                min: "1",
                value: levelForm.data.modules,
                onChange: (event) => levelForm.setData("modules", event.target.value),
                error: levelForm.errors.modules
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
              "Duration: ",
              durationFromModules(levelForm.data.modules),
              " months"
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.modules })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "level_description", value: "Description" }),
          /* @__PURE__ */ jsx(
            TextArea,
            {
              id: "level_description",
              rows: "4",
              value: levelForm.data.description,
              onChange: (event) => levelForm.setData("description", event.target.value),
              error: levelForm.errors.description
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: levelForm.errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 border-t border-zinc-100 pt-5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: closeLevelModal, className: "rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { disabled: levelForm.processing || !activeExamBody, type: "submit", className: "rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", children: levelForm.processing ? "Saving..." : "Save" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Workspace as default
};
