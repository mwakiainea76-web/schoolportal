import { Head, usePage } from "@inertiajs/react";
import AdminDashboard from "@/Pages/Dashboards/AdminDashboard";
import BursarDashboard from "@/Pages/Dashboards/BursarDashboard";
import GenericStaffDashboard from "@/Pages/Dashboards/GenericStaffDashboard";
import HodDashboard from "@/Pages/Dashboards/HodDashboard";
import StudentDashboard from "@/Pages/Dashboards/StudentDashboard";
import TrainerDashboard from "@/Pages/Dashboards/TrainerDashboard";

const ROLE_DASHBOARDS = {
    admin: AdminDashboard,
    bursar: BursarDashboard,
    hod: HodDashboard,
    student: StudentDashboard,
    trainer: TrainerDashboard,
};

export default function Dashboard({ dashboard }) {
    const { auth } = usePage().props;
    const fullName =
        [auth?.user?.first_name, auth?.user?.last_name]
            .filter(Boolean)
            .join(" ")
            .trim() || "Student";

    const dashboardKey =
        dashboard?.type ?? dashboard?.role_context?.primary_role ?? "staff";
    const RoleDashboard =
        ROLE_DASHBOARDS[dashboardKey] ?? GenericStaffDashboard;

    return (
        <>
            <Head title="Dashboard" />
            <RoleDashboard dashboard={dashboard} fullName={fullName} />
        </>
    );
}
