import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import ToggleSwitch from "@/Components/ToggleSwitch";
import {
    gender_types,
    religion,
    disability_types,
} from "@/constants/constants";

export default function PersonalStep({ data, setData, errors }) {
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
                <InputLabel value="First Name" required />
                <TextInput
                    name="first_name"
                    value={data.first_name}
                    onChange={handleChange}
                    error={errors.first_name}
                />
                <InputError message={errors.first_name} />
            </div>

            <div>
                <InputLabel value="Last Name" required />
                <TextInput
                    name="last_name"
                    value={data.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                />
                <InputError message={errors.last_name} />
            </div>

            <div>
                <InputLabel value="Other Name" />
                <TextInput
                    name="other_name"
                    value={data.other_name}
                    onChange={handleChange}
                    error={errors.other_name}
                />
                <InputError message={errors.other_name} />
            </div>

            <div>
                <InputLabel value="Email" required />
                <TextInput
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <InputError message={errors.email} />
            </div>

            <div>
                <InputLabel value="Phone Number" required />
                <TextInput
                    name="phone_number"
                    value={data.phone_number}
                    onChange={handleChange}
                    error={errors.phone_number}
                />
                <InputError message={errors.phone_number} />
            </div>

            <div>
                <InputLabel value="Gender" required />
                <SearchSelect
                    defaultOptions={gender_types}
                    value={data.gender}
                    onChange={(g) => setData("gender", g.name)}
                    error={errors.gender}
                />
                <InputError message={errors.gender} />
            </div>

            <div>
                <InputLabel value="Date of Birth" required />
                <TextInput
                    type="date"
                    name="date_of_birth"
                    value={data.date_of_birth}
                    onChange={handleChange}
                    error={errors.date_of_birth}
                />
                <InputError message={errors.date_of_birth} />
            </div>

            <div>
                <InputLabel value="County" required />
                <TextInput
                    name="county"
                    value={data.county}
                    onChange={handleChange}
                    error={errors.county}
                />
                <InputError message={errors.county} />
            </div>

            <div>
                <InputLabel value="Address" required />
                <TextInput
                    name="address"
                    value={data.address}
                    onChange={handleChange}
                    error={errors.address}
                />
                <InputError message={errors.address} />
            </div>

            <div>
                <InputLabel value="Religion" required />
                <SearchSelect
                    defaultOptions={religion}
                    value={data.religion}
                    onChange={(r) => setData("religion", r.name)}
                    error={errors.religion}
                />
                <InputError message={errors.religion} />
            </div>

            <div>
                <InputLabel value="Medical Condition" />
                <TextInput
                    name="medical_condition"
                    placeholder="e.g. Allergies"
                    value={data.medical_condition}
                    onChange={handleChange}
                    error={errors.medical_condition}
                />
                <InputError message={errors.medical_condition} />
            </div>

            <div className="flex flex-col justify-center">
                <ToggleSwitch
                    label="Person with disability"
                    checked={data.is_pwd}
                    onChange={(v) => setData("is_pwd", v)}
                />
            </div>

            {data.is_pwd && (
                <div>
                    <InputLabel value="Disability Type" />
                    <SearchSelect
                        defaultOptions={disability_types}
                        value={data.disability_type}
                        onChange={(d) => setData("disability_type", d.name)}
                        error={errors.disability_type}
                    />
                    <InputError message={errors.disability_type} />
                </div>
            )}
        </div>
    );
}
