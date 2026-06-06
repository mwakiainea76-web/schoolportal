import { Link } from "@inertiajs/react";

const tabs = [
    {
        key: "view-hostels",
        label: "View Hostels",
        href: route("hostels.index"),
    },
    {
        key: "add-hostel",
        label: "Add Hostel",
        href: route("hostels.create"),
    },
    {
        key: "view-allocations",
        label: "View Allocations",
        href: route("hostel-allocations.index"),
    },
    {
        key: "add-allocation",
        label: "Add Allocation",
        href: route("hostel-allocations.create"),
    },
];

export default function HostelWorkspaceTabs({ activeTab }) {
    return (
        <div className="flex flex-nowrap gap-3 overflow-x-auto border-b border-zinc-200 mb-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent">
            {tabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href}
                    className={`whitespace-nowrap px-2 py-2 text-sm transition ${
                        activeTab === tab.key
                            ? "border-b-2 border-b-emerald-600 text-zinc-700 font-bold"
                            : "text-zinc-600 hover:bg-zinc-50 font-semibold"
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
