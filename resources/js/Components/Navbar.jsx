export default function Navbar({
    open,
    setOpen,
    user,
    logout,
    isLoggingOut,
    setMobileOpen,
}) {
    return (
        <header className="w-full h-14 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20">
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

            <div className="ml-auto flex items-center gap-6 relative">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Updates
                </div>

                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 pl-4 border-l border-zinc-200"
                    >
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                            {user?.last_name?.charAt(0)}
                        </div>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-zinc-100">
                                <p className="text-sm font-semibold text-zinc-800 truncate">
                                    {user?.last_name} {user?.first_name}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="p-1">
                                <button
                                    onClick={logout}
                                    disabled={isLoggingOut}
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
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
