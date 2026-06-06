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
        <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeTab === tab.key
                            ? "bg-emerald-600 text-white"
                            : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
