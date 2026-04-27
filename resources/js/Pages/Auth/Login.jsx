import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-slate-400 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-800">
                            Editrack
                        </h1>
                        <p className="text-sm text-slate-600">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="mb-4 text-sm text-emerald-600 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <InputLabel value="Email" required />
                            <TextInput
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoFocus
                            />
                            <InputError message={errors.email} />
                        </div>
                        {/* Password */}
                        <div>
                            <InputLabel value="Password" required />

                            <div className="relative">
                                <TextInput
                                    type={showPassword ? "text" : "password"} // ✅ toggle type
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                />

                                {/* Toggle button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            <InputError message={errors.password} />
                        </div>
                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <ToggleSwitch
                                label="Remember me"
                                checked={data.remember}
                                onChange={(v) => setData("remember", v)}
                            />

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-emerald-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
                        >
                            {processing ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
