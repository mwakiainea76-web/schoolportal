import { Link } from "@inertiajs/react";

export default function TimetableWorkspaceTabs({
    activeTab,
    addHref = null,
    canAdd = true,
}) {
    const tabs = [
        {
            key: "view",
            label: "View Timetable",
            href: route("academic.timetables.index"),
        },
    ];

    if (canAdd && addHref) {
        tabs.push({
            key: "add",
            label: "Add Timetable",
            href: addHref,
        });
    }

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
