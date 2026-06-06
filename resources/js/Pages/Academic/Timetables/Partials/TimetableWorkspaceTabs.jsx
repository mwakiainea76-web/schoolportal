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
