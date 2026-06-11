import React from "react";

const Thead = ({ children, className = "", ...props }) => {
    return (
        <thead {...props}>
            <tr className={`bg-zinc-200 ${className}`}>{children}</tr>
        </thead>
    );
};
export default React.memo(Thead);
