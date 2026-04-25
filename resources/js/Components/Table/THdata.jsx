const THdata = ({ children, ...props }) => {
    return (
        <th
            {...props}
            className="p-2 text-left text-xs  text-zinc-500  bg-zinc-0 border/90 cursor-pointer tracking-wider"
        >
            {children}
        </th>
    );
};
export default THdata;
