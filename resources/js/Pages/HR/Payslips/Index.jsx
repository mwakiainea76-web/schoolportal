import { Head, router } from "@inertiajs/react";
import { useState } from "react";

import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";

const money = (value) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

export default function MonthlyPayslips({ filters, staffOptions, payslip }) {
    const [staffNumber, setStaffNumber] = useState(filters?.staff_number ?? "");
    const [month, setMonth] = useState(filters?.month ?? "");

    const submit = (event) => {
        event.preventDefault();

        router.get(
            route("hr.payslips.index"),
            {
                staff_number: staffNumber,
                month,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Monthly Payslips" />

            <div className="mx-auto w-full space-y-5">
                <div className="overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm print:hidden">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h1 className="text-lg font-semibold text-zinc-950">
                            Monthly Payslips
                        </h1>
                        <p className="text-sm text-zinc-500">
                            View staff pay, loan reductions, and net monthly pay.
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-5 py-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <InputLabel value="Staff Number" required />
                                <SearchSelect
                                    routeName="staffs.search"
                                    value={staffNumber}
                                    selectedLabel={staffOptions?.[0]?.name}
                                    defaultOptions={staffOptions ?? []}
                                    onChange={(staff) =>
                                        setStaffNumber(
                                            staff.id ?? staff.staff_number ?? "",
                                        )
                                    }
                                    placeholder="Search staff number"
                                    minSearchLength={1}
                                    preloadOptions
                                />
                            </div>

                            <div>
                                <InputLabel value="Month" required />
                                <TextInput
                                    type="month"
                                    value={month}
                                    onChange={(event) =>
                                        setMonth(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                type="submit"
                                className="min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                View Payslip
                            </button>
                        </div>
                    </form>
                </div>

                {payslip ? (
                    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm print:border-0 print:shadow-none">
                        <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase text-emerald-700">
                                    Payslip
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                                    {payslip.period}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="min-h-[40px] rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 print:hidden"
                            >
                                Print
                            </button>
                        </div>

                        <div className="grid grid-cols-1 border-b border-zinc-200 md:grid-cols-2">
                            <div className="space-y-2 px-6 py-5">
                                <h3 className="text-sm font-semibold text-zinc-900">
                                    Staff Details
                                </h3>
                                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                    <div>
                                        <dt className="text-zinc-500">Name</dt>
                                        <dd className="font-medium text-zinc-900">
                                            {payslip.staff.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">
                                            Staff Number
                                        </dt>
                                        <dd className="font-medium text-zinc-900">
                                            {payslip.staff.staff_number}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">
                                            Department
                                        </dt>
                                        <dd className="font-medium text-zinc-900">
                                            {payslip.staff.department ?? "N/A"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-zinc-500">
                                            Designation
                                        </dt>
                                        <dd className="font-medium text-zinc-900">
                                            {payslip.staff.designation ?? "N/A"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="border-t border-zinc-200 px-6 py-5 md:border-l md:border-t-0">
                                <h3 className="text-sm font-semibold text-zinc-900">
                                    Pay Summary
                                </h3>
                                <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500">
                                            Gross Pay
                                        </span>
                                        <span className="font-semibold text-zinc-900">
                                            {money(payslip.gross_pay)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500">
                                            Deductions
                                        </span>
                                        <span className="font-semibold text-red-600">
                                            {money(payslip.total_deductions)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base">
                                        <span className="font-semibold text-zinc-900">
                                            Net Pay
                                        </span>
                                        <span className="font-bold text-emerald-700">
                                            {money(payslip.net_pay)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="px-6 py-5">
                                <h3 className="text-sm font-semibold text-zinc-900">
                                    Earnings
                                </h3>
                                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
                                    {payslip.earnings.map((earning) => (
                                        <div
                                            key={earning.label}
                                            className="flex items-center justify-between px-4 py-3 text-sm"
                                        >
                                            <span className="text-zinc-700">
                                                {earning.label}
                                            </span>
                                            <span className="font-semibold text-zinc-900">
                                                {money(earning.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-zinc-200 px-6 py-5 md:border-l md:border-t-0">
                                <h3 className="text-sm font-semibold text-zinc-900">
                                    Deductions
                                </h3>
                                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
                                    {payslip.deductions.length ? (
                                        payslip.deductions.map((deduction) => (
                                            <div
                                                key={deduction.id}
                                                className="flex items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 text-sm last:border-b-0"
                                            >
                                                <div>
                                                    <p className="font-medium text-zinc-800">
                                                        {deduction.label}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {deduction.start_date}
                                                        {deduction.end_date
                                                            ? ` to ${deduction.end_date}`
                                                            : ""}
                                                    </p>
                                                </div>
                                                <span className="font-semibold text-red-600">
                                                    {money(deduction.amount)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-zinc-500">
                                            No deductions for this month.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
                        Select a staff number and month to view a payslip.
                    </div>
                )}
            </div>
        </>
    );
}
