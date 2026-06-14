import {
    BookMarked,
    CreditCard,
    ShieldCheck,
    Wallet,
} from "lucide-react";

export default function BursarDashboard({ dashboard }) {
    const overviewCards = [
        {
            label: "Courses",
            value: dashboard.stats?.[0]?.value ?? 0,
            icon: BookMarked,
            tone: "bg-slate-100 text-slate-700",
        },
        {
            label: "Finance Workspace",
            value: "Billing",
            icon: Wallet,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Collections",
            value: "Payments",
            icon: CreditCard,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Approvals",
            value: "Invoices",
            icon: ShieldCheck,
            tone: "bg-sky-50 text-sky-600",
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Finance Overview
            </h1>
            <p className="mt-1 text-zinc-500">
                Track collections, billing workflows, and approval operations
                for the bursary workspace.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`inline-flex rounded-2xl p-3 ${card.tone}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm font-medium text-zinc-500">
                                {card.label}
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                                {card.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
