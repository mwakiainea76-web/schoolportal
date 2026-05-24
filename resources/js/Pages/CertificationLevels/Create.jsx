import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

export default function AddCertificationLevel({
    examBodies,
    selectedExamBodyId,
    selectedExamBody,
}) {
    const hasExamBodies = examBodies.length > 0;

    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        exam_body_id: selectedExamBodyId ?? "",
        name: "",
        description: "",
        entry_grade: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("certification-levels.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("code", "");
                setData("name", "");
                setData("description", "");
                setData("entry_grade", "");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Certification Level" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Add certification level
                    </div>
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {!hasExamBodies ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot create a certification level until an exam body exists.
                            </div>
                        ) : null}
                        {selectedExamBody ? (
                            <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                Creating a certification level for{" "}
                                <span className="font-semibold">
                                    {selectedExamBody.name}
                                </span>
                                {selectedExamBody.code
                                    ? ` (${selectedExamBody.code})`
                                    : ""}
                                .
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:grid-cols-3">
                            <div>
                                <InputLabel
                                    htmlFor="exam_body_id"
                                    value="Exam Body "
                                />

                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={examBodies}
                                    placeholder="Search Exam Body..."
                                    disabled={!hasExamBodies}
                                    onChange={(body) =>
                                        setData("exam_body_id", body.id)
                                    }
                                />
                                {!hasExamBodies ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create an exam body first to continue.
                                    </p>
                                ) : null}

                                <InputError
                                    message={errors.exam_body_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Certification Code"
                                />
                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    className={`mt-1 block w-full ${
                                        errors.code
                                            ? "border-red-400"
                                            : "border-zinc-200"
                                    }`}
                                    placeholder="e.g. KNEC-ART, NITA-CERT, CDACC-DIP"
                                    isFocused={true}
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.code}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Certification Name"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    className={`mt-1 block w-full ${
                                        errors.name
                                            ? "border-red-400"
                                            : "border-zinc-200"
                                    }`}
                                    placeholder="e.g. Artisan, Certificate, Diploma"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="entry_grade"
                                    value="Entry Grade"
                                />
                                <TextInput
                                    id="entry_grade"
                                    type="text"
                                    name="entry_grade"
                                    className={`mt-1 block w-full ${
                                        errors.entry_grade
                                            ? "border-red-400"
                                            : "border-zinc-200"
                                    }`}
                                    placeholder="e.g. C, C+"
                                    value={data.entry_grade}
                                    onChange={(e) =>
                                        setData("entry_grade", e.target.value)
                                    }
                                />
                                {/* Fixed: was showing errors.name instead of errors.entry_grade */}
                                <InputError
                                    message={errors.entry_grade}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="description"
                                value="Certification Description"
                            />
                            <TextArea
                                name="description"
                                rows="5"
                                className={`mt-1 block w-full ${
                                    errors.description
                                        ? "border-red-400"
                                        : "border-zinc-200"
                                }`}
                                placeholder="Provide details about the certification level..."
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("certification-levels.index", selectedExamBodyId ? {
                                    exam_body_id: selectedExamBodyId,
                                } : {})}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !hasExamBodies}
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        Saving
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                    </span>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
