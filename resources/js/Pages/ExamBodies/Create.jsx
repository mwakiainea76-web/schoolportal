import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AddExamBody() {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        name: "",
        description: "",
    });

    const handleChange = (e) => setData(e.target.name, e.target.value);

    const submit = (e) => {
        e.preventDefault();
        post(route("exam-bodies.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Exam Body" />

            <div className=" mx-auto w-full">
                <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Add exam body
                    </div>

                    <form className="p-6 space-y-6" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Entity Code"
                                />
                                <TextInput
                                    id="code"
                                    name="code"
                                    isFocused
                                    placeholder="e.g. KNEC, NITA"
                                    value={data.code}
                                    onChange={handleChange}
                                    error={errors.code}
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Entity Name"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Kenya National Examination Council"
                                    value={data.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Description" />
                            <TextArea
                                name="description"
                                rows="4"
                                placeholder="Provide details about the exam body..."
                                value={data.description}
                                onChange={handleChange}
                                error={errors.description}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex justify-between pt-2">
                            <Link
                                href={route("exam-bodies.index")}
                                className="px-5 py-2 bg-zinc-400 text-white rounded-lg text-sm hover:bg-zinc-500 transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" />
                                        Saving...
                                    </>
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
