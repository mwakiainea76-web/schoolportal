import { Head, useForm } from "@inertiajs/react";
import Form from "./Form";
import HostelWorkspaceTabs from "@/Pages/Hostels/Partials/HostelWorkspaceTabs";

export default function Edit({ allocation, enrollments, hostels, rooms, beds }) {
    const form = useForm({
        academic_session_enrollment_id: allocation.academic_session_enrollment_id || "",
        hostel_id: allocation.hostel_id || "",
        hostel_room_id: allocation.hostel_room_id || "",
        hostel_bed_id: allocation.hostel_bed_id || "",
        allocated_on: allocation.allocated_on || "",
        status: allocation.status || "active",
        notes: allocation.notes || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.put(route("hostel-allocations.update", allocation.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Edit Hostel Allocation" />
            <div className="mx-auto max-w-6xl space-y-6">
                <HostelWorkspaceTabs activeTab="view-allocations" />
                <Form
                    form={{ ...form, onSubmit }}
                    title={`Edit Hostel Allocation${allocation.admission_number ? ` - ${allocation.admission_number}` : ""}`}
                    description="Move the student within the approved hostel inventory only where a fully paid hostel invoice already exists for that session."
                    submitLabel="Update Allocation"
                    cancelHref={route("hostel-allocations.index")}
                    enrollments={enrollments}
                    hostels={hostels}
                    rooms={rooms}
                    beds={beds}
                />
            </div>
        </>
    );
}
