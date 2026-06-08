import { Head, useForm } from "@inertiajs/react";
import Form from "./Form";

export default function Create() {
    const form = useForm({
        name: "",
        code: "",
        session_fee_amount: "",
        gender: "",
        location: "",
        description: "",
        is_active: true,
        rooms: [{ id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true }],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("hostels.store"), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Create Hostel" />
            <div className="mx-auto max-w-6xl space-y-6">
                <Form
                    form={{ ...form, onSubmit }}
                    title="Create Hostel"
                    description="Set up a boarding hostel, define its room structure, and generate beds that can later be allocated per academic session."
                    submitLabel="Save Hostel"
                    cancelHref={route("hostels.index")}
                />
            </div>
        </>
    );
}
