import { Link } from "@inertiajs/react";

const tabs = [
    { key: "add", label: "Add Marks", routeName: "academic.marks.add.index" },
    { key: "view", label: "View Marks", routeName: "academic.marks.view.index" },
    {
        key: "publish",
        label: "Publish Marks",
        routeName: "academic.marks.publish.index",
    },
];

export default function MarksWorkspaceTabs({ activeTab, canPublish }) {
    return (
        <div className="flex flex-wrap gap-3">
            {tabs
                .filter((tab) => canPublish || tab.key !== "publish")
                .map((tab) => (
                    <Link
                        key={tab.key}
                        href={route(tab.routeName)}
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
