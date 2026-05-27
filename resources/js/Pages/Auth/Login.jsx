import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

import ApplicationLogo from "@/Components/ApplicationLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import ToggleSwitch from "@/Components/ToggleSwitch";

const campusPhoto =
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
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

            <div className="h-screen overflow-hidden bg-stone-100">
                <div className="grid h-screen lg:grid-cols-[1.18fr_0.82fr]">
                    <div className="relative hidden overflow-hidden lg:block">
                        <img
                            src={campusPhoto}
                            alt="School building"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-y-0 right-[-1px] w-32 bg-[#f6f7fb] [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)]" />
                    </div>

                    <div className="relative flex h-screen items-start justify-center bg-[#f6f7fb] px-4 pt-8 sm:px-8 sm:pt-12 lg:pt-8 xl:pt-10">
                        <div className="absolute inset-y-0 left-0 hidden w-28 bg-white/35 lg:block [clip-path:polygon(0_0,68%_0,22%_100%,0_100%)]" />
                        <div className="w-full max-w-[400px]">
                            <div className="mb-6 text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
                                    <ApplicationLogo className="h-12 w-12 fill-current text-emerald-700" />
                                </div>
                                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                                    Hi, welcome back
                                </h2>
                                <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                                    Please fill in your details to log in
                                </p>
                            </div>

                            <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-zinc-100 sm:p-8">
                                {status && (
                                    <div className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <InputLabel value="Username" required />
                                        <TextInput
                                            type="text"
                                            name="login"
                                            value={data.login}
                                            onChange={handleChange}
                                            error={errors.login}
                                            placeholder="Student No / Employee No"
                                            autoFocus
                                            className="mt-2 bg-white"
                                        />
                                        <InputError message={errors.login} />
                                    </div>

                                    <div>
                                        <InputLabel value="Password" required />

                                        <div className="relative mt-2">
                                            <TextInput
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                onChange={handleChange}
                                                error={errors.password}
                                                placeholder="Enter your password"
                                                className="bg-white pr-16"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                        <ToggleSwitch
                                            label="Remember me"
                                            checked={data.remember}
                                            onChange={(v) =>
                                                setData("remember", v)
                                            }
                                        />

                                        {canResetPassword && (
                                            <Link
                                                href={route(
                                                    "password.request",
                                                )}
                                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                            >
                                                Forgot Password?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Signing In..."
                                            : "Sign In"}
                                    </button>
                                </form>
                            </div>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                <p>
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-semibold text-emerald-600 hover:underline"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                                <p className="mt-6 text-slate-500">
                                    Copyright (c) 2026 - Mago Technical College
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
