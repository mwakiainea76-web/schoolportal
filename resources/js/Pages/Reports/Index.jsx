import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import LoadingSpinner from "@/Components/LoadingSpinner";
import TextInput from "@/Components/TextInput";
import SearchSelect from "@/Components/SearchSelect";

const ANALYTICS_SECTIONS = [
    { key: "all", label: "Overview", routeName: "reports.dashboard" },
    { key: "executive", label: "Executive", routeName: "reports.executive" },
    { key: "finance", label: "Finance", routeName: "reports.finance" },
    { key: "academic", label: "Academic", routeName: "reports.academic" },
    {
        key: "admissions",
        label: "Admissions",
        routeName: "reports.admissions",
    },
    { key: "hostel", label: "Hostel", routeName: "reports.hostel" },
    {
        key: "data-quality",
        label: "Data Quality",
        routeName: "reports.data-quality",
    },
    {
        key: "snapshots",
        label: "Snapshot Trends",
        routeName: "reports.snapshots",
    },
];

export default function ReportsIndex({
    academicSessions = [],
    activeSection = "all",
    pageTitle = "Reports Dashboard",
    pageDescription = "A consolidated analytics workspace.",
}) {
    const [academicSummary, setAcademicSummary] = useState(null);
    const [admissionsSummary, setAdmissionsSummary] = useState(null);
    const [dataQualitySummary, setDataQualitySummary] = useState(null);
    const [executiveSummary, setExecutiveSummary] = useState(null);
    const [financeSummary, setFinanceSummary] = useState(null);
    const [hostelSummary, setHostelSummary] = useState(null);
    const [snapshotTrends, setSnapshotTrends] = useState(null);
    const [outstandingBalance, setOutstandingBalance] = useState([]);
    const [overdueByDepartment, setOverdueByDepartment] = useState([]);
    const [collectionPerformance, setCollectionPerformance] = useState({});
    const [feePlanUsage, setFeePlanUsage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [financeSectionLoading, setFinanceSectionLoading] = useState({});
    const [loadedFinanceSections, setLoadedFinanceSections] = useState({
        collection: false,
        outstanding: false,
        overdue: false,
        usage: false,
    });
    const [usageFilters, setUsageFilters] = useState({
        academic_session_id: "",
        year_of_study: "",
        session_number: "",
    });
    const showExecutive = activeSection === "all" || activeSection === "executive";
    const showFinance = activeSection === "all" || activeSection === "finance";
    const showAcademic = activeSection === "all" || activeSection === "academic";
    const showAdmissions =
        activeSection === "all" || activeSection === "admissions";
    const showHostel = activeSection === "all" || activeSection === "hostel";
    const showDataQuality =
        activeSection === "all" || activeSection === "data-quality";
    const showSnapshots =
        activeSection === "all" || activeSection === "snapshots";
    const financeOnlyPage = activeSection === "finance";

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        if (!showFinance || !loadedFinanceSections.usage) {
            return;
        }

        loadFeePlanUsage();
    }, [
        showFinance,
        loadedFinanceSections.usage,
        usageFilters.academic_session_id,
        usageFilters.year_of_study,
        usageFilters.session_number,
    ]);

    const loadReports = async () => {
        setLoading(true);
        try {
            if (showExecutive) {
                const executiveResponse = await fetch(
                    route("reports.api.executive-summary"),
                );
                const executiveData = await executiveResponse.json();
                setExecutiveSummary(executiveData);
            }

            if (showFinance) {
                const financeResponse = await fetch(
                    route("reports.api.finance-summary"),
                );
                const financeData = await financeResponse.json();
                setFinanceSummary(financeData);

                if (!financeOnlyPage) {
                    const outstandingResponse = await fetch(
                        route("reports.api.outstanding"),
                    );
                    const outstandingData = await outstandingResponse.json();
                    setOutstandingBalance(outstandingData);

                    const overdueResponse = await fetch(
                        route("reports.api.overdue"),
                    );
                    const overdueData = await overdueResponse.json();
                    setOverdueByDepartment(overdueData);

                    const collectionResponse = await fetch(
                        route("reports.api.collection"),
                    );
                    const collectionData = await collectionResponse.json();
                    setCollectionPerformance(collectionData);

                    setLoadedFinanceSections({
                        collection: true,
                        outstanding: true,
                        overdue: true,
                        usage: true,
                    });

                    await loadFeePlanUsage();
                }
            }

            if (showAcademic) {
                const academicResponse = await fetch(
                    route("reports.api.academic-summary"),
                );
                const academicData = await academicResponse.json();
                setAcademicSummary(academicData);
            }

            if (showAdmissions) {
                const admissionsResponse = await fetch(
                    route("reports.api.admissions-summary"),
                );
                const admissionsData = await admissionsResponse.json();
                setAdmissionsSummary(admissionsData);
            }

            if (showHostel) {
                const hostelResponse = await fetch(
                    route("reports.api.hostel-summary"),
                );
                const hostelData = await hostelResponse.json();
                setHostelSummary(hostelData);
            }

            if (showDataQuality) {
                const dataQualityResponse = await fetch(
                    route("reports.api.data-quality-summary"),
                );
                const dataQualityData = await dataQualityResponse.json();
                setDataQualitySummary(dataQualityData);
            }

            if (showSnapshots) {
                const snapshotResponse = await fetch(
                    route("reports.api.snapshot-trends", { days: 14 }),
                );
                const snapshotData = await snapshotResponse.json();
                setSnapshotTrends(snapshotData);
            }
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadFeePlanUsage = async () => {
        if (!showFinance) {
            return;
        }

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

    const loadFinanceSection = async (section) => {
        if (financeSectionLoading[section] || loadedFinanceSections[section]) {
            return;
        }

        setFinanceSectionLoading((current) => ({
            ...current,
            [section]: true,
        }));

        try {
            if (section === "collection") {
                const response = await fetch(route("reports.api.collection"));
                const data = await response.json();
                setCollectionPerformance(data);
            }

            if (section === "outstanding") {
                const response = await fetch(route("reports.api.outstanding"));
                const data = await response.json();
                setOutstandingBalance(data);
            }

            if (section === "overdue") {
                const response = await fetch(route("reports.api.overdue"));
                const data = await response.json();
                setOverdueByDepartment(data);
            }

            if (section === "usage") {
                await loadFeePlanUsage();
            }

            setLoadedFinanceSections((current) => ({
                ...current,
                [section]: true,
            }));
        } catch (error) {
            console.error(`Error loading finance ${section}:`, error);
        } finally {
            setFinanceSectionLoading((current) => ({
                ...current,
                [section]: false,
            }));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
        }).format(amount);
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title={pageTitle} />
                <div className="flex h-64 items-center justify-center">
                    <LoadingSpinner
                        size="lg"
                        centered
                    />
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={pageTitle} />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                                Analytics
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold text-zinc-800">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                {pageDescription}
                            </p>
                        </div>
                        <button
                            onClick={loadReports}
                            className="rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800"
                        >
                            Refresh Data
                        </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {ANALYTICS_SECTIONS.map((section) => {
                            const isActive = section.key === activeSection;

                            return (
                                <Link
                                    key={section.key}
                                    href={route(section.routeName)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                    }`}
                                >
                                    {section.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {showExecutive && executiveSummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Executive Overview
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        A quick institutional snapshot built from secured aggregate metrics.
                                    </p>
                                </div>
                                <div className="text-sm text-zinc-500">
                                    Active Session:{" "}
                                    <span className="font-medium text-zinc-700">
                                        {executiveSummary.active_session?.label ??
                                            "No active session"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Total Students"
                                    value={executiveSummary.metrics.total_students}
                                />
                                <MetricCard
                                    label="Active Students"
                                    value={executiveSummary.metrics.active_students}
                                />
                                <MetricCard
                                    label="New Admissions This Month"
                                    value={
                                        executiveSummary.metrics
                                            .new_admissions_this_month
                                    }
                                />
                                <MetricCard
                                    label="Registered In Active Session"
                                    value={
                                        executiveSummary.metrics
                                            .students_registered_in_active_session
                                    }
                                    helper={`${executiveSummary.metrics.session_registration_rate}% registration rate`}
                                />
                                <MetricCard
                                    label="Hostel Occupancy"
                                    value={`${executiveSummary.metrics.hostel_occupancy_rate}%`}
                                    helper={`${executiveSummary.metrics.occupied_beds} of ${executiveSummary.metrics.active_beds} active beds occupied`}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Total Invoiced"
                                    value={formatCurrency(
                                        executiveSummary.metrics.total_invoiced,
                                    )}
                                    accent="text-zinc-900"
                                />
                                <MetricCard
                                    label="Total Collected"
                                    value={formatCurrency(
                                        executiveSummary.metrics.total_collected,
                                    )}
                                    accent="text-emerald-600"
                                />
                                <MetricCard
                                    label="Outstanding Balance"
                                    value={formatCurrency(
                                        executiveSummary.metrics
                                            .outstanding_balance,
                                    )}
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Overdue Balance"
                                    value={formatCurrency(
                                        executiveSummary.metrics.overdue_balance,
                                    )}
                                    accent="text-red-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Top Programs By Enrollment
                                </h2>
                                <div className="space-y-4">
                                    {executiveSummary.breakdowns.top_programs
                                        ?.length ? (
                                        executiveSummary.breakdowns.top_programs.map(
                                            (program) => (
                                                <div
                                                    key={program.id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="font-medium text-zinc-800">
                                                            {program.name}
                                                        </p>
                                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                            {program.student_count} students
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No program enrollment data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Student Status Breakdown
                                </h2>
                                <div className="space-y-4">
                                    {executiveSummary.breakdowns
                                        .student_statuses?.length ? (
                                        executiveSummary.breakdowns.student_statuses.map(
                                            (status) => (
                                                <div
                                                    key={status.status}
                                                    className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="capitalize text-zinc-700">
                                                        {status.status}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {status.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No student status data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showFinance && financeSummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Finance Analytics
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        Billing health, payment behavior, debt exposure, and finance exception monitoring.
                                    </p>
                                </div>
                                <div className="text-xs text-zinc-500">
                                    Excluding rejected invoices from finance totals
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Collection Rate"
                                    value={`${financeSummary.metrics.collection_rate}%`}
                                    accent="text-blue-600"
                                />
                                <MetricCard
                                    label="Overdue Invoices"
                                    value={
                                        financeSummary.metrics
                                            .overdue_invoice_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Approval Backlog"
                                    value={
                                        financeSummary.metrics
                                            .approval_backlog_count
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Manual Billing Ops"
                                    value={
                                        financeSummary.metrics
                                            .manual_billing_operation_count
                                    }
                                />
                                <MetricCard
                                    label="Students With Credit"
                                    value={
                                        financeSummary.metrics
                                            .credit_balance_students
                                    }
                                    accent="text-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Overdue Aging Buckets
                                </h2>
                                <div className="space-y-4">
                                    {financeSummary.aging.map((bucket) => (
                                        <div
                                            key={bucket.label}
                                            className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                        >
                                            <p className="text-zinc-700">
                                                {bucket.label}
                                            </p>
                                            <span className="font-semibold text-zinc-900">
                                                {formatCurrency(bucket.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Payment Method Breakdown
                                </h2>
                                <div className="space-y-4">
                                    {financeSummary.breakdowns.payment_methods
                                        ?.length ? (
                                        financeSummary.breakdowns.payment_methods.map(
                                            (method) => (
                                                <div
                                                    key={method.method}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="capitalize font-medium text-zinc-800">
                                                            {method.method}
                                                        </p>
                                                        <span className="text-sm text-zinc-500">
                                                            {method.payment_count} payments
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 font-semibold text-zinc-900">
                                                        {formatCurrency(
                                                            method.total_amount,
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No completed payment data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Invoice Status Mix
                                </h2>
                                <div className="space-y-3">
                                    {financeSummary.breakdowns.invoice_statuses
                                        ?.length ? (
                                        financeSummary.breakdowns.invoice_statuses.map(
                                            (status) => (
                                                <div
                                                    key={status.status}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="capitalize text-zinc-700">
                                                        {status.status}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {status.invoice_count}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No invoice status data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm xl:col-span-2">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Adjustment Summary
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-200">
                                        <thead className="bg-zinc-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Type
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Count
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Total Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {financeSummary.breakdowns.adjustments
                                                ?.length ? (
                                                financeSummary.breakdowns.adjustments.map(
                                                    (adjustment) => (
                                                        <tr
                                                            key={
                                                                adjustment.type
                                                            }
                                                        >
                                                            <td className="px-4 py-3 text-sm capitalize text-zinc-800">
                                                                {
                                                                    adjustment.type
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-zinc-700">
                                                                {
                                                                    adjustment.adjustment_count
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                                                                {formatCurrency(
                                                                    adjustment.total_amount,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-4 py-3 text-center text-sm text-zinc-500"
                                                    >
                                                        No adjustment data found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Collection Trend
                                </h2>
                                <div className="space-y-4">
                                    {financeSummary.breakdowns.collection_trend
                                        ?.length ? (
                                        financeSummary.breakdowns.collection_trend.map(
                                            (trend) => (
                                                <div
                                                    key={trend.month}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="font-medium text-zinc-800">
                                                            {trend.month}
                                                        </p>
                                                        <div className="text-right text-sm">
                                                            <p className="text-zinc-500">
                                                                Invoiced:{" "}
                                                                {formatCurrency(
                                                                    trend.invoiced,
                                                                )}
                                                            </p>
                                                            <p className="font-semibold text-emerald-700">
                                                                Collected:{" "}
                                                                {formatCurrency(
                                                                    trend.collected,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No trend data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Credit Balance Exceptions
                                </h2>
                                <div className="space-y-4">
                                    {financeSummary.exceptions.credit_balances
                                        ?.length ? (
                                        financeSummary.exceptions.credit_balances.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium text-zinc-800">
                                                                {
                                                                    student.student_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-zinc-500">
                                                                {
                                                                    student.registration_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-emerald-700">
                                                            {formatCurrency(
                                                                student.credit_balance,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No student credit balances found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                Payments Without Full Allocation
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                Reference
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                Student
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                Reg. No
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                Unallocated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 bg-white">
                                        {financeSummary.exceptions
                                            .payments_without_allocations
                                            ?.length ? (
                                            financeSummary.exceptions.payments_without_allocations.map(
                                                (payment) => (
                                                    <tr
                                                        key={
                                                            payment.payment_id
                                                        }
                                                    >
                                                        <td className="px-4 py-3 text-sm text-zinc-800">
                                                            {
                                                                payment.reference
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700">
                                                            {payment.student_name ||
                                                                "Unlinked student"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700">
                                                            {payment.registration_number ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-red-600">
                                                            {formatCurrency(
                                                                payment.unallocated_amount,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-4 py-3 text-center text-sm text-zinc-500"
                                                >
                                                    No payment allocation exceptions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {showAcademic && academicSummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Academic Operations Analytics
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        Session registration, timetable delivery, utilization, and operational exception monitoring.
                                    </p>
                                </div>
                                <div className="text-sm text-zinc-500">
                                    Active Session:{" "}
                                    <span className="font-medium text-zinc-700">
                                        {academicSummary.active_session?.label ??
                                            "No active session"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Session Registration Rate"
                                    value={`${academicSummary.metrics.session_registration_rate}%`}
                                    accent="text-blue-600"
                                />
                                <MetricCard
                                    label="Registered Students"
                                    value={
                                        academicSummary.metrics
                                            .registered_students
                                    }
                                />
                                <MetricCard
                                    label="Eligible Students"
                                    value={
                                        academicSummary.metrics
                                            .eligible_students
                                    }
                                />
                                <MetricCard
                                    label="Timetable Completion"
                                    value={`${academicSummary.metrics.timetable_completion_rate}%`}
                                    accent="text-emerald-600"
                                />
                                <MetricCard
                                    label="Units Without Timetable"
                                    value={
                                        academicSummary.exceptions
                                            .units_without_timetable?.length ?? 0
                                    }
                                    accent="text-amber-600"
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Students Not Registered"
                                    value={
                                        academicSummary.metrics
                                            .students_not_registered_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Mapped Units"
                                    value={
                                        academicSummary.metrics
                                            .mapped_units_count
                                    }
                                />
                                <MetricCard
                                    label="Lecturer Clashes"
                                    value={
                                        academicSummary.metrics
                                            .lecturer_clash_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Room Clashes"
                                    value={
                                        academicSummary.metrics.room_clash_count
                                    }
                                    accent="text-red-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Students by Module
                                </h2>
                                <div className="space-y-3">
                                    {academicSummary.breakdowns.students_by_module
                                        ?.length ? (
                                        academicSummary.breakdowns.students_by_module.map(
                                            (row) => (
                                                <div
                                                    key={row.module}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        Module {row.module}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No module data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Students by Year of Study
                                </h2>
                                <div className="space-y-3">
                                    {academicSummary.breakdowns.students_by_year
                                        ?.length ? (
                                        academicSummary.breakdowns.students_by_year.map(
                                            (row) => (
                                                <div
                                                    key={row.year_of_study}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        Year{" "}
                                                        {row.year_of_study}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No year-of-study data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Lecturer Load
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.breakdowns.lecturer_load
                                        ?.length ? (
                                        academicSummary.breakdowns.lecturer_load.map(
                                            (row) => (
                                                <div
                                                    key={row.staff_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium text-zinc-800">
                                                                {
                                                                    row.trainer_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-zinc-500">
                                                                {
                                                                    row.staff_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-zinc-900">
                                                            {row.session_count} sessions
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No lecturer load data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Room Utilization Snapshot
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.breakdowns.room_utilization
                                        ?.length ? (
                                        academicSummary.breakdowns.room_utilization.map(
                                            (row) => (
                                                <div
                                                    key={row.room_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="font-medium text-zinc-800">
                                                            {row.room_name}
                                                        </p>
                                                        <span className="font-semibold text-zinc-900">
                                                            {row.session_count} sessions
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No room utilization data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Students Not Registered In Active Session
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.exceptions
                                        .students_not_registered?.length ? (
                                        academicSummary.exceptions.students_not_registered.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium text-zinc-800">
                                                                {
                                                                    student.student_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-zinc-500">
                                                                {
                                                                    student.registration_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-zinc-600">
                                                            Module{" "}
                                                            {
                                                                student.current_module
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No unregistered active students found in the current sample.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Units Without Timetable
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.exceptions
                                        .units_without_timetable?.length ? (
                                        academicSummary.exceptions.units_without_timetable.map(
                                            (unit) => (
                                                <div
                                                    key={
                                                        unit.program_version_unit_id
                                                    }
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {unit.unit_code} -{" "}
                                                        {unit.unit_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {unit.program_name} /{" "}
                                                        {unit.version_name} /
                                                        Module{" "}
                                                        {unit.module_taught}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            All sampled mapped units have timetable coverage.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Lecturer Clashes
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.exceptions
                                        .lecturer_clashes?.length ? (
                                        academicSummary.exceptions.lecturer_clashes.map(
                                            (clash, index) => (
                                                <div
                                                    key={`${clash.first_timetable_id}-${clash.second_timetable_id}-${index}`}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium capitalize text-zinc-800">
                                                        {clash.day_of_week}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {clash.first_time_range} overlaps with{" "}
                                                        {clash.second_time_range}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No lecturer clashes detected in the sampled timetable set.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Room Clashes
                                </h2>
                                <div className="space-y-4">
                                    {academicSummary.exceptions.room_clashes
                                        ?.length ? (
                                        academicSummary.exceptions.room_clashes.map(
                                            (clash, index) => (
                                                <div
                                                    key={`${clash.first_timetable_id}-${clash.second_timetable_id}-${index}`}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium capitalize text-zinc-800">
                                                        {clash.day_of_week}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {clash.first_time_range} overlaps with{" "}
                                                        {clash.second_time_range}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No room clashes detected in the sampled timetable set.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showAdmissions && admissionsSummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Admissions and Registry Analytics
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        Intake trends, demographic breakdowns, and onboarding completion exceptions.
                                    </p>
                                </div>
                                <div className="text-sm text-zinc-500">
                                    Active Session:{" "}
                                    <span className="font-medium text-zinc-700">
                                        {admissionsSummary.active_session
                                            ?.label ?? "No active session"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Total Admissions"
                                    value={
                                        admissionsSummary.metrics
                                            .total_admissions
                                    }
                                />
                                <MetricCard
                                    label="Admissions In Range"
                                    value={
                                        admissionsSummary.metrics
                                            .new_admissions_in_range
                                    }
                                    accent="text-blue-600"
                                />
                                <MetricCard
                                    label="Inactive Accounts"
                                    value={
                                        admissionsSummary.metrics
                                            .inactive_accounts
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Missing Program Enrollment"
                                    value={
                                        admissionsSummary.metrics
                                            .students_missing_program_enrollment_count
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Missing Next Of Kin"
                                    value={
                                        admissionsSummary.metrics
                                            .students_missing_next_of_kin_count
                                    }
                                    accent="text-amber-600"
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Active Accounts"
                                    value={
                                        admissionsSummary.metrics
                                            .active_accounts
                                    }
                                    accent="text-emerald-600"
                                />
                                <MetricCard
                                    label="Students Not Session Enrolled"
                                    value={
                                        admissionsSummary.metrics
                                            .students_not_session_enrolled_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Duplicate Contact Risks"
                                    value={
                                        admissionsSummary.metrics
                                            .duplicate_contact_risk_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="PWD Students"
                                    value={
                                        admissionsSummary.metrics.pwd_students
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Intake Trend
                                </h2>
                                <div className="space-y-3">
                                    {admissionsSummary.breakdowns.intake_trend
                                        ?.length ? (
                                        admissionsSummary.breakdowns.intake_trend.map(
                                            (row) => (
                                                <div
                                                    key={row.month}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        {row.month}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No intake trend data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Admissions by Gender
                                </h2>
                                <div className="space-y-3">
                                    {admissionsSummary.breakdowns
                                        .admissions_by_gender?.length ? (
                                        admissionsSummary.breakdowns.admissions_by_gender.map(
                                            (row) => (
                                                <div
                                                    key={row.gender}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="capitalize text-zinc-700">
                                                        {row.gender}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No gender data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Admissions by Department
                                </h2>
                                <div className="space-y-3">
                                    {admissionsSummary.breakdowns
                                        .admissions_by_department?.length ? (
                                        admissionsSummary.breakdowns.admissions_by_department.map(
                                            (row) => (
                                                <div
                                                    key={row.department_name}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        {row.department_name}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No department data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Top Programs
                                </h2>
                                <div className="space-y-3">
                                    {admissionsSummary.breakdowns
                                        .admissions_by_program?.length ? (
                                        admissionsSummary.breakdowns.admissions_by_program.map(
                                            (row) => (
                                                <div
                                                    key={row.program_name}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        {row.program_name}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No program data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Top Counties
                                </h2>
                                <div className="space-y-3">
                                    {admissionsSummary.breakdowns
                                        .admissions_by_county?.length ? (
                                        admissionsSummary.breakdowns.admissions_by_county.map(
                                            (row) => (
                                                <div
                                                    key={row.county}
                                                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="text-zinc-700">
                                                        {row.county}
                                                    </p>
                                                    <span className="font-semibold text-zinc-900">
                                                        {row.total}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No county data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Missing Program Enrollment
                                </h2>
                                <div className="space-y-4">
                                    {admissionsSummary.exceptions
                                        .students_missing_program_enrollment
                                        ?.length ? (
                                        admissionsSummary.exceptions.students_missing_program_enrollment.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {student.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            student.registration_number
                                                        }{" "}
                                                        /{" "}
                                                        {
                                                            student.admission_date
                                                        }
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No missing program enrollment cases found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Missing Next Of Kin
                                </h2>
                                <div className="space-y-4">
                                    {admissionsSummary.exceptions
                                        .students_missing_next_of_kin?.length ? (
                                        admissionsSummary.exceptions.students_missing_next_of_kin.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {student.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            student.registration_number
                                                        }
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No missing next-of-kin cases found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Inactive Student Accounts
                                </h2>
                                <div className="space-y-4">
                                    {admissionsSummary.exceptions
                                        .inactive_student_accounts?.length ? (
                                        admissionsSummary.exceptions.inactive_student_accounts.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {student.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            student.registration_number
                                                        }{" "}
                                                        / {student.email}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No inactive student accounts found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Not Session Enrolled
                                </h2>
                                <div className="space-y-4">
                                    {admissionsSummary.exceptions
                                        .students_not_session_enrolled
                                        ?.length ? (
                                        admissionsSummary.exceptions.students_not_session_enrolled.map(
                                            (student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {student.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            student.registration_number
                                                        }
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No session-enrollment gaps found in the current sample.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Duplicate Contact Risk
                                </h2>
                                <div className="space-y-4">
                                    {admissionsSummary.exceptions
                                        .duplicate_contact_risk?.length ? (
                                        admissionsSummary.exceptions.duplicate_contact_risk.map(
                                            (risk, index) => (
                                                <div
                                                    key={`${risk.contact_type}-${risk.contact_value}-${index}`}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium uppercase text-zinc-800">
                                                        {risk.contact_type}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {risk.contact_value}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                                        {risk.duplicate_count} duplicates
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No duplicate contact risks found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showHostel && hostelSummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Hostel Analytics
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        Occupancy, hostel billing linkage, and accommodation exception monitoring.
                                    </p>
                                </div>
                                <div className="text-sm text-zinc-500">
                                    Active Session:{" "}
                                    <span className="font-medium text-zinc-700">
                                        {hostelSummary.active_session?.label ??
                                            "No active session"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Occupancy Rate"
                                    value={`${hostelSummary.metrics.occupancy_rate}%`}
                                    accent="text-blue-600"
                                />
                                <MetricCard
                                    label="Occupied Beds"
                                    value={hostelSummary.metrics.occupied_beds}
                                    helper={`${hostelSummary.metrics.active_beds} active beds`}
                                />
                                <MetricCard
                                    label="Available Beds"
                                    value={hostelSummary.metrics.available_beds}
                                    accent="text-emerald-600"
                                />
                                <MetricCard
                                    label="Allocated Students"
                                    value={
                                        hostelSummary.metrics
                                            .allocated_students
                                    }
                                />
                                <MetricCard
                                    label="Hostel-Billed Students"
                                    value={
                                        hostelSummary.metrics
                                            .hostel_billed_students
                                    }
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Hostel Revenue Invoiced"
                                    value={formatCurrency(
                                        hostelSummary.metrics
                                            .hostel_revenue_invoiced,
                                    )}
                                    accent="text-zinc-900"
                                />
                                <MetricCard
                                    label="Hostel Revenue Collected"
                                    value={formatCurrency(
                                        hostelSummary.metrics
                                            .hostel_revenue_collected,
                                    )}
                                    accent="text-emerald-600"
                                />
                                <MetricCard
                                    label="Billed Not Allocated"
                                    value={
                                        hostelSummary.metrics
                                            .billed_but_not_allocated_count
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Allocated Not Billed"
                                    value={
                                        hostelSummary.metrics
                                            .allocated_but_not_billed_count
                                    }
                                    accent="text-red-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Occupancy by Hostel
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.breakdowns.occupancy_by_hostel
                                        ?.length ? (
                                        hostelSummary.breakdowns.occupancy_by_hostel.map(
                                            (row) => (
                                                <div
                                                    key={row.hostel_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium text-zinc-800">
                                                                {
                                                                    row.hostel_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-zinc-500">
                                                                {
                                                                    row.occupied_beds
                                                                }{" "}
                                                                occupied /{" "}
                                                                {
                                                                    row.active_beds
                                                                }{" "}
                                                                active beds
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-zinc-900">
                                                            {
                                                                row.occupancy_rate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No hostel occupancy data available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Occupancy by Room
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.breakdowns.occupancy_by_room
                                        ?.length ? (
                                        hostelSummary.breakdowns.occupancy_by_room.map(
                                            (row) => (
                                                <div
                                                    key={row.room_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium text-zinc-800">
                                                                {row.room_name}
                                                            </p>
                                                            <p className="text-sm text-zinc-500">
                                                                {
                                                                    row.hostel_name
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    row.occupied_beds
                                                                }{" "}
                                                                occupied /{" "}
                                                                {
                                                                    row.active_beds
                                                                }{" "}
                                                                active beds
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-zinc-900">
                                                            {
                                                                row.occupancy_rate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No room occupancy data available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Billed but Not Allocated
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.exceptions
                                        .billed_but_not_allocated?.length ? (
                                        hostelSummary.exceptions.billed_but_not_allocated.map(
                                            (row) => (
                                                <div
                                                    key={row.invoice_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            row.registration_number
                                                        }{" "}
                                                        / {row.invoice_number}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-amber-700">
                                                        Due{" "}
                                                        {formatCurrency(
                                                            row.balance_due,
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No billed-without-allocation cases found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Allocated but Not Billed
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.exceptions
                                        .allocated_but_not_billed?.length ? (
                                        hostelSummary.exceptions.allocated_but_not_billed.map(
                                            (row) => (
                                                <div
                                                    key={row.allocation_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            row.registration_number
                                                        }{" "}
                                                        / {row.hostel_name}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                                        Expected{" "}
                                                        {formatCurrency(
                                                            row.hostel_fee_amount,
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No allocation-without-billing cases found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Duplicate Student Allocations
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.exceptions
                                        .duplicate_allocations?.length ? (
                                        hostelSummary.exceptions.duplicate_allocations.map(
                                            (row) => (
                                                <div
                                                    key={row.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            row.registration_number
                                                        }
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                                        {
                                                            row.allocation_count
                                                        }{" "}
                                                        active allocations
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No duplicate student allocations found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Rooms Over Capacity
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.exceptions.rooms_over_capacity
                                        ?.length ? (
                                        hostelSummary.exceptions.rooms_over_capacity.map(
                                            (row) => (
                                                <div
                                                    key={row.room_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.room_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {row.hostel_name}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                                        {
                                                            row.allocation_count
                                                        }{" "}
                                                        allocations vs{" "}
                                                        {row.bed_count} beds
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No over-capacity rooms found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Inactive Students With Allocation
                                </h2>
                                <div className="space-y-4">
                                    {hostelSummary.exceptions
                                        .inactive_students_with_active_allocation
                                        ?.length ? (
                                        hostelSummary.exceptions.inactive_students_with_active_allocation.map(
                                            (row) => (
                                                <div
                                                    key={row.allocation_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {
                                                            row.registration_number
                                                        }{" "}
                                                        / {row.hostel_name}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold capitalize text-red-600">
                                                        {row.student_status}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No inactive-student allocation conflicts found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showDataQuality && dataQualitySummary && (
                    <>
                        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700">
                                        Data Quality and Operational Signals
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        Integrity gaps, anomalous records, and runtime-health signals that affect trust in analytics.
                                    </p>
                                </div>
                                <div className="text-xs text-zinc-500">
                                    Log signals use the latest laravel.log tail sample
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    label="Missing Relationships"
                                    value={
                                        dataQualitySummary.metrics
                                            .records_missing_required_relationships
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Duplicate Contacts"
                                    value={
                                        dataQualitySummary.metrics
                                            .duplicate_contact_identifiers
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Orphaned Financial Records"
                                    value={
                                        dataQualitySummary.metrics
                                            .orphaned_financial_records
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Invalid Status Combinations"
                                    value={
                                        dataQualitySummary.metrics
                                            .invalid_status_combinations
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Failed Jobs"
                                    value={
                                        dataQualitySummary.metrics
                                            .failed_job_count
                                    }
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Strict-Mode Errors"
                                    value={
                                        dataQualitySummary.metrics
                                            .strict_mode_error_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Slow Queries"
                                    value={
                                        dataQualitySummary.metrics
                                            .slow_query_count
                                    }
                                    accent="text-amber-600"
                                />
                                <MetricCard
                                    label="Multi-Active Sessions"
                                    value={
                                        dataQualitySummary.metrics
                                            .multi_active_session_count
                                    }
                                    accent="text-red-600"
                                />
                                <MetricCard
                                    label="Multi-Active Program Mappings"
                                    value={
                                        dataQualitySummary.metrics
                                            .multi_active_program_mapping_count
                                    }
                                    accent="text-red-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Duplicate Contact Identifiers
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .duplicate_contact_identifiers?.length ? (
                                        dataQualitySummary.exceptions.duplicate_contact_identifiers.map(
                                            (row, index) => (
                                                <div
                                                    key={`${row.contact_type}-${row.contact_value}-${index}`}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium uppercase text-zinc-800">
                                                        {row.contact_type}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {row.contact_value}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                                        {row.duplicate_count} duplicates
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No duplicate contacts found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Multi-Active Academic Sessions
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .multiple_active_academic_sessions
                                        ?.length ? (
                                        dataQualitySummary.exceptions.multiple_active_academic_sessions.map(
                                            (row) => (
                                                <div
                                                    key={row.academic_session_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.session_label}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        Session number {row.session_number}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No multi-active session anomalies found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Students Without Program Enrollment
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .students_without_program_enrollment
                                        ?.length ? (
                                        dataQualitySummary.exceptions.students_without_program_enrollment.map(
                                            (row) => (
                                                <div
                                                    key={row.student_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.student_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {row.registration_number}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No missing program-enrollment cases found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Invoices Without Enrollment
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .invoices_without_enrollment?.length ? (
                                        dataQualitySummary.exceptions.invoices_without_enrollment.map(
                                            (row) => (
                                                <div
                                                    key={row.invoice_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.invoice_number}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        Student ID {row.student_id}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No invoice-enrollment orphan cases found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Payments Without Student
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .payments_without_student?.length ? (
                                        dataQualitySummary.exceptions.payments_without_student.map(
                                            (row) => (
                                                <div
                                                    key={row.payment_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.reference}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {formatCurrency(row.amount)}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No payments missing student links found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Invalid Invoice Statuses
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .invalid_invoice_statuses?.length ? (
                                        dataQualitySummary.exceptions.invalid_invoice_statuses.map(
                                            (row) => (
                                                <div
                                                    key={row.invoice_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.invoice_number}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        Status {row.status}
                                                    </p>
                                                    <p className="mt-2 text-sm text-red-600">
                                                        Due {formatCurrency(row.balance_due)}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No invalid invoice status combinations found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Invoice Student Mismatches
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .invoice_student_mismatches?.length ? (
                                        dataQualitySummary.exceptions.invoice_student_mismatches.map(
                                            (row) => (
                                                <div
                                                    key={row.invoice_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.invoice_number}
                                                    </p>
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {row.student_name} /{" "}
                                                        {row.registration_number}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No invoice-student mismatch cases found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-700">
                                    Multi-Active Program Mappings
                                </h2>
                                <div className="space-y-4">
                                    {dataQualitySummary.exceptions
                                        .multiple_active_program_mappings
                                        ?.length ? (
                                        dataQualitySummary.exceptions.multiple_active_program_mappings.map(
                                            (row) => (
                                                <div
                                                    key={row.program_id}
                                                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                                                >
                                                    <p className="font-medium text-zinc-800">
                                                        {row.program_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {row.active_mapping_count} active mappings
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            No multi-active program mapping cases found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showSnapshots && snapshotTrends && (
                    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-700">
                                    Snapshot Trends
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Historical trend slices sourced from the daily analytics snapshot tables.
                                </p>
                            </div>
                            <div className="text-xs text-zinc-500">
                                {snapshotTrends.range?.date_from} to{" "}
                                {snapshotTrends.range?.date_to}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <SnapshotTrendCard
                                title="Student Growth"
                                points={
                                    snapshotTrends.executive?.student_growth ??
                                    []
                                }
                            />
                            <SnapshotTrendCard
                                title="Collections"
                                points={
                                    snapshotTrends.finance?.total_collected ??
                                    []
                                }
                                formatter={formatCurrency}
                            />
                            <SnapshotTrendCard
                                title="Outstanding Balance"
                                points={
                                    snapshotTrends.finance
                                        ?.outstanding_balance ?? []
                                }
                                formatter={formatCurrency}
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <SnapshotTrendCard
                                title="Registration Rate"
                                points={
                                    snapshotTrends.academic
                                        ?.session_registration_rate ?? []
                                }
                                suffix="%"
                            />
                            <SnapshotTrendCard
                                title="Hostel Occupancy"
                                points={
                                    snapshotTrends.hostel?.occupancy_rate ?? []
                                }
                                suffix="%"
                            />
                            <SnapshotTrendCard
                                title="Slow Query Count"
                                points={
                                    snapshotTrends.quality?.slow_query_count ??
                                    []
                                }
                            />
                        </div>
                    </div>
                )}

                {showFinance && (
                    <>
                {(!financeOnlyPage || loadedFinanceSections.collection) ? (
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
                ) : (
                    <LoadFinancePanel
                        title="Collection Performance"
                        description="Load invoiced, collected, outstanding, and collection-rate figures."
                        loading={Boolean(financeSectionLoading.collection)}
                        onLoad={() => loadFinanceSection("collection")}
                    />
                )}

                {(!financeOnlyPage || loadedFinanceSections.outstanding) ? (
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
                ) : (
                    <LoadFinancePanel
                        title="Outstanding Balance by Session"
                        description="Load the session-by-session outstanding invoice breakdown."
                        loading={Boolean(financeSectionLoading.outstanding)}
                        onLoad={() => loadFinanceSection("outstanding")}
                    />
                )}

                {(!financeOnlyPage || loadedFinanceSections.overdue) ? (
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
                ) : (
                    <LoadFinancePanel
                        title="Overdue Amounts by Department"
                        description="Load overdue totals grouped by department."
                        loading={Boolean(financeSectionLoading.overdue)}
                        onLoad={() => loadFinanceSection("overdue")}
                    />
                )}

                {(!financeOnlyPage || loadedFinanceSections.usage) ? (
                <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <h2 className="text-lg font-semibold text-zinc-700">
                            Fee Plan Usage Statistics
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="min-w-56">
                                <InputLabel value="Academic Session" />
                                <SearchSelect
                                    routeName="academic.sessions.search"
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
                                        ProgramVersion Count
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
                ) : (
                    <LoadFinancePanel
                        title="Fee Plan Usage Statistics"
                        description="Load fee-plan usage and activate the session and study-level filters."
                        loading={Boolean(financeSectionLoading.usage)}
                        onLoad={() => loadFinanceSection("usage")}
                    />
                )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ label, value, helper = null, accent = "text-zinc-900" }) {
    return (
        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-500">{label}</h3>
            <p className={`text-2xl font-bold ${accent}`}>{value}</p>
            {helper ? (
                <p className="mt-2 text-xs text-zinc-500">{helper}</p>
            ) : null}
        </div>
    );
}

function LoadFinancePanel({ title, description, loading, onLoad }) {
    return (
        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-700">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{description}</p>
                </div>
                <button
                    type="button"
                    onClick={onLoad}
                    disabled={loading}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Loading..." : "Load Data"}
                </button>
            </div>
        </div>
    );
}

function SnapshotTrendCard({
    title,
    points,
    formatter = (value) => value,
    suffix = "",
}) {
    return (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-700">{title}</h3>
            <div className="mt-4 space-y-3">
                {points.length ? (
                    points.slice(-7).map((point) => (
                        <div
                            key={`${title}-${point.date}`}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-zinc-500">
                                {point.date}
                            </span>
                            <span className="font-medium text-zinc-900">
                                {formatter(point.value)}
                                {suffix}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-zinc-500">
                        No snapshot trend data available yet.
                    </p>
                )}
            </div>
        </div>
    );
}
