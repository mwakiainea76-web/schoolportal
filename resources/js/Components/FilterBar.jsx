// Components/UI/FilterBar.jsx
export default function FilterBar({ children }) {
    return (
        <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {children}
            </div>
        </div>
    );
}
