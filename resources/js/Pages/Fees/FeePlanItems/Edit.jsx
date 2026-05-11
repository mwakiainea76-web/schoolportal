import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

export default function Edit({ item, feePlans }) {
    const { data, setData, put, processing, errors } = useForm({
        fee_plan_id: item?.fee_plan_id ?? "",
        name: item?.name ?? "",
        amount: item?.amount ?? "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("fees.plans.items.update", encodeURIComponent(item.id)), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Fee Plan Item" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    {/* HEADER (UNCHANGED STYLE) */}
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit Fee Plan Item
                    </div>

                    <form onSubmit={submit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* FEE PLAN (FIXED PRESELECT) */}
                            <div>
                                <InputLabel value="Fee Plan" />

                                <SearchSelect
                                    routeName="fee-plans.search"
                                    defaultOptions={feePlans}
                                    placeholder="Search fee plan..."
                                    value={data.fee_plan_id}
                                    onChange={(plan) =>
                                        setData("fee_plan_id", plan.id)
                                    }
                                    error={errors.fee_plan_id}
                                />

                                <InputError message={errors.fee_plan_id} />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel value="Item Name" />

                                <TextInput
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />

                                <InputError message={errors.name} />
                            </div>

                            {/* AMOUNT */}
                            <div>
                                <InputLabel value="Amount" />

                                <TextInput
                                    type="number"
                                    name="amount"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    error={errors.amount}
                                />

                                <InputError message={errors.amount} />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4 border-t border-zinc-100">
                            <Link
                                href={route("fees.plans.items.index")}
                                className="px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {processing ? "Updating..." : "Update Item"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
