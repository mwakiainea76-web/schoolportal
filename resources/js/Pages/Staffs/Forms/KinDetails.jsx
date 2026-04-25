import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import { relation_type } from "@/constants/constants";

export default function KinStep({ data, setData, errors }) {
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
                <InputLabel value="First Name" />
                <TextInput
                    name="kin_first_name"
                    value={data.kin_first_name}
                    onChange={handleChange}
                    error={errors.kin_first_name}
                />
                <InputError message={errors.kin_first_name} />
            </div>

            <div>
                <InputLabel value="Last Name" />
                <TextInput
                    name="kin_last_name"
                    value={data.kin_last_name}
                    onChange={handleChange}
                    error={errors.kin_last_name}
                />
                <InputError message={errors.kin_last_name} />
            </div>

            <div>
                <InputLabel value="Relationship" />
                <SearchSelect
                    defaultOptions={relation_type}
                    value={data.kin_relationship}
                    onChange={(r) => setData("kin_relationship", r.name)}
                    error={errors.kin_relationship}
                />
                <InputError message={errors.kin_relationship} />
            </div>

            <div>
                <InputLabel value="Phone" />
                <TextInput
                    name="kin_phone"
                    value={data.kin_phone}
                    onChange={handleChange}
                    error={errors.kin_phone}
                />
                <InputError message={errors.kin_phone} />
            </div>

            <div>
                <InputLabel value="Alternative Phone" />
                <TextInput
                    name="kin_alt_phone"
                    value={data.kin_alt_phone}
                    onChange={handleChange}
                    error={errors.kin_alt_phone}
                />
                <InputError message={errors.kin_alt_phone} />
            </div>

            <div>
                <InputLabel value="Email" />
                <TextInput
                    name="kin_email"
                    value={data.kin_email}
                    onChange={handleChange}
                    error={errors.kin_email}
                />
                <InputError message={errors.kin_email} />
            </div>
        </div>
    );
}
