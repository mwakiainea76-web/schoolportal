import React from "react";
import TFooter from "./Tfooter";

const DirectoryTable = ({ children, pagination, print = false }) => {
    return (
        <div className=" py-6 font-sans">
            {print && (
                <button
                    onClick={() => window.print()}
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700"
                >
                    Print Table
                </button>
            )}

            {/* Table Container */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table min-w-full">
                <div className="overflow-x-auto min-w-full">
                    <table className="w-full table-auto border-collapse text-left">
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
