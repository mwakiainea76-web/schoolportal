import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import AdminDashboard from "./AdminDashboard-Pd-CVQBt.js";
import BursarDashboard from "./BursarDashboard-BpDXTMsJ.js";
import HodDashboard from "./HodDashboard-Baa1Ho9o.js";
import StudentDashboard from "./StudentDashboard-BYQRqyEz.js";
import TrainerDashboard from "./TrainerDashboard-BneZlsT9.js";
import "lucide-react";
import "react";
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
  const dashboardKey = dashboard?.type;
  const RoleDashboard = ROLE_DASHBOARDS[dashboardKey];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    RoleDashboard ? /* @__PURE__ */ jsx(RoleDashboard, { dashboard, fullName }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700", children: "No dashboard is configured for this account." })
  ] });
}
export {
  Dashboard as default
};
