import { jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function DepartmentWorkspaceTabs({ activeTab }) {
  const tabs = [
    {
      key: "departments",
      label: "Departments",
      href: route("departments.index")
    },
    {
      key: "add-department",
      label: "Add Department",
      href: route("departments.create")
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex flex-nowrap gap-3 overflow-x-auto border-b border-zinc-200 mb-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent", children: tabs.map((tab) => /* @__PURE__ */ jsx(
    Link,
    {
      href: tab.href,
      className: `whitespace-nowrap px-2 py-2 text-sm transition ${activeTab === tab.key ? "border-b-2 border-b-emerald-600 text-zinc-700 font-bold" : "text-zinc-600 hover:bg-zinc-50 font-semibold"}`,
      children: tab.label
    },
    tab.key
  )) });
}
export {
  DepartmentWorkspaceTabs as default
};
