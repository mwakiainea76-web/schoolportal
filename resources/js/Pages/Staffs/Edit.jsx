import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import ToggleSwitch from "@/Components/ToggleSwitch";
import {
    disability_types,
    employment_types,
    gender_types,
    relation_type,
    religion,
    staff_status,
} from "@/constants/constants";

function FormSection({ title, children }) {
    return (
        <section className="overflow-visible rounded-lg">
            <div className="bg-zinc-200 px-5 py-3 text-center">
                <h2 className="text-sm font-semibold text-zinc-800">
                    {title}
                </h2>
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}

function PersonalSection({ data, setData, errors }) {
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div>
                <InputLabel value="First Name" required />
                <TextInput name="first_name" value={data.first_name} onChange={handleChange} error={errors.first_name} />
                <InputError message={errors.first_name} />
            </div>
            <div>
                <InputLabel value="Last Name" required />
                <TextInput name="last_name" value={data.last_name} onChange={handleChange} error={errors.last_name} />
                <InputError message={errors.last_name} />
            </div>
            <div>
                <InputLabel value="Other Name" />
                <TextInput name="other_name" value={data.other_name} onChange={handleChange} error={errors.other_name} />
                <InputError message={errors.other_name} />
            </div>
            <div>
                <InputLabel value="Email" required />
                <TextInput type="email" name="email" value={data.email} onChange={handleChange} error={errors.email} />
                <InputError message={errors.email} />
            </div>
            <div>
                <InputLabel value="Phone Number" required />
                <TextInput name="phone_number" value={data.phone_number} onChange={handleChange} error={errors.phone_number} />
                <InputError message={errors.phone_number} />
            </div>
            <div>
                <InputLabel value="Gender" required />
                <SearchSelect defaultOptions={gender_types} value={data.gender} onChange={(g) => setData("gender", g.name)} error={errors.gender} />
                <InputError message={errors.gender} />
            </div>
            <div>
                <InputLabel value="Date of Birth" required />
                <TextInput type="date" name="date_of_birth" value={data.date_of_birth} onChange={handleChange} error={errors.date_of_birth} />
                <InputError message={errors.date_of_birth} />
            </div>
            <div>
                <InputLabel value="County" required />
                <TextInput name="county" value={data.county} onChange={handleChange} error={errors.county} />
                <InputError message={errors.county} />
            </div>
            <div>
                <InputLabel value="Address" required />
                <TextInput name="address" value={data.address} onChange={handleChange} error={errors.address} />
                <InputError message={errors.address} />
            </div>
            <div>
                <InputLabel value="Religion" required />
                <SearchSelect defaultOptions={religion} value={data.religion} onChange={(r) => setData("religion", r.name)} error={errors.religion} />
                <InputError message={errors.religion} />
            </div>
            <div>
                <InputLabel value="Any medical condition" />
                <TextInput name="medical_condition" value={data.medical_condition} onChange={handleChange} error={errors.medical_condition} />
                <InputError message={errors.medical_condition} />
            </div>
            <div className="flex flex-col justify-center">
                <ToggleSwitch label="Person with disability" checked={data.is_pwd} onChange={(v) => setData("is_pwd", v)} />
            </div>
            {data.is_pwd ? (
                <div>
                    <InputLabel value="Disability Type" />
                    <SearchSelect defaultOptions={disability_types} value={data.disability_type} onChange={(d) => setData("disability_type", d.name)} error={errors.disability_type} />
                    <InputError message={errors.disability_type} />
                </div>
            ) : null}
        </div>
    );
}

function EmploymentSection({ data, setData, errors, departments, roles }) {
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div>
                <InputLabel value="Staff Number" />
                <TextInput name="staff_number" value={data.staff_number} onChange={handleChange} error={errors.staff_number} disabled placeholder="Auto-generated on save" />
                <InputError message={errors.staff_number} />
            </div>
            <div>
                <InputLabel value="Designation / Job Title" required />
                <TextInput required name="designation" value={data.designation} onChange={handleChange} error={errors.designation} placeholder="e.g. Lecturer, Registrar, Accountant" />
                <InputError message={errors.designation} />
            </div>
            <div>
                <InputLabel value="National ID / Passport No." required />
                <TextInput required name="national_id_number" value={data.national_id_number} onChange={handleChange} error={errors.national_id_number} placeholder="e.g. 12345678" />
                <InputError message={errors.national_id_number} />
            </div>
            <div>
                <InputLabel value="Salary" />
                <TextInput type="number" name="salary" value={data.salary} onChange={handleChange} error={errors.salary} />
                <InputError message={errors.salary} />
            </div>
            <div>
                <InputLabel value="Department" required />
                <SearchSelect routeName="departments.search" defaultOptions={departments} value={data.department_id} onChange={(d) => setData("department_id", d.id)} error={errors.department_id} />
                <InputError message={errors.department_id} />
            </div>
            <div>
                <InputLabel value="Role" required />
                <SearchSelect routeName="roles.search" defaultOptions={roles} value={data.role_name} onChange={(r) => setData("role_name", r.name)} error={errors.role_name} />
                <InputError message={errors.role_name} />
            </div>
            <div>
                <InputLabel value="Employment Type" required />
                <SearchSelect defaultOptions={employment_types} value={data.employment_type} onChange={(e) => setData("employment_type", e.name)} error={errors.employment_type} />
                <InputError message={errors.employment_type} />
            </div>
            <div>
                <InputLabel value="Date Hired" required />
                <TextInput required type="date" name="hired_date" value={data.hired_date} onChange={handleChange} error={errors.hired_date} />
                <InputError message={errors.hired_date} />
            </div>
            <div>
                <InputLabel value="Staff Status" required />
                <SearchSelect defaultOptions={staff_status} value={data.staff_status} onChange={(s) => setData("staff_status", s.name.trim())} error={errors.staff_status} />
                <InputError message={errors.staff_status} />
            </div>
            <div>
                <InputLabel value="Highest Qualification" required />
                <TextInput required name="highest_qualification" value={data.highest_qualification} onChange={handleChange} error={errors.highest_qualification} placeholder="e.g. Masters in Education" />
                <InputError message={errors.highest_qualification} />
            </div>
            <div>
                <InputLabel value="Specialization" />
                <TextInput name="specialization" value={data.specialization} onChange={handleChange} error={errors.specialization} placeholder="e.g. Mathematics, HR, Procurement" />
                <InputError message={errors.specialization} />
            </div>
            <div>
                <InputLabel value="KRA PIN" />
                <TextInput name="kra_pin" value={data.kra_pin} onChange={handleChange} error={errors.kra_pin} placeholder="e.g. A123456789X" />
                <InputError message={errors.kra_pin} />
            </div>
            <div>
                <InputLabel value="NHIF Number" />
                <TextInput name="nhif_number" value={data.nhif_number} onChange={handleChange} error={errors.nhif_number} />
                <InputError message={errors.nhif_number} />
            </div>
            <div>
                <InputLabel value="NSSF Number" />
                <TextInput name="nssf_number" value={data.nssf_number} onChange={handleChange} error={errors.nssf_number} />
                <InputError message={errors.nssf_number} />
            </div>
        </div>
    );
}

function KinSection({ data, setData, errors }) {
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div>
                <InputLabel value="First Name" required />
                <TextInput name="kin_first_name" value={data.kin_first_name} onChange={handleChange} error={errors.kin_first_name} />
                <InputError message={errors.kin_first_name} />
            </div>
            <div>
                <InputLabel value="Last Name" required />
                <TextInput name="kin_last_name" value={data.kin_last_name} onChange={handleChange} error={errors.kin_last_name} />
                <InputError message={errors.kin_last_name} />
            </div>
            <div>
                <InputLabel value="Relationship" required />
                <SearchSelect defaultOptions={relation_type} value={data.kin_relationship} onChange={(r) => setData("kin_relationship", r.name)} error={errors.kin_relationship} />
                <InputError message={errors.kin_relationship} />
            </div>
            <div>
                <InputLabel value="Phone" required />
                <TextInput name="kin_phone" value={data.kin_phone} onChange={handleChange} error={errors.kin_phone} />
                <InputError message={errors.kin_phone} />
            </div>
            <div>
                <InputLabel value="Alternative Phone" />
                <TextInput name="kin_alt_phone" value={data.kin_alt_phone} onChange={handleChange} error={errors.kin_alt_phone} />
                <InputError message={errors.kin_alt_phone} />
            </div>
            <div>
                <InputLabel value="Email" />
                <TextInput name="kin_email" value={data.kin_email} onChange={handleChange} error={errors.kin_email} />
                <InputError message={errors.kin_email} />
            </div>
        </div>
    );
}

export default function EditStaff({ staff, departments, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        other_name: staff.other_name || "",
        email: staff.email || "",
        phone_number: staff.phone_number || "",
        gender: staff.gender || "",
        date_of_birth: staff.date_of_birth || "",
        county: staff.county || "",
        address: staff.address || "",
        religion: staff.religion || "",
        is_pwd: staff.is_pwd ?? false,
        disability_type: staff.disability_type || "",
        medical_condition: staff.medical_condition || "",
        profile_photo: null,
        department_id: staff.department_id || "",
        staff_number: staff.staff_number || "",
        role_name: staff.role_name || "",
        designation: staff.designation || "",
        national_id_number: staff.national_id_number || "",
        salary: staff.salary || "",
        employment_type: staff.employment_type || "",
        hired_date: staff.hired_date || "",
        staff_status: staff.staff_status || "",
        highest_qualification: staff.highest_qualification || "",
        specialization: staff.specialization || "",
        kra_pin: staff.kra_pin || "",
        nhif_number: staff.nhif_number || "",
        nssf_number: staff.nssf_number || "",
        kin_first_name: staff.next_of_kin?.[0]?.first_name || "",
        kin_last_name: staff.next_of_kin?.[0]?.last_name || "",
        kin_relationship: staff.next_of_kin?.[0]?.relationship || "",
        kin_phone: staff.next_of_kin?.[0]?.phone_number || "",
        kin_alt_phone: staff.next_of_kin?.[0]?.alternate_phone_number || "",
        kin_email: staff.next_of_kin?.[0]?.email || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("staffs.update", staff.id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Edit Staff" />

            <div className="mx-auto w-full">
                <div className="rounded-xl pt-2">
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <form onSubmit={submit} className="space-y-5 p-0">
                            <FormSection title="Personal Details">
                                <PersonalSection
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </FormSection>

                            <FormSection title="Employment Details">
                                <EmploymentSection
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    departments={departments}
                                    roles={roles}
                                />
                            </FormSection>

                            <FormSection title="Next of Kin">
                                <KinSection
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </FormSection>

                            <div className="flex justify-between px-4 pb-4 pt-0">
                                <Link
                                    href={route("staffs.index")}
                                    className="rounded-lg bg-zinc-400 px-5 py-2 text-sm text-white transition hover:bg-zinc-500"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Staff"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
