import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

export function SearchSelectField({
    label,
    value,
    options,
    onChange,
    error,
    placeholder,
}) {
    return (
        <div className="space-y-2">
            <InputLabel value={label} required />
            <SelectInput
                value={value}
                defaultOptions={options}
                placeholder={placeholder}
                error={Boolean(error)}
                onChange={(item) => onChange(item?.id ?? "")}
            />
            <InputError message={error} />
        </div>
    );
}

export function TextField({ label, error, className = "", ...props }) {
    return (
        <div className="space-y-2">
            <InputLabel value={label} required={props.required} />
            <TextInput
                error={Boolean(error)}
                className={className}
                {...props}
            />
            <InputError message={error} />
        </div>
    );
}

export function TextAreaField({ label, error, className = "", ...props }) {
    return (
        <div className="space-y-2">
            <InputLabel value={label} required={props.required} />
            <TextArea
                className={`rounded-xl border bg-zinc-50 px-5 py-3 text-sm ${
                    error ? "border-red-400" : "border-zinc-200"
                } ${className}`}
                {...props}
            />
            <InputError message={error} />
        </div>
    );
}

export function NativeSelectField({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
}) {
    return (
        <div className="space-y-2">
            <InputLabel value={label} required={required} />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm ${
                    error ? "border-red-400" : "border-zinc-200"
                }`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <InputError message={error} />
        </div>
    );
}
