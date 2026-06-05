import React, { useCallback, useMemo, useRef } from "react";
import TFooter from "./Tfooter";

const ACTIONS_HEADER = "actions";

const escapeCsvValue = (value) => {
    const normalized = `${value ?? ""}`.replace(/\r?\n|\r/g, " ").trim();

    if (
        normalized.includes(",") ||
        normalized.includes('"') ||
        normalized.includes(";")
    ) {
        return `"${normalized.replace(/"/g, '""')}"`;
    }

    return normalized;
};

const buildFilename = () => {
    const pageTitle = document.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `${pageTitle || "table-export"}-${new Date().toISOString().slice(0, 10)}.csv`;
};

const DirectoryTable = ({
    children,
    pagination,
    print = false,
    exportable = true,
}) => {
    const tableRef = useRef(null);
    const hasRows = useMemo(
        () => (pagination?.data?.length ?? 0) > 0,
        [pagination?.data?.length],
    );

    const exportToCsv = useCallback(() => {
        const table = tableRef.current;

        if (!table) {
            return;
        }

        const headers = Array.from(table.querySelectorAll("thead th"))
            .map((cell, index) => ({
                index,
                value: cell.textContent.replace(/\s+/g, " ").trim(),
            }))
            .filter(({ value }) => value);

        const headerIndexesToSkip = new Set(
            headers
                .filter(({ value }) => value.toLowerCase() === ACTIONS_HEADER)
                .map(({ index }) => index),
        );

        const rows = Array.from(table.querySelectorAll("tbody tr"))
            .map((row) =>
                Array.from(row.querySelectorAll("td"))
                    .map((cell, index) => ({ index, value: cell.textContent }))
                    .filter(({ index }) => !headerIndexesToSkip.has(index))
                    .map(({ value }) => escapeCsvValue(value))
            )
            .filter((row) => row.length > 0);

        if (rows.length === 0) {
            return;
        }

        const filteredHeaders = headers
            .filter(({ index }) => !headerIndexesToSkip.has(index))
            .map(({ value }) => escapeCsvValue(value));

        const csvContent = [filteredHeaders, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", buildFilename());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, []);

    return (
        <div className="py-6 font-sans">
            {(print || exportable) && (
                <div className="mb-4 flex flex-wrap justify-end gap-3">
                    {exportable && (
                        <button
                            type="button"
                            onClick={exportToCsv}
                            disabled={!hasRows}
                            className="rounded bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export CSV
                        </button>
                    )}

                    {print && (
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded bg-slate-500 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
                        >
                            Print Table
                        </button>
                    )}
                </div>
            )}

            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table">
                <div className="w-full overflow-x-auto">
                    <table
                        ref={tableRef}
                        className="min-w-max w-full table-auto border-collapse text-left"
                    >
                        {children}
                    </table>
                </div>

                {pagination ? (
                    <TFooter pagination={pagination} />
                ) : (
                    <div className="p-4 text-center text-sm text-zinc-500">
                        No data available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DirectoryTable;
