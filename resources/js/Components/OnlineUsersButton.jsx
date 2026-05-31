import axios from "axios";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function OnlineUsersButton({
    buttonLabel = "View Online Users",
}) {
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(null);
    const [queriedAt, setQueriedAt] = useState("");
    const [error, setError] = useState("");

    const loadOnlineUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(route("online-users.index"));
            const nextCount = Number(response.data?.count ?? 0);
            const nextQueriedAt = String(response.data?.queried_at ?? "");

            setCount(Number.isFinite(nextCount) ? nextCount : 0);
            setQueriedAt(nextQueriedAt);
        } catch (requestError) {
            const message =
                requestError?.response?.data?.message ||
                "Unable to load online users right now. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={loadOnlineUsers}
                    disabled={loading}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Loading..." : buttonLabel}
                </button>
                <Link
                    href={route("settings.user-monitor.index")}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                    Open User Monitor
                </Link>
            </div>

            {error ? (
                <p className="text-sm font-medium text-red-600">{error}</p>
            ) : null}

            {!error && count !== null ? (
                <div className="space-y-1 text-sm text-zinc-700">
                    <p className="font-medium">
                        {count} users currently online
                    </p>
                    {queriedAt ? (
                        <p className="text-xs text-zinc-500">
                            Checked at {new Date(queriedAt).toLocaleString()}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
