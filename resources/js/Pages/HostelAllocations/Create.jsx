import { Head, useForm } from "@inertiajs/react";
import Form from "./Form";
import HostelWorkspaceTabs from "@/Pages/Hostels/Partials/HostelWorkspaceTabs";

const today = new Date().toISOString().split("T")[0];

export default function Create({ enrollments, hostels, rooms, beds }) {
    const form = useForm({
        academic_session_enrollment_id: "",
        hostel_id: "",
        hostel_room_id: "",
        hostel_bed_id: "",
        allocated_on: today,
        status: "active",
        notes: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("hostel-allocations.store"), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Allocate Hostel Bed" />
            <div className="mx-auto max-w-6xl space-y-6">
                <HostelWorkspaceTabs activeTab="add-allocation" />
                <Form
                    form={{ ...form, onSubmit }}
                    title="Allocate Hostel Bed"
                    description="Assign a hostel bed only after the student is enrolled for the academic session and the hostel invoice has been fully paid."
                    submitLabel="Save Allocation"
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
