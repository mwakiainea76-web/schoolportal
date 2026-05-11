import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";

export default function ReportsIndex({ academicSessions = [] }) {
    const [outstandingBalance, setOutstandingBalance] = useState([]);
    const [overdueByDepartment, setOverdueByDepartment] = useState([]);
    const [collectionPerformance, setCollectionPerformance] = useState({});
    const [feePlanUsage, setFeePlanUsage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usageFilters, setUsageFilters] = useState({
        academic_session_id: "",
        year_of_study: "",
        session_number: "",
    });

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        loadFeePlanUsage();
    }, [
        usageFilters.academic_session_id,
        usageFilters.year_of_study,
        usageFilters.session_number,
    ]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const outstandingResponse = await fetch(
                route("reports.api.outstanding"),
            );
            const outstandingData = await outstandingResponse.json();
            setOutstandingBalance(outstandingData);

            const overdueResponse = await fetch(route("reports.api.overdue"));
            const overdueData = await overdueResponse.json();
            setOverdueByDepartment(overdueData);

            const collectionResponse = await fetch(
                route("reports.api.collection"),
            );
            const collectionData = await collectionResponse.json();
            setCollectionPerformance(collectionData);

            await loadFeePlanUsage();
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadFeePlanUsage = async () => {
        try {
            const usageResponse = await fetch(
                route("reports.api.usage", {
                    academic_session_id:
                        usageFilters.academic_session_id || undefined,
                    year_of_study: usageFilters.year_of_study || undefined,
                    session_number: usageFilters.session_number || undefined,
                }),
            );
            const usageData = await usageResponse.json();
            setFeePlanUsage(usageData);
        } catch (error) {
            console.error("Error loading fee plan usage:", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Reports Dashboard" />
                <div className="flex h-64 items-center justify-center">
                    <div className="text-lg">Loading reports...</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Reports Dashboard" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Financial Reports Dashboard
                    </h1>
                    <button
                        onClick={loadReports}
                        className="rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800"
                    >
                        Refresh Data
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500">
                            Total Invoiced
                        </h3>
                        <p className="text-2xl font-bold text-zinc-900">
                            {formatCurrency(
                                collectionPerformance.total_invoiced || 0,
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500">
                            Total Collected
                        </h3>
                        <p className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(
                                collectionPerformance.total_collected || 0,
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500">
                            Outstanding
                        </h3>
                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(
                                collectionPerformance.outstanding || 0,
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500">
                            Collection Rate
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {collectionPerformance.collection_rate || 0}%
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                        Outstanding Balance by Session
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Session
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Total Outstanding
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Invoice Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {outstandingBalance.map((item, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                                            {item.session}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {formatCurrency(
                                                item.total_outstanding,
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.invoice_count}
                                        </td>
                                    </tr>
                                ))}
                                {outstandingBalance.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-4 text-center text-sm text-zinc-500"
                                        >
                                            No outstanding balances found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                        Overdue Amounts by Department
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Total Overdue
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Overdue Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {overdueByDepartment.map((item, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                                            {item.department_name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600">
                                            {formatCurrency(item.total_overdue)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.overdue_count}
                                        </td>
                                    </tr>
                                ))}
                                {overdueByDepartment.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-4 text-center text-sm text-zinc-500"
                                        >
                                            No overdue amounts found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <h2 className="text-lg font-semibold text-zinc-700">
                            Fee Plan Usage Statistics
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="min-w-56">
                                <InputLabel value="Academic Session" />
                                <SearchSelect
                                    routeName="academic-sessions.search"
                                    defaultOptions={academicSessions}
                                    placeholder="Filter session..."
                                    onChange={(item) =>
                                        setUsageFilters((prev) => ({
                                            ...prev,
                                            academic_session_id: item.id,
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <InputLabel value="Year Of Study" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={usageFilters.year_of_study}
                                    onChange={(e) =>
                                        setUsageFilters((prev) => ({
                                            ...prev,
                                            year_of_study: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <InputLabel value="Session Number" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={usageFilters.session_number}
                                    onChange={(e) =>
                                        setUsageFilters((prev) => ({
                                            ...prev,
                                            session_number: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Fee Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Year Of Study
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Session Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Assignment Count
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Curriculum Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {feePlanUsage.map((item, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                                            {item.plan_name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.year_of_study ?? "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.session_number ?? "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.assignment_count}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                                            {item.curriculum_count}
                                        </td>
                                    </tr>
                                ))}
                                {feePlanUsage.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 text-center text-sm text-zinc-500"
                                        >
                                            No fee plan usage data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
