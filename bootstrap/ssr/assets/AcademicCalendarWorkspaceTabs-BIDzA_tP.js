import { jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function AcademicCalendarWorkspaceTabs({
  activeTab,
  enrollmentId = null
}) {
  const tabs = [
    {
      key: "years",
      label: "Academic Years",
      href: route("academic.years.index")
    },
    {
      key: "add-year",
      label: "Add Academic Year",
      href: route("academic.years.create")
    },
    {
      key: "sessions",
      label: "Academic Sessions",
      href: route("academic.sessions.index")
    },
    {
      key: "add-session",
      label: "Add Academic Session",
      href: route("academic.sessions.create")
    },
    {
      key: "enrollments",
      label: "View Session Enrollments",
      href: route("academic.sessions.enrollments.index")
    },
    {
      key: "add-enrollment",
      label: "Create Session Enrollment",
      href: route("academic.sessions.enrollments.create")
    }
  ];
  if (enrollmentId) {
    tabs.push({
      key: "edit-enrollment",
      label: "Edit Session Enrollment",
      href: route("academic.sessions.enrollments.edit", enrollmentId)
    });
  }
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
  AcademicCalendarWorkspaceTabs as default
};
