import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function CorsOrigins({ origins }) {
    const [editingId, setEditingId] = useState(null);

    const form = useForm({
        origin: "",
        label: "",
        is_active: true,
    });

    const resetForm = () => {
        setEditingId(null);
        form.reset();
        form.clearErrors();
        form.setData({
            origin: "",
            label: "",
            is_active: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (editingId) {
            form.put(route("settings.cors-origins.update", editingId), options);
            return;
        }

        form.post(route("settings.cors-origins.store"), options);
    };

    const editOrigin = (origin) => {
        setEditingId(origin.id);
        form.clearErrors();
        form.setData({
            origin: origin.origin,
            label: origin.label || "",
            is_active: origin.is_active,
        });
    };

    const toggleOrigin = (origin) => {
        router.put(
            route("settings.cors-origins.update", origin.id),
            {
                origin: origin.origin,
                label: origin.label || "",
                is_active: !origin.is_active,
            },
            { preserveScroll: true },
        );
    };

    const deleteOrigin = (origin) => {
        if (!confirm(`Remove ${origin.origin} from the API CORS allowlist?`)) {
            return;
        }

        router.delete(route("settings.cors-origins.destroy", origin.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        API CORS Origins
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Control which browser applications can call the API from
                        another domain.
                    </p>
                </div>
            }
        >
            <Head title="API CORS Origins" />

            <div className="mx-auto max-w-6xl space-y-8">
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="grid gap-5 md:grid-cols-[1.4fr,1fr,auto] md:items-end">
                        <div>
                            <InputLabel value="Allowed API Origin" required />
                            <input
                                type="url"
                                value={form.data.origin}
                                onChange={(e) =>
                                    form.setData("origin", e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="https://app.example.com"
                            />
                            <InputError
                                message={form.errors.origin}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Label" />
                            <input
                                type="text"
                                value={form.data.label}
                                onChange={(e) =>
                                    form.setData("label", e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="Partner app"
                            />
                            <InputError
                                message={form.errors.label}
                                className="mt-2"
                            />
                        </div>

                        <label className="flex h-[46px] items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData(
                                        "is_active",
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Active
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {editingId ? "Update Origin" : "Add Origin"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[56rem] border-collapse">
                            <thead className="bg-zinc-50">
                                <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-6 py-3 text-left">Origin</th>
                                    <th className="px-6 py-3 text-left">Label</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {origins.length ? (
                                    origins.map((origin) => (
                                        <tr key={origin.id} className="text-sm">
                                            <td className="px-6 py-4 font-medium text-zinc-900">
                                                {origin.origin}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-600">
                                                {origin.label || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        origin.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-zinc-100 text-zinc-600"
                                                    }`}
                                                >
                                                    {origin.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => editOrigin(origin)}
                                                        className="font-medium text-emerald-700 hover:text-emerald-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleOrigin(origin)}
                                                        className="font-medium text-zinc-700 hover:text-zinc-900"
                                                    >
                                                        {origin.is_active
                                                            ? "Disable"
                                                            : "Enable"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteOrigin(origin)}
                                                        className="font-medium text-red-600 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-sm text-zinc-500"
                                        >
                                            No API origins have been added yet.
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
