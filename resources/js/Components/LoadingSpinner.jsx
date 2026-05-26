import { PuffLoader } from "react-spinners";

export default function LoadingSpinner({
    size = "md",
    className = "",
    centered = false,
}) {
    const sizes = {
        sm: 18,
        md: 32,
        lg: 48,
    };

    const wrapperClass = centered
        ? "flex items-center justify-center"
        : "inline-flex items-center";

    return (
        <div className={`${wrapperClass} ${className}`.trim()}>
            <PuffLoader
                color="#10B981"
                loading
                size={sizes[size] ?? sizes.md}
                speedMultiplier={0.9}
            />
        </div>
    );
}
