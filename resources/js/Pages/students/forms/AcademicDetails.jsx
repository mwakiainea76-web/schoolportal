import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import { student_status, modules } from "@/constants/constants";

export default function AcademicStep({
    data,
    setData,
    errors,
    courseCurricula,
    isEdit = false,
}) {
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
                <InputLabel value="Previous School" required />
                <TextInput
                    name="previous_school"
                    placeholder="e.g. Nairobi School"
                    value={data.previous_school}
                    onChange={handleChange}
                    error={errors.previous_school}
                />
                <InputError message={errors.previous_school} />
            </div>

            <div>
                <InputLabel value="Course" required />
                <SearchSelect
                    defaultOptions={courseCurricula}
                    value={data.course_curriculum_id}
                    onChange={(m) => setData("course_curriculum_id", m.id)}
                    error={errors.course_curriculum_id}
                />
                <InputError message={errors.course_curriculum_id} />
            </div>
            <div>
                <InputLabel value="Current Module" required />
                <SearchSelect
                    defaultOptions={modules}
                    value={data.current_module}
                    onChange={(m) => setData("current_module", m.name)}
                    error={errors.current_module}
                />
                <InputError message={errors.current_module} />
            </div>

            <div>
                <InputLabel value="Fee Discount (%)" />
                <TextInput
                    type="number"
                    name="fee_discount_percentage"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={data.fee_discount_percentage}
                    onChange={handleChange}
                    error={errors.fee_discount_percentage}
                />
                <InputError message={errors.fee_discount_percentage} />
            </div>

            {/* Status only shown on edit */}
            {isEdit && (
                <div>
                    <InputLabel value="Student Status" />
                    <SearchSelect
                        defaultOptions={student_status}
                        value={data.student_status}
                        onChange={(s) => setData("student_status", s.name)}
                        error={errors.student_status}
                    />
                    <InputError message={errors.student_status} />
                </div>
            )}
        </div>
    );
}
