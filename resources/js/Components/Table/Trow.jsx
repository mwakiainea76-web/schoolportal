const Trow = ({ children, className = "", ...props }) => {
    return (
        <tr
            {...props}
            className={`group cursor-default transition-all duration-200 hover:bg-indigo-50/40 ${className}`}
            data-te-table-row-ref=""
        >
            {children}
        </tr>
    );
};
export default Trow;
