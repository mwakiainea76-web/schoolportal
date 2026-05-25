import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import { employment_types, staff_status } from "@/constants/constants";

export default function EmploymentStep({
    data,
    setData,
    errors,
    departments,
    roles,
}) {
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
                <InputLabel value="Staff Number" />
                <TextInput
                    name="staff_number"
                    value={data.staff_number}
                    onChange={handleChange}
                    error={errors.staff_number}
                    disabled
                    placeholder="Auto-generated on save"
                />
                <InputError message={errors.staff_number} />
            </div>

            <div>
                <InputLabel value="Designation / Job Title" required />
                <TextInput
                    required
                    name="designation"
                    value={data.designation}
                    onChange={handleChange}
                    error={errors.designation}
                    placeholder="e.g. Lecturer, Registrar, Accountant"
                />
                <InputError message={errors.designation} />
            </div>

            <div>
                <InputLabel value="National ID / Passport No." required />
                <TextInput
                    required
                    name="national_id_number"
                    value={data.national_id_number}
                    onChange={handleChange}
                    error={errors.national_id_number}
                    placeholder="e.g. 12345678"
                />
                <InputError message={errors.national_id_number} />
            </div>

            <div>
                <InputLabel value="Salary" />
                <TextInput
                    type="number"
                    name="salary"
                    value={data.salary}
                    onChange={handleChange}
                    error={errors.salary}
                />
                <InputError message={errors.salary} />
            </div>

            <div>
                <InputLabel value="Department" required />
                <SearchSelect
                    routeName="departments.search"
                    defaultOptions={departments}
                    value={data.department_id}
                    onChange={(d) => setData("department_id", d.id)}
                    error={errors.department_id}
                />
                <InputError message={errors.department_id} />
            </div>

            <div>
                <InputLabel value="Role" required />
                <SearchSelect
                    routeName="roles.search"
                    defaultOptions={roles}
                    value={data.role_name}
                    onChange={(r) => setData("role_name", r.name)}
                    error={errors.role_name}
                />
                <InputError message={errors.role_name} />
            </div>

            <div>
                <InputLabel value="Employment Type" required />
                <SearchSelect
                    defaultOptions={employment_types}
                    value={data.employment_type}
                    onChange={(e) => setData("employment_type", e.name)}
                    error={errors.employment_type}
                />
                <InputError message={errors.employment_type} />
            </div>

            <div>
                <InputLabel value="Date Hired" required />
                <TextInput
                    required
                    type="date"
                    name="hired_date"
                    value={data.hired_date}
                    onChange={handleChange}
                    error={errors.hired_date}
                />
                <InputError message={errors.hired_date} />
            </div>

            <div>
                <InputLabel value="Staff Status" required />
                <SearchSelect
                    defaultOptions={staff_status}
                    value={data.staff_status}
                    onChange={(s) => setData("staff_status", s.name.trim())}
                    error={errors.staff_status}
                />
                <InputError message={errors.staff_status} />
            </div>

            <div>
                <InputLabel value="Highest Qualification" required />
                <TextInput
                    required
                    name="highest_qualification"
                    value={data.highest_qualification}
                    onChange={handleChange}
                    error={errors.highest_qualification}
                    placeholder="e.g. Masters in Education"
                />
                <InputError message={errors.highest_qualification} />
            </div>

            <div>
                <InputLabel value="Specialization" />
                <TextInput
                    name="specialization"
                    value={data.specialization}
                    onChange={handleChange}
                    error={errors.specialization}
                    placeholder="e.g. Mathematics, HR, Procurement"
                />
                <InputError message={errors.specialization} />
            </div>

            <div>
                <InputLabel value="KRA PIN" />
                <TextInput
                    name="kra_pin"
                    value={data.kra_pin}
                    onChange={handleChange}
                    error={errors.kra_pin}
                    placeholder="e.g. A123456789X"
                />
                <InputError message={errors.kra_pin} />
            </div>

            <div>
                <InputLabel value="NHIF Number" />
                <TextInput
                    name="nhif_number"
                    value={data.nhif_number}
                    onChange={handleChange}
                    error={errors.nhif_number}
                />
                <InputError message={errors.nhif_number} />
            </div>

            <div>
                <InputLabel value="NSSF Number" />
                <TextInput
                    name="nssf_number"
                    value={data.nssf_number}
                    onChange={handleChange}
                    error={errors.nssf_number}
                />
                <InputError message={errors.nssf_number} />
            </div>
        </div>
    );
}
