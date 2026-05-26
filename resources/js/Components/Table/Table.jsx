import React, { useRef } from "react";
import TFooter from "./Tfooter";

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
    const hasRows = (pagination?.data?.length ?? 0) > 0;

    const exportToCsv = () => {
        const table = tableRef.current;

        if (!table) {
            return;
        }

        const headers = Array.from(table.querySelectorAll("thead th"))
            .map((cell) => cell.textContent.replace(/\s+/g, " ").trim())
            .filter(Boolean);

        const headerIndexesToSkip = headers.reduce((indexes, header, index) => {
            if (header.toLowerCase() === "actions") {
                indexes.push(index);
            }

            return indexes;
        }, []);

        const rows = Array.from(table.querySelectorAll("tbody tr"))
            .map((row) =>
                Array.from(row.querySelectorAll("td"))
                    .map((cell, index) => ({ index, value: cell.textContent }))
                    .filter(({ index }) => !headerIndexesToSkip.includes(index))
                    .map(({ value }) => escapeCsvValue(value))
            )
            .filter((row) => row.length > 0);

        if (rows.length === 0) {
            return;
        }

        const filteredHeaders = headers.filter(
            (_, index) => !headerIndexesToSkip.includes(index),
        );

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
    };

    return (
        <div className=" py-6 font-sans">
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

            {/* Table Container */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table min-w-full">
                <div className="overflow-x-auto min-w-full">
                    <table
                        ref={tableRef}
                        className="w-full table-auto border-collapse text-left"
                    >
                        {children}
                    </table>
                </div>
                {/* Footer visible on screen but hidden in print */}

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
