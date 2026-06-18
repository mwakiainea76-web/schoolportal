import { Link } from "@inertiajs/react";

export default function NavLink({
    href,
    label,
    active,
    onClick,
    depth = 0,
    collapsed = false,
}) {
    const paddingClass = depth > 0 ? "pl-16" : "pl-12";

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex min-h-9 items-center gap-3 px-4 ${paddingClass} text-sm leading-5 transition ${
                active
                    ? "text-emerald-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-200"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${
                    active ? "bg-emerald-500" : "bg-zinc-700"
                }`}
            />
            <span
                className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${
                    collapsed ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100"
                }`}
            >
                <span className="truncate">{label}</span>
            </span>
        </Link>
    );
}
