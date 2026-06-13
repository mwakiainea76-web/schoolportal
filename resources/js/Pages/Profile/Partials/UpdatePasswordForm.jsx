import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { KeyRound, Lock, ShieldCheck } from "lucide-react";

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6 max-w-2xl">
                <div className="space-y-1.5">
                    <InputLabel
                        htmlFor="current_password"
                        className="text-zinc-600 font-semibold"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <InputLabel 
                            htmlFor="password" 
                            className="text-zinc-600 font-semibold"
                            value="New Password" 
                        />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                            autoComplete="new-password"
                        />

                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="password_confirmation"
                            className="text-zinc-600 font-semibold"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="block w-full border-zinc-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <p className="text-sm font-medium text-sky-600">
                            Password updated.
                        </p>
                    </Transition>

                    <PrimaryButton 
                        disabled={processing}
                        className="bg-zinc-900 hover:bg-zinc-800 rounded-xl px-8 h-11"
                    >
                        {processing ? 'Saving...' : 'Update Password'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
