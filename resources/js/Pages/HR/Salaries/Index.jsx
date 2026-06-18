import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/Components/TablePagination";
import TextInput from "@/Components/TextInput";

const money = (value) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

export default function SalaryManagement({ staffs, loanReductions, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const { data, setData, patch, processing, errors, reset } = useForm({
        staff_number: "",
        salary: "",
    });
    const {
        data: loanData,
        setData: setLoanData,
        post: postLoan,
        processing: loanProcessing,
        errors: loanErrors,
        reset: resetLoan,
    } = useForm({
        staff_number: "",
        loan_name: "",
        principal_amount: "",
        monthly_reduction: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        notes: "",
    });

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route("hr.salaries.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

    const submitSalary = (event) => {
        event.preventDefault();

        patch(route("hr.salaries.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const submitLoanReduction = (event) => {
        event.preventDefault();

        postLoan(route("hr.salaries.loan-reductions.store"), {
            preserveScroll: true,
            onSuccess: () => resetLoan(),
        });
    };

    return (
        <>
            <Head title="Salary Management" />

            <div className="mx-auto w-full space-y-5">
                <div className="overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h1 className="text-lg font-semibold text-zinc-950">
                            Salary Management
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Search staff and update their current salary record.
                        </p>
                    </div>

                    <form onSubmit={submitSalary} className="space-y-5 px-5 py-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Staff Number" required />
                                <SearchSelect
                                    routeName="staffs.search"
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
                                <InputLabel value="Salary" required />
                                <TextInput
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.salary}
                                    onChange={(event) =>
                                        setData("salary", event.target.value)
                                    }
                                    error={errors.salary}
                                    placeholder="e.g. 85000"
                                />
                                <InputError message={errors.salary} />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-[42px] w-full rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? "Updating..." : "Update Salary"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-zinc-950">
                            Loans Reduction
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Add staff loan deductions to be reduced from salary.
                        </p>
                    </div>

                    <form
                        onSubmit={submitLoanReduction}
                        className="space-y-5 px-5 py-5"
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Staff Number" required />
                                <SearchSelect
                                    routeName="staffs.search"
                                    value={loanData.staff_number}
                                    onChange={(staff) =>
                                        setLoanData(
                                            "staff_number",
                                            staff.id ?? staff.staff_number ?? "",
                                        )
                                    }
                                    error={loanErrors.staff_number}
                                    placeholder="Search staff number"
                                    minSearchLength={1}
                                    preloadOptions
                                />
                                <InputError message={loanErrors.staff_number} />
                            </div>

                            <div>
                                <InputLabel value="Loan Name" required />
                                <TextInput
                                    value={loanData.loan_name}
                                    onChange={(event) =>
                                        setLoanData(
                                            "loan_name",
                                            event.target.value,
                                        )
                                    }
                                    error={loanErrors.loan_name}
                                    placeholder="e.g. Sacco Loan"
                                />
                                <InputError message={loanErrors.loan_name} />
                            </div>

                            <div>
                                <InputLabel value="Loan Amount" required />
                                <TextInput
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={loanData.principal_amount}
                                    onChange={(event) =>
                                        setLoanData(
                                            "principal_amount",
                                            event.target.value,
                                        )
                                    }
                                    error={loanErrors.principal_amount}
                                    placeholder="e.g. 50000"
                                />
                                <InputError
                                    message={loanErrors.principal_amount}
                                />
                            </div>

                            <div>
                                <InputLabel value="Monthly Reduction" required />
                                <TextInput
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={loanData.monthly_reduction}
                                    onChange={(event) =>
                                        setLoanData(
                                            "monthly_reduction",
                                            event.target.value,
                                        )
                                    }
                                    error={loanErrors.monthly_reduction}
                                    placeholder="e.g. 5000"
                                />
                                <InputError
                                    message={loanErrors.monthly_reduction}
                                />
                            </div>

                            <div>
                                <InputLabel value="Start Date" required />
                                <TextInput
                                    type="date"
                                    value={loanData.start_date}
                                    onChange={(event) =>
                                        setLoanData(
                                            "start_date",
                                            event.target.value,
                                        )
                                    }
                                    error={loanErrors.start_date}
                                />
                                <InputError message={loanErrors.start_date} />
                            </div>

                            <div>
                                <InputLabel value="End Date" />
                                <TextInput
                                    type="date"
                                    value={loanData.end_date}
                                    onChange={(event) =>
                                        setLoanData(
                                            "end_date",
                                            event.target.value,
                                        )
                                    }
                                    error={loanErrors.end_date}
                                />
                                <InputError message={loanErrors.end_date} />
                            </div>
                        </div>

                        <div className="max-w-4xl">
                            <InputLabel value="Notes" />
                            <textarea
                                value={loanData.notes}
                                onChange={(event) =>
                                    setLoanData("notes", event.target.value)
                                }
                                rows={3}
                                className={`w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${
                                    loanErrors.notes
                                        ? "border-red-400"
                                        : "border-zinc-200"
                                }`}
                                placeholder="Optional loan reference or notes"
                            />
                            <InputError message={loanErrors.notes} />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loanProcessing}
                                className="min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {loanProcessing
                                    ? "Saving..."
                                    : "Add Loan Reduction"}
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-zinc-900">
                            Loan Reduction Records
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Active and recorded loan deductions for staff.
                        </p>
                    </div>

                    <Table pagination={loanReductions}>
                        <Thead>
                            <THdata>Staff</THdata>
                            <THdata>Loan</THdata>
                            <THdata>Loan Amount</THdata>
                            <THdata>Monthly Reduction</THdata>
                            <THdata>Start Date</THdata>
                            <THdata>End Date</THdata>
                            <THdata>Status</THdata>
                        </Thead>
                        <Tbody>
                            {loanReductions?.data?.length ? (
                                loanReductions.data.map((reduction) => (
                                    <Trow key={reduction.id}>
                                        <Tdata>
                                            <div>
                                                <p className="font-medium text-zinc-800">
                                                    {reduction.staff?.name ??
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {reduction.staff
                                                        ?.staff_number ?? "N/A"}
                                                </p>
                                            </div>
                                        </Tdata>
                                        <Tdata>{reduction.loan_name}</Tdata>
                                        <Tdata>
                                            {money(reduction.principal_amount)}
                                        </Tdata>
                                        <Tdata className="font-semibold text-red-600">
                                            {money(reduction.monthly_reduction)}
                                        </Tdata>
                                        <Tdata>{reduction.start_date}</Tdata>
                                        <Tdata>{reduction.end_date ?? "N/A"}</Tdata>
                                        <Tdata>
                                            <span className="capitalize">
                                                {reduction.status}
                                            </span>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="7" className="py-4 text-center">
                                        No loan reductions found.
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </div>

                <div>
                    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-zinc-900">
                                Staff Salary Records
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Current salary values from staff profiles.
                            </p>
                        </div>

                        <form
                            onSubmit={submitSearch}
                            className="flex w-full gap-2 md:max-w-md"
                        >
                            <TextInput
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search staff salary records"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <Table pagination={staffs}>
                        <Thead>
                            <THdata>Staff No</THdata>
                            <THdata>Name</THdata>
                            <THdata>Designation</THdata>
                            <THdata>Department</THdata>
                            <THdata>Status</THdata>
                            <THdata>Salary</THdata>
                        </Thead>
                        <Tbody>
                            {staffs?.data?.length ? (
                                staffs.data.map((staff) => (
                                    <Trow key={staff.id}>
                                        <Tdata>{staff.staff_number}</Tdata>
                                        <Tdata>
                                            <div>
                                                <p className="font-medium text-zinc-800">
                                                    {staff.name}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {staff.email}
                                                </p>
                                            </div>
                                        </Tdata>
                                        <Tdata>{staff.designation ?? "N/A"}</Tdata>
                                        <Tdata>{staff.department ?? "N/A"}</Tdata>
                                        <Tdata>
                                            <span className="capitalize">
                                                {staff.staff_status ?? "N/A"}
                                            </span>
                                        </Tdata>
                                        <Tdata className="font-semibold text-zinc-800">
                                            {money(staff.salary)}
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="6" className="py-4 text-center">
                                        No salary records found.
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}
const Table = ({ children, pagination, ...props }) => (
    <>
        <ShadTable {...props}>{children}</ShadTable>
        <TablePagination pagination={pagination} />
    </>
);
const Thead = ({ children, ...props }) => (
    <TableHeader {...props}>
        <TableRow>{children}</TableRow>
    </TableHeader>
);
const THdata = (props) => <TableHead {...props} />;
const Tbody = (props) => <TableBody {...props} />;
const Trow = (props) => <TableRow {...props} />;
const Tdata = (props) => <TableCell {...props} />;
