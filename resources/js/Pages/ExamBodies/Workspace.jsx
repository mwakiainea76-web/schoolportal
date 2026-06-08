import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SearchSelect from "@/Components/SearchSelect";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

const emptyExamBody = {
    code: "",
    name: "",
    description: "",
};

const emptyCertificationLevel = {
    code: "",
    exam_body_id: "",
    name: "",
    description: "",
    entry_grade: "",
    modules: 1,
};

function durationFromModules(modules) {
    return Math.max(Number.parseInt(modules || 1, 10), 1) * 4;
}

export default function Workspace({
    examBodies = [],
    certificationLevels = [],
    selectedExamBodyId,
}) {
    const [activeExamBodyId, setActiveExamBodyId] = useState(
        selectedExamBodyId ?? examBodies[0]?.id ?? null,
    );
    const [examBodyModal, setExamBodyModal] = useState({ open: false, record: null });
    const [levelModal, setLevelModal] = useState({ open: false, record: null });

    const activeExamBody = useMemo(
        () => examBodies.find((body) => body.id === activeExamBodyId) ?? examBodies[0],
        [activeExamBodyId, examBodies],
    );

    const activeLevels = useMemo(() => {
        if (activeExamBody?.certification_levels) {
            return activeExamBody.certification_levels;
        }

        return certificationLevels.filter(
            (level) => level.exam_body_id === activeExamBody?.id,
        );
    }, [activeExamBody, certificationLevels]);

    const examBodyOptions = useMemo(
        () => examBodies.map((body) => ({
            ...body,
            name: `${body.code} - ${body.name}`,
        })),
        [examBodies],
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
            description: body.description ?? "",
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
            modules: level.modules ?? 1,
        } : {
            ...emptyCertificationLevel,
            exam_body_id: activeExamBody?.id ?? "",
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
            onSuccess: closeExamBodyModal,
        };

        if (examBodyModal.record) {
            examBodyForm.put(
                route("exam.bodies.update", encodeURIComponent(examBodyModal.record.id)),
                options,
            );
            return;
        }

        examBodyForm.post(route("exam.bodies.store"), options);
    };

    const submitLevel = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeLevelModal,
        };

        if (levelModal.record) {
            levelForm.put(
                route("certification-levels.update", encodeURIComponent(levelModal.record.id)),
                options,
            );
            return;
        }

        levelForm.post(route("certification-levels.store"), options);
    };

    const deleteExamBody = (body) => {
        if (!confirm(`Delete ${body.code}?`)) return;

        router.delete(route("exam.bodies.destroy", encodeURIComponent(body.id)), {
            preserveScroll: true,
        });
    };

    const deleteLevel = (level) => {
        if (!confirm(`Delete ${level.name}?`)) return;

        router.delete(
            route("certification-levels.destroy", encodeURIComponent(level.id)),
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Exams & Certifications" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8 grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(280px,0.75fr)_minmax(420px,1.25fr)]">
                    <section>
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Exam Bodies
                            </h1>
                        </div>

                        <div className="min-h-[30rem] rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-xl font-medium text-zinc-600">
                                    Exam Bodies
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {examBodies.length ? (
                                    examBodies.map((body) => {
                                        const isActive = body.id === activeExamBody?.id;

                                        return (
                                            <div
                                                key={body.id}
                                                className={`rounded-lg border px-5 py-5 shadow-sm transition ${
                                                    isActive
                                                        ? "border-emerald-100 bg-emerald-50"
                                                        : "border-zinc-100 bg-zinc-50 hover:bg-white"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveExamBodyId(body.id)}
                                                        className="min-w-0 flex-1 text-left"
                                                    >
                                                        <p className="text-center text-base font-semibold text-slate-700">
                                                            {body.code}
                                                        </p>
                                                        <p className="mt-3 text-sm text-zinc-600">
                                                            {body.name}
                                                        </p>
                                                    </button>

                                                    <div className="flex shrink-0 items-center gap-2 pt-8 text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => openExamBodyModal(body)}
                                                            className="text-emerald-700 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteExamBody(body)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
                                        No exam bodies found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4 flex justify-center">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Certifications
                            </h2>
                        </div>

                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-xl font-medium text-zinc-600">
                                    Levels for {activeExamBody?.code ?? "Exam Body"}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {activeLevels.length ? (
                                    activeLevels.map((level) => (
                                        <div
                                            key={level.id}
                                            className="rounded-lg border border-zinc-100 bg-zinc-50 px-5 py-5 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-center text-base font-semibold text-slate-700">
                                                        {level.name}
                                                    </p>
                                                    <p className="mt-3 text-sm text-zinc-600">
                                                        Duration: {level.duration_in_months ?? durationFromModules(level.modules)} Months
                                                        {" - "}
                                                        Modules: {level.modules ?? 1}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2 pt-8 text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => openLevelModal(level)}
                                                        className="text-emerald-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteLevel(level)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
                                        No certification levels found for this exam body.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <Modal show={examBodyModal.open} onClose={closeExamBodyModal} maxWidth="2xl">
                    <form onSubmit={submitExamBody} className="space-y-5 p-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {examBodyModal.record ? "Edit Exam Body" : "Add Exam Body"}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="exam_body_code" value="Code" />
                                <TextInput
                                    id="exam_body_code"
                                    value={examBodyForm.data.code}
                                    onChange={(event) => examBodyForm.setData("code", event.target.value)}
                                    error={examBodyForm.errors.code}
                                />
                                <InputError message={examBodyForm.errors.code} />
                            </div>

                            <div>
                                <InputLabel htmlFor="exam_body_name" value="Name" />
                                <TextInput
                                    id="exam_body_name"
                                    value={examBodyForm.data.name}
                                    onChange={(event) => examBodyForm.setData("name", event.target.value)}
                                    error={examBodyForm.errors.name}
                                />
                                <InputError message={examBodyForm.errors.name} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="exam_body_description" value="Description" />
                            <TextArea
                                id="exam_body_description"
                                rows="4"
                                value={examBodyForm.data.description}
                                onChange={(event) => examBodyForm.setData("description", event.target.value)}
                                error={examBodyForm.errors.description}
                            />
                            <InputError message={examBodyForm.errors.description} />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
                            <button type="button" onClick={closeExamBodyModal} className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700">
                                Cancel
                            </button>
                            <button disabled={examBodyForm.processing} type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                {examBodyForm.processing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </Modal>

                <Modal show={levelModal.open} onClose={closeLevelModal} maxWidth="5xl">
                    <form onSubmit={submitLevel} className="space-y-5 p-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {levelModal.record ? "Edit Certification Level" : "Add Certification Level"}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel htmlFor="level_code" value="Code" />
                                <TextInput
                                    id="level_code"
                                    value={levelForm.data.code}
                                    onChange={(event) => levelForm.setData("code", event.target.value)}
                                    error={levelForm.errors.code}
                                />
                                <InputError message={levelForm.errors.code} />
                            </div>

                            <div>
                                <InputLabel htmlFor="level_name" value="Certification Level" />
                                <TextInput
                                    id="level_name"
                                    value={levelForm.data.name}
                                    onChange={(event) => levelForm.setData("name", event.target.value)}
                                    error={levelForm.errors.name}
                                />
                                <InputError message={levelForm.errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="level_exam_body_id" value="Exam Body" />
                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={examBodyOptions}
                                    value={levelForm.data.exam_body_id}
                                    selectedLabel={
                                        examBodyOptions.find(
                                            (body) => String(body.id) === String(levelForm.data.exam_body_id),
                                        )?.name
                                    }
                                    placeholder="Search Exam Body..."
                                    onChange={(body) => {
                                        levelForm.setData("exam_body_id", body.id);
                                        setActiveExamBodyId(body.id);
                                    }}
                                    error={levelForm.errors.exam_body_id}
                                    disabled={!examBodyOptions.length}
                                />
                                <InputError message={levelForm.errors.exam_body_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="entry_grade" value="Entry Grade" />
                                <TextInput
                                    id="entry_grade"
                                    value={levelForm.data.entry_grade}
                                    onChange={(event) => levelForm.setData("entry_grade", event.target.value)}
                                    error={levelForm.errors.entry_grade}
                                />
                                <InputError message={levelForm.errors.entry_grade} />
                            </div>

                            <div>
                                <InputLabel htmlFor="modules" value="Modules" />
                                <TextInput
                                    id="modules"
                                    type="number"
                                    min="1"
                                    value={levelForm.data.modules}
                                    onChange={(event) => levelForm.setData("modules", event.target.value)}
                                    error={levelForm.errors.modules}
                                />
                                <p className="mt-1 text-xs text-zinc-500">
                                    Duration: {durationFromModules(levelForm.data.modules)} months
                                </p>
                                <InputError message={levelForm.errors.modules} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="level_description" value="Description" />
                            <TextArea
                                id="level_description"
                                rows="4"
                                value={levelForm.data.description}
                                onChange={(event) => levelForm.setData("description", event.target.value)}
                                error={levelForm.errors.description}
                            />
                            <InputError message={levelForm.errors.description} />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
                            <button type="button" onClick={closeLevelModal} className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700">
                                Cancel
                            </button>
                            <button disabled={levelForm.processing || !activeExamBody} type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                {levelForm.processing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    );
}
