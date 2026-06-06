import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";
import HostelWorkspaceTabs from "./Partials/HostelWorkspaceTabs";

export default function Edit({ hostel }) {
    const form = useForm({
        name: hostel.name || "",
        code: hostel.code || "",
        session_fee_amount: hostel.session_fee_amount || "",
        gender: hostel.gender || "",
        location: hostel.location || "",
        description: hostel.description || "",
        is_active: hostel.is_active ?? true,
        rooms:
            hostel.rooms?.map((room) => ({
                id: room.id,
                name: room.name,
                code: room.code,
                floor: room.floor || "",
                bed_count: room.bed_count || 1,
                is_active: room.is_active ?? true,
            })) || [{ id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true }],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.put(route("hostels.update", hostel.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Hostel" />
            <div className="mx-auto max-w-6xl space-y-6">
                <HostelWorkspaceTabs activeTab="view-hostels" />
                <Form
                    form={{ ...form, onSubmit }}
                    title={`Edit ${hostel.name}`}
                    description="Update the hostel profile, revise room inventory, and keep the boarding bed structure current for future allocations."
                    submitLabel="Update Hostel"
                    cancelHref={route("hostels.index")}
                />
            </div>
        </AuthenticatedLayout>
    );
}
