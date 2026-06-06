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
