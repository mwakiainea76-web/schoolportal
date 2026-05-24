import { Link } from "@inertiajs/react";

export default function ActionCard({
    href,
    icon: Icon,
    imageSrc,
    imageAlt,
    title,
    description,
    onClick,
}) {
    const classes =
        "block w-full rounded-[1.75rem] border border-zinc-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md";

    const content = (
        <>
            {imageSrc ? (
                <div className="inline-flex rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm">
                    <img
                        src={imageSrc}
                        alt={imageAlt ?? title}
                        className="h-10 w-auto"
                    />
                </div>
            ) : (
                <div className="inline-flex rounded-2xl bg-zinc-100 p-3 text-zinc-700">
                    <Icon className="h-5 w-5" />
                </div>
            )}
            <h2 className="mt-5 text-lg font-semibold text-zinc-900">
                {title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
        </>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={classes}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={classes}>
            {content}
        </Link>
    );
}
