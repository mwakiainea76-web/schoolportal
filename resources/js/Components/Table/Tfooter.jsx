import { router } from "@inertiajs/react";
import React, { useMemo } from "react";

const paginationWindow = (currentPage, lastPage) => {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = new Set([1, lastPage]);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
        pages.add(page);
    }

    return Array.from(pages)
        .sort((a, b) => a - b)
        .flatMap((page, index, items) => {
            if (index === 0 || page === items[index - 1] + 1) {
                return [page];
            }

            return [`ellipsis-${page}`, page];
        });
};

const TFooter = ({ pagination }) => {
    if (!pagination) return null;

    const { current_page, last_page } = pagination;

    const pages = useMemo(
        () => paginationWindow(current_page, last_page),
        [current_page, last_page],
    );

    const goToPage = (page) => {
        if (page < 1 || page > last_page || page === current_page) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", page);

        router.get(
            `${window.location.pathname}?${urlParams.toString()}`,
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="TFooter bg-slate-50/80 px-8 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 tracking-widest">
                Page {current_page} of {last_page}
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(current_page - 1)}
                    disabled={current_page === 1}
                    className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &lt;
                </button>

                {pages.map((page) =>
                    typeof page === "string" ? (
                        <span key={page} className="px-2 py-1 text-slate-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 rounded ${
                                page === current_page
                                    ? "bg-slate-400 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                            } transition-colors`}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    onClick={() => goToPage(current_page + 1)}
                    disabled={current_page === last_page}
                    className="p-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default React.memo(TFooter);
