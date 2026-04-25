import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import { employment_types } from "@/constants/constants";

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
                <InputLabel value="Staff Number" required />
                <TextInput
                    required
                    name="staff_number"
                    value={data.staff_number}
                    onChange={handleChange}
                    error={errors.staff_number}
                />
                <InputError message={errors.staff_number} />
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
        </div>
    );
}
