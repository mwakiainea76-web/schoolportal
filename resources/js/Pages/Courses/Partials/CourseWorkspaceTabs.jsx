import { Link } from "@inertiajs/react";

export default function CourseWorkspaceTabs({ activeTab }) {
    const tabs = [
        {
            key: "courses",
            label: "Courses",
            href: route("courses.index"),
        },
        {
            key: "add-course",
            label: "Add Course",
            href: route("courses.create"),
        },
        {
            key: "curriculums",
            label: "Curriculums",
            href: route("curriculums.index"),
        },
        {
            key: "add-curriculum",
            label: "Add Curriculum",
            href: route("curriculums.create"),
        },
        {
            key: "mappings",
            label: "Curriculum Mapping",
            href: route("courses.curriculum-mappings.index"),
        },
        {
            key: "add-mapping",
            label: "Add Mapping",
            href: route("courses.curriculum-mappings.create"),
        },
        {
            key: "units",
            label: "Units",
            href: route("units.index"),
        },
        {
            key: "add-unit",
            label: "Add Unit",
            href: route("units.create"),
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
