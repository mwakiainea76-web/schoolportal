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
    const hasProgramVersionMappings = courseCurricula.length > 0;
    const handleChange = (e) => setData(e.target.name, e.target.value);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {!hasProgramVersionMappings ? (
                <div className="md:col-span-2 xl:col-span-3 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    You cannot continue with academic details until a program version mapping exists.
                </div>
            ) : null}
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
                <InputLabel value="Program" required />
                <SearchSelect
                    defaultOptions={courseCurricula}
                    value={data.course_curriculum_id}
                    disabled={!hasProgramVersionMappings}
                    onChange={(m) => setData("course_curriculum_id", m.id)}
                    error={errors.course_curriculum_id}
                />
                {!hasProgramVersionMappings ? (
                    <p className="mt-1 text-xs text-amber-600">
                        Create a program version mapping first to continue.
                    </p>
                ) : null}
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

