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
