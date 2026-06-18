import { Link } from "@inertiajs/react";

export default function TablePagination({ pagination, colSpan, summary }) {
    if (!pagination) {
        return null;
    }

    const links = Array.isArray(pagination.links) ? pagination.links : [];
    const showLinks = links.length > 3;

    return (
        <>
            {summary ? (
                <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-3 text-xs font-semibold tracking-widest text-slate-400">
                    {summary}
                </div>
            ) : null}

            {showLinks ? (
                <div className="flex flex-wrap gap-2 px-2 py-3">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || "#"}
                            preserveState
                            preserveScroll
                            className={`rounded-md border px-3 py-2 text-sm ${
                                link.active
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            } ${
                                !link.url
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            ) : null}
        </>
    );
}
