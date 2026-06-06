import { Link } from "@inertiajs/react";

export default function AccessWorkspaceTabs({
    activeTab,
    roleId = null,
    permissionId = null,
}) {
    const tabs = [
        {
            key: "roles",
            label: "Roles",
            href: route("roles.index"),
        },
        {
            key: "add-role",
            label: "Add Role",
            href: route("roles.create"),
        },
        ...(roleId
            ? [
                  {
                      key: "edit-role",
                      label: "Edit Role",
                      href: route("roles.edit", roleId),
                  },
              ]
            : []),
        {
            key: "permissions",
            label: "Permissions",
            href: route("permissions.index"),
        },
        {
            key: "add-permission",
            label: "Add Permission",
            href: route("permissions.create"),
        },
        ...(permissionId
            ? [
                  {
                      key: "edit-permission",
                      label: "Edit Permission",
                      href: route("permissions.edit", permissionId),
                  },
              ]
            : []),
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
