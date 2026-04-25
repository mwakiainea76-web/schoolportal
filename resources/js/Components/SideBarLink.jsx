import { Link } from "@inertiajs/react";

export default function NavLink({ href, label, active, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center pl-10 py-2 text-sm transition ${
                active
                    ? "text-emerald-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-200"
            }`}
        >
            <span
                className={`w-1.5 h-1.5 mr-3 rounded-full transition ${
                    active ? "bg-emerald-500" : "bg-zinc-700"
                }`}
            />
            {label}
        </Link>
    );
}
