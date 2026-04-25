import { router } from "@inertiajs/react";

const TFooter = ({ pagination }) => {
    if (!pagination) return null;

    const { current_page, last_page, prev_page_url, next_page_url } =
        pagination;

    // Helper: update page while keeping current query params
    const goToPage = (page) => {
        const urlParams = new URLSearchParams(window.location.search);

        urlParams.set("page", page); // only update page
        router.get(
            `${window.location.pathname}?${urlParams.toString()}`,
            {},
            { preserveState: true, replace: true },
        );
    };

    // Generate page numbers
    const pages = Array.from({ length: last_page }, (_, i) => i + 1);

    return (
        <div className="TFooter bg-slate-50/80 px-8 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400  tracking-widest">
                Page {current_page} of {last_page}
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(current_page - 1)}
                    disabled={current_page === 1}
                    className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ←
                </button>

                {pages.map((page) => (
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
                ))}

                <button
                    onClick={() => goToPage(current_page + 1)}
                    disabled={current_page === last_page}
                    className="p-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default TFooter;
