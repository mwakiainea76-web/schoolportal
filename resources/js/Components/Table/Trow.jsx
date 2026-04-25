const Trow = ({ children }) => {
    return (
        <tr
            className="group transition-all duration-200 hover:bg-indigo-50/40 cursor-default"
            data-te-table-row-ref=""
        >
            {children}
        </tr>
    );
};
export default Trow;
