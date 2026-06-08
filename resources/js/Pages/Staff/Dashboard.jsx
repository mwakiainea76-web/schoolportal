import { Head, Link } from "@inertiajs/react";
import {
    BookMarked,
    CalendarDays,
    ClipboardPenLine,
    GraduationCap,
    Eye,
    Send,
    ShieldCheck,
} from "lucide-react";

export default function StaffDashboard({ dashboard }) {
    const staffProfile = dashboard?.staff_profile ?? {};
    const trainerWorkspace = dashboard?.trainer_workspace ?? {};
    const canManageMarks =
        trainerWorkspace.can_grade_students ||
        (staffProfile.roles || []).some((role) =>
            ["hod", "admin"].includes(String(role).toLowerCase()),
        );

    const quickActions = [
        trainerWorkspace.can_view_timetable
            ? {
                  label: "My Timetable",
                  helper:
                      "Open your timetable already scoped to the current session and your department.",
                  href: route("academic.timetables.index"),
                  icon: CalendarDays,
                  tone: "from-emerald-500 to-teal-500",
              }
            : null,
        canManageMarks
            ? {
                  label: "Add Marks",
                  helper: "Capture marks for units taught within your department workspace.",
                  href: route("academic.marks.add.index"),
                  icon: ClipboardPenLine,
                  tone: "from-sky-500 to-cyan-500",
              }
            : null,
        canManageMarks
            ? {
                  label: "View Marks",
                  helper: "Review submitted marks by assessment, unit, and academic year.",
                  href: route("academic.marks.view.index"),
                  icon: Eye,
                  tone: "from-violet-500 to-indigo-500",
              }
            : null,
        (staffProfile.roles || []).some((role) =>
            ["hod", "admin"].includes(String(role).toLowerCase()),
        )
            ? {
                  label: "Publish Marks",
                  helper: "Approve and publish departmental marks assessment by assessment.",
                  href: route("academic.marks.publish.index"),
                  icon: Send,
                  tone: "from-rose-500 to-orange-500",
              }
            : null,
        canManageMarks
            ? {
                  label: "Unit Marksheet",
                  helper: "Review marksheets and unit-level grading summaries.",
                  href: route("academic.marks.marksheet.index"),
                  icon: BookMarked,
                  tone: "from-amber-500 to-orange-500",
              }
            : null,
    ].filter(Boolean);

    const infoCards = [
        {
            label: "Department",
            value: staffProfile.department_name || "Not linked",
            icon: GraduationCap,
            tone: "from-slate-800 to-slate-700",
        },
        {
            label: "Current Session",
            value: trainerWorkspace.active_session?.name || "No active session",
            icon: ShieldCheck,
            tone: "from-emerald-500 to-teal-500",
        },
        {
            label: "Timetable Sessions",
            value: trainerWorkspace.timetable_sessions_count || 0,
            icon: CalendarDays,
            tone: "from-sky-500 to-cyan-500",
        },
        {
            label: "Recorded Marks",
            value: trainerWorkspace.marks_recorded_count || 0,
            icon: ClipboardPenLine,
            tone: "from-amber-500 to-orange-500",
        },
    ];

    return (
        <>
            <Head title="Staff Dashboard" />

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="relative overflow-hidden rounded-[2rem] bg-[#17324d] px-8 py-10 text-white shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_25%)]" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Staff Workspace
                            </p>
                            <h1 className="mt-3 text-4xl font-bold tracking-tight">
                                {staffProfile.name || "Staff Dashboard"}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm text-slate-300">
                                Keep your teaching work focused in one place with quick access to your timetable,
                                grading, and marksheet tools.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <p className="text-xs uppercase tracking-wide text-slate-300">
                                    Staff Number
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {staffProfile.staff_number || "-"}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <p className="text-xs uppercase tracking-wide text-slate-300">
                                    Designation
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {staffProfile.designation || "Staff"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {infoCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                            >
                                <div
                                    className={`inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-3 text-white shadow-lg`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="mt-5 text-sm font-medium text-zinc-500">
                                    {card.label}
                                </p>
                                <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                                    {card.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                My Tools
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Personal actions for your teaching work in{" "}
                                {staffProfile.department_name || "your department"}.
                            </p>
                        </div>
                        {staffProfile.roles?.length ? (
                            <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                                Roles:{" "}
                                <span className="font-semibold text-zinc-900">
                                    {staffProfile.roles.join(", ")}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {quickActions.length ? (
                            quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="group rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                                    >
                                        <div
                                            className={`inline-flex rounded-2xl bg-gradient-to-br ${action.tone} p-3 text-white shadow-lg`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <p className="mt-5 text-lg font-semibold text-zinc-900">
                                            {action.label}
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {action.helper}
                                        </p>
                                        <p className="mt-4 text-sm font-medium text-emerald-700 transition group-hover:text-emerald-800">
                                            Open workspace
                                        </p>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-500">
                                No trainer-specific tools are enabled on this account yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
