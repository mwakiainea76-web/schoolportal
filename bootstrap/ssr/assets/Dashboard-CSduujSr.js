import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import AdminDashboard from "./AdminDashboard-CBz6pXa2.js";
import BursarDashboard from "./BursarDashboard-BvQIHkzm.js";
import GenericStaffDashboard from "./GenericStaffDashboard-DTtooqUk.js";
import HodDashboard from "./HodDashboard-D00r_kpV.js";
import StudentDashboard from "./StudentDashboard-BYQRqyEz.js";
import TrainerDashboard from "./TrainerDashboard-vDJdoz9-.js";
import "react";
import "lucide-react";
import "./Modal-CaUMk67x.js";
import "@headlessui/react";
import "./date-CQXYOX-2.js";
const ROLE_DASHBOARDS = {
  admin: AdminDashboard,
  bursar: BursarDashboard,
  hod: HodDashboard,
  student: StudentDashboard,
  trainer: TrainerDashboard
};
function Dashboard({ dashboard }) {
  const { auth } = usePage().props;
  const fullName = [auth?.user?.first_name, auth?.user?.last_name].filter(Boolean).join(" ").trim() || "Student";
  const dashboardKey = dashboard?.type ?? dashboard?.role_context?.primary_role ?? "staff";
  const RoleDashboard = ROLE_DASHBOARDS[dashboardKey] ?? GenericStaffDashboard;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsx(RoleDashboard, { dashboard, fullName })
  ] });
}
export {
  Dashboard as default
};
