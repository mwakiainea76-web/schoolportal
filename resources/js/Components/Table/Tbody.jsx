const TBody = ({ children, className = "", ...props }) => {
    return (
        <tbody {...props} className={`divide-y divide-slate-100 ${className}`}>
            {children}
        </tbody>
    );
};
export default TBody;
