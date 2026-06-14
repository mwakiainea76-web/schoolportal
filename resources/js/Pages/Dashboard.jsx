import { Head, usePage } from "@inertiajs/react";
import AdminDashboard from "@/Pages/Dashboards/AdminDashboard";
import BursarDashboard from "@/Pages/Dashboards/BursarDashboard";
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

    const dashboardKey = dashboard?.type;
    const RoleDashboard = ROLE_DASHBOARDS[dashboardKey];

    return (
        <>
            <Head title="Dashboard" />
            {RoleDashboard ? (
                <RoleDashboard dashboard={dashboard} fullName={fullName} />
            ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    No dashboard is configured for this account.
                </div>
            )}
        </>
    );
}
