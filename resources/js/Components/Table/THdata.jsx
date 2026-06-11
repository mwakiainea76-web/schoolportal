import React from "react";

const THdata = ({ children, className = "", ...props }) => {
    return (
        <th
            {...props}
            className={`whitespace-nowrap bg-zinc-0 p-2 text-left text-xs text-zinc-500 border/90 cursor-pointer tracking-wider ${className}`}
        >
            {children}
        </th>
    );
};
export default React.memo(THdata);
