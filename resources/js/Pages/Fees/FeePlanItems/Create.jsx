import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SearchSelect from "@/Components/SearchSelect";

export default function Create({
    feePlanOptions = [],
    feePlans = [],
    plan,
    setShowModal,
}) {
    const isModal = typeof setShowModal === "function";
    const options = feePlanOptions.length ? feePlanOptions : feePlans;
    const { data, setData, post, processing, errors } = useForm({
        fee_plan_id: plan ? plan.id : "",
        name: "",
        amount: "",
    });

    useEffect(() => {
        if (plan) {
            setData("fee_plan_id", plan.id);
        }
    }, [plan]);

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.plans.items.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("amount", "");
                setData("name", "");
                if (!isModal) {
                    router.visit(route("fees.plans.items.index"));
                }
            },
        });
    };

    const form = (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-slate-600 text-white text-center py-2 text-sm font-medium tracking-wide">
                    ADD FEE PLAN ITEM
                </div>

                <form onSubmit={submit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <InputLabel value="Select Fee Plan" />
                            <SearchSelect
                                value={data.fee_plan_id}
                                placeholder="Search fee plan..."
                                defaultOptions={options}
                                onChange={(plan) => setData("fee_plan_id", plan.id)}
                                disabled={!!plan}
                            />
                            <InputError message={errors.fee_plan_id} />
                        </div>

                        <div>
                            <InputLabel value="Item Name" />
                            <TextInput
                                name="name"
                                value={data.name}
                                placeholder="e.g. Registration Fee"
                                onChange={(e) => setData("name", e.target.value)}
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel value="Amount" />
                            <TextInput
                                type="number"
                                name="amount"
                                value={data.amount}
                                placeholder="e.g. 5000 (Ksh)"
                                onChange={(e) => setData("amount", e.target.value)}
                                error={errors.amount}
                            />
                            <InputError message={errors.amount} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                        <button
                            type="button"
                            onClick={() => {
                                if (isModal) {
                                    setShowModal(false);
                                    return;
                                }

                                setData("fee_plan_id", "");
                                setData("amount", "");
                                setData("name", "");
                            }}
                            className="px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition"
                        >
                            {isModal ? "Cancel" : "Clear"}
                        </button>
                        {!isModal ? (
                            <Link
                                href={route("fees.plans.items.index")}
                                className="px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition"
                            >
                                Back
                            </Link>
                        ) : null}
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
                                "Save Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (isModal) {
        return form;
    }

    return (
        <>
            <Head title="Add Fee Plan Item" />
            <div className="mx-auto w-full max-w-3xl">{form}</div>
        </>
    );
}
