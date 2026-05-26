import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function BulkOperations({ enrollments, students }) {
    const [operation, setOperation] = useState("invoices");
    const [selectedEnrollments, setSelectedEnrollments] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const invoiceForm = useForm({
        enrollment_ids: [],
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
    });

    const discountForm = useForm({
        student_ids: [],
        amount: "",
        description: "",
        type: "discount",
    });

    const handleBulkInvoices = async () => {
        if (selectedEnrollments.length === 0) {
            alert("Please select at least one enrollment");
            return;
        }

        setLoading(true);
        invoiceForm.setData("enrollment_ids", selectedEnrollments);

        try {
            const response = await fetch(route("billing.bulk.invoices"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(invoiceForm.data),
            });

            const result = await response.json();

            if (response.ok) {
                alert(
                    `Successfully generated ${result.invoices_created} invoices. ${result.errors.length} errors occurred.`,
                );
                setSelectedEnrollments([]);
                invoiceForm.reset();
            } else {
                alert("Error generating invoices");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while generating invoices");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDiscount = async () => {
        if (selectedStudents.length === 0) {
            alert("Please select at least one student");
            return;
        }

        if (
            !discountForm.data.amount ||
            parseFloat(discountForm.data.amount) <= 0
        ) {
            alert("Please enter a valid discount amount");
            return;
        }

        setLoading(true);
        discountForm.setData("student_ids", selectedStudents);

        try {
            const response = await fetch(route("billing.bulk.discounts"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(discountForm.data),
            });

            const result = await response.json();

            if (response.ok) {
                alert(
                    `Successfully applied discounts to ${result.adjustments_created} invoices. ${result.errors.length} errors occurred.`,
                );
                setSelectedStudents([]);
                discountForm.reset();
            } else {
                alert("Error applying discounts");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while applying discounts");
        } finally {
            setLoading(false);
        }
    };

    const toggleEnrollment = (id) => {
        setSelectedEnrollments((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const toggleStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const selectAllEnrollments = () => {
        setSelectedEnrollments(enrollments.map((e) => e.id));
    };

    const selectAllStudents = () => {
        setSelectedStudents(students.map((s) => s.id));
    };

    const clearAllEnrollments = () => {
        setSelectedEnrollments([]);
    };

    const clearAllStudents = () => {
        setSelectedStudents([]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bulk Operations" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Bulk Operations
                    </h1>
                    <Link
                        href={route("billing.invoices.index")}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition"
                    >
                        Back to Invoices
                    </Link>
                </div>

                {/* OPERATION TABS */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-4">
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setOperation("invoices")}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                operation === "invoices"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Bulk Generate Invoices
                        </button>
                        <button
                            onClick={() => setOperation("discounts")}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                operation === "discounts"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Bulk Apply Discounts
                        </button>
                    </div>

                    {operation === "invoices" && (
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={selectAllEnrollments}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={clearAllEnrollments}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Clear All
                                </button>
                                <span className="text-sm text-gray-600">
                                    {selectedEnrollments.length} of{" "}
                                    {enrollments.length} selected
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        value={invoiceForm.data.issue_date}
                                        onChange={(e) =>
                                            invoiceForm.setData(
                                                "issue_date",
                                                e.target.value,
                                            )
                                        }
                                        className="border border-zinc-200 px-3 py-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={invoiceForm.data.due_date}
                                        onChange={(e) =>
                                            invoiceForm.setData(
                                                "due_date",
                                                e.target.value,
                                            )
                                        }
                                        className="border border-zinc-200 px-3 py-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto border border-zinc-200 rounded-lg">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedEnrollments.length ===
                                                        enrollments.length
                                                    }
                                                    onChange={
                                                        selectedEnrollments.length ===
                                                        enrollments.length
                                                            ? clearAllEnrollments
                                                            : selectAllEnrollments
                                                    }
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Program
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Session
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-zinc-200">
                                        {enrollments.map((enrollment) => (
                                            <tr key={enrollment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEnrollments.includes(
                                                            enrollment.id,
                                                        )}
                                                        onChange={() =>
                                                            toggleEnrollment(
                                                                enrollment.id,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {enrollment.student?.registration_number}{" "}
                                                    - {enrollment.student?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {
                                                        enrollment
                                                            .courseProgramVersion
                                                            ?.course?.name
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {
                                                        enrollment
                                                            .academicSession
                                                            ?.name
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                onClick={handleBulkInvoices}
                                disabled={
                                    loading || selectedEnrollments.length === 0
                                }
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <LoadingSpinner
                                        size="sm"
                                        className="mx-auto"
                                    />
                                ) : (
                                    `Generate ${selectedEnrollments.length} Invoices`
                                )}
                            </button>
                        </div>
                    )}

                    {operation === "discounts" && (
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={selectAllStudents}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={clearAllStudents}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Clear All
                                </button>
                                <span className="text-sm text-gray-600">
                                    {selectedStudents.length} of{" "}
                                    {students.length} selected
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={discountForm.data.amount}
                                        onChange={(e) =>
                                            discountForm.setData(
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="border border-zinc-200 px-3 py-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={discountForm.data.type}
                                        onChange={(e) =>
                                            discountForm.setData(
                                                "type",
                                                e.target.value,
                                            )
                                        }
                                        className="border border-zinc-200 px-3 py-2 rounded-lg w-full"
                                    >
                                        <option value="discount">
                                            Discount
                                        </option>
                                        <option value="waiver">Waiver</option>
                                        <option value="scholarship">
                                            Scholarship
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={discountForm.data.description}
                                        onChange={(e) =>
                                            discountForm.setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Reason for discount"
                                        className="border border-zinc-200 px-3 py-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto border border-zinc-200 rounded-lg">
                                <table className="min-w-full divide-y divide-zinc-200">
                                    <thead className="bg-zinc-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedStudents.length ===
                                                        students.length
                                                    }
                                                    onChange={
                                                        selectedStudents.length ===
                                                        students.length
                                                            ? clearAllStudents
                                                            : selectAllStudents
                                                    }
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Student ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-zinc-200">
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(
                                                            student.id,
                                                        )}
                                                        onChange={() =>
                                                            toggleStudent(
                                                                student.id,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {student.adm_no}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                                    {student.department?.name}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                onClick={handleBulkDiscount}
                                disabled={
                                    loading || selectedStudents.length === 0
                                }
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <LoadingSpinner
                                        size="sm"
                                        className="mx-auto"
                                    />
                                ) : (
                                    `Apply Discounts to ${selectedStudents.length} Students`
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

