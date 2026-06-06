import { Link } from "@inertiajs/react";

export default function AcademicCalendarWorkspaceTabs({
    activeTab,
}) {
    const tabs = [
        {
            key: "years",
            label: "Academic Years",
            href: route("academic.years.index"),
        },
        {
            key: "sessions",
            label: "Academic Sessions",
            href: route("academic.sessions.index"),
        },
    ];

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
