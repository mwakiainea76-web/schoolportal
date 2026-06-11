import React from "react";
import TFooter from "./Tfooter";

const DirectoryTable = ({ children, pagination }) => {
    return (
        <div className="py-2 font-sans">
            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md printable-table">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-max w-full table-auto border-collapse text-left">
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

export default React.memo(DirectoryTable);
