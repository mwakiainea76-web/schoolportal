import { Head, useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import { leaveTypes } from "@/Pages/HR/LeaveRequests/shared";

export default function CreateLeaveRequest({ staffOptions = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_number: staffOptions[0]?.id ?? "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("hr.leave-requests.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Add Leave Request" />

            <div className="mx-auto w-full">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h1 className="text-lg font-semibold text-zinc-950">
                            Add Leave Request
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Submit staff leave details for HR review.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 px-5 py-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Staff Number" required />
                                <SearchSelect
                                    routeName="staffs.search"
                                    defaultOptions={staffOptions}
                                    value={data.staff_number}
                                    onChange={(staff) =>
                                        setData(
                                            "staff_number",
                                            staff.id ?? staff.staff_number ?? "",
                                        )
                                    }
                                    error={errors.staff_number}
                                    placeholder="Search staff number"
                                    minSearchLength={1}
                                    preloadOptions
                                />
                                <InputError message={errors.staff_number} />
                            </div>

                            <div>
                                <InputLabel value="Leave Type" required />
                                <select
                                    value={data.leave_type}
                                    onChange={(event) =>
                                        setData(
                                            "leave_type",
                                            event.target.value,
                                        )
                                    }
                                    className={`w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${
                                        errors.leave_type
                                            ? "border-red-400"
                                            : "border-zinc-200"
                                    }`}
                                >
                                    <option value="">Select leave type</option>
                                    {leaveTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.leave_type} />
                            </div>

                            <div>
                                <InputLabel value="Start Date" required />
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={(event) =>
                                        setData(
                                            "start_date",
                                            event.target.value,
                                        )
                                    }
                                    error={errors.start_date}
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div>
                                <InputLabel value="End Date" required />
                                <TextInput
                                    type="date"
                                    value={data.end_date}
                                    onChange={(event) =>
                                        setData("end_date", event.target.value)
                                    }
                                    error={errors.end_date}
                                />
                                <InputError message={errors.end_date} />
                            </div>
                        </div>

                        <div className="max-w-4xl">
                            <InputLabel value="Reason" required />
                            <textarea
                                value={data.reason}
                                onChange={(event) =>
                                    setData("reason", event.target.value)
                                }
                                rows={4}
                                className={`w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${
                                    errors.reason
                                        ? "border-red-400"
                                        : "border-zinc-200"
                                }`}
                                placeholder="Enter the reason for this leave request"
                            />
                            <InputError message={errors.reason} />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Leave Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
