import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthenticatedLayout({ header, children }) {
    const { flash } = usePage().props;
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const logout = () => {
        router.post(route("logout"));
    };
    // ✅ Toast trigger from Laravel flash
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] text-zinc-900">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="w-full h-20 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20">
                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2.5 mr-4 rounded-xl hover:bg-zinc-50 text-zinc-400 transition-all hover:text-emerald-600 active:scale-95 lg:hidden"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* RIGHT SIDE */}
                    <div className="ml-auto flex items-center gap-6 relative">
                        {/* STATUS */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Updates
                        </div>

                        {/* USER DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-3 pl-4 border-l border-zinc-200"
                            >
                                {/* USER INFO */}

                                {/* AVATAR */}
                                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                                    {user?.last_name?.charAt(0)}
                                </div>
                            </button>

                            {/* DROPDOWN */}
                            {open && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
                                    {/* USER INFO HEADER */}
                                    <div className="px-4 py-3 border-b border-zinc-100">
                                        <p className="text-sm font-semibold text-zinc-800 truncate">
                                            {user?.last_name} {user?.first_name}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="p-1">
                                        <button
                                            onClick={() =>
                                                router.post(route("logout"))
                                            }
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                                                />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="px-10 pt-4 max-w-7xl flex-1 overflow-y-auto mb-8">
                    {header && <div className="mb-8">{header}</div>}

                    {children}
                </main>

                {/* ✅ Toastify container (GLOBAL ONLY ONCE) */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="light"
                />
            </div>
        </div>
    );
}
