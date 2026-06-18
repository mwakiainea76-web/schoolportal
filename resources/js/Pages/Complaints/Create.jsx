import { Head, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("student.complaints.store"));
    };

    return (
        <>
            <Head title="Submit Complaint" />

            <div className="w-full">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-zinc-950">
                        Submit a Complaint
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Describe your issue below. Admin will review and respond.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm"
                >
                    <div className="space-y-5">
                        <div>
                            <InputLabel value="Subject" required />
                            <TextInput
                                value={data.subject}
                                onChange={(e) =>
                                    setData("subject", e.target.value)
                                }
                                placeholder="Brief title of your complaint"
                                className="mt-1 w-full"
                                error={errors.subject}
                            />
                            <InputError message={errors.subject} />
                        </div>

                        <div>
                            <InputLabel value="Description" required />
                            <TextArea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Describe your issue in detail..."
                                className="mt-1 w-full"
                                rows={6}
                                error={errors.description}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
                        <PrimaryButton disabled={processing}>
                            Submit Complaint
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={() => router.get(route("student.complaints.index"))}
                            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
