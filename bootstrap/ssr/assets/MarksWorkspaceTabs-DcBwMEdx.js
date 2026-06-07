import { jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
const tabs = [
  { key: "add", label: "Add Marks", routeName: "academic.marks.add.index" },
  {
    key: "view",
    label: "View Marks",
    routeName: "academic.marks.view.index"
  },
  {
    key: "marksheet",
    label: "Marksheet",
    routeName: "academic.marks.marksheet.index"
  },
  {
    key: "publish",
    label: "Publish Marks",
    routeName: "academic.marks.publish.index"
  }
];
function MarksWorkspaceTabs({ activeTab, canPublish }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-nowrap gap-3 overflow-x-auto border-b border-zinc-200 mb-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent", children: tabs.filter((tab) => canPublish || tab.key !== "publish").map((tab) => /* @__PURE__ */ jsx(
    Link,
    {
      href: route(tab.routeName),
      className: `whitespace-nowrap px-2 py-2 text-sm transition ${activeTab === tab.key ? "border-b-2 border-b-emerald-600 text-zinc-700 font-bold" : "text-zinc-600 hover:bg-zinc-50 font-semibold"}`,
      children: tab.label
    },
    tab.key
  )) });
}
export {
  MarksWorkspaceTabs as default
};
