// Components/UI/PageLayout.jsx
export default function PageLayout({ children }) {
    return (
        <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
        </div>
    );
}
