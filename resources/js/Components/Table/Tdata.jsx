const Tdata = ({ children, className = "", ...props }) => {
    return (
        <td
            {...props}
            className={`whitespace-nowrap p-2 text-sm text-slate-500 ${className}`}
        >
            {children}
        </td>
    );
};
export default Tdata;
