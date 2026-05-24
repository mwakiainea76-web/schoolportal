import { Link } from "@inertiajs/react";
import { CreditCard, FilePlus2, ShieldAlert, Wallet } from "lucide-react";
import FormScaffold from "./FormScaffold";
import ActionCard from "./ActionCard";

export default function Index() {
    return (
        <FormScaffold
            title="Manual Billing"
            description="Choose a focused billing action instead of working through one crowded page."
            backHref={route("billing.invoices.index")}
            backLabel="Back to invoices"
        >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ActionCard
                    href={route("billing.manual.invoices.create")}
                    icon={FilePlus2}
                    title="Additional Invoice"
                    description="Raise a new manual charge for a student enrollment."
                />
                <ActionCard
                    href={route("billing.manual.payments.create")}
                    icon={CreditCard}
                    title="Record Payment"
                    description="Post a student payment and credit the ledger."
                />
                <ActionCard
                    href={route("billing.manual.penalties.create")}
                    icon={ShieldAlert}
                    title="Post Penalty"
                    description="Add a penalty that increases the student balance."
                />
                <ActionCard
                    href={route("billing.manual.adjustments.create")}
                    icon={Wallet}
                    title="Fee Adjustment"
                    description="Apply discount, waiver, bursary, HELB, refund payout, reversal, or other adjustments."
                />
            </div>

            <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">
                    Billing Notes
                </h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                    <p>
                        Additional invoices create a new invoice and a matching
                        ledger debit.
                    </p>
                    <p>
                        Payments reduce debt and post a ledger credit on the
                        selected invoice.
                    </p>
                    <p>
                        Penalties and adjustments update the invoice totals and
                        preserve the audit trail in the financial ledger.
                    </p>
                    <p>
                        Reversals can neutralize a wrong charge and optionally
                        raise the corrected invoice from the same adjustment
                        flow.
                    </p>
                    <p>
                        Refunds are treated as cash paid back to a student after
                        all invoices are cleared and only existing overpaid
                        credit remains.
                    </p>
                </div>

                <div className="mt-5">
                    <Link
                        href={route("billing.ledger.index")}
                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        View financial ledger
                    </Link>
                </div>
            </div>
        </FormScaffold>
    );
}
