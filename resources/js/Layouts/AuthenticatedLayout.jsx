import { createContext, useContext, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import useTabSync from "@/Hooks/useTabSync";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthenticatedLayoutContext = createContext(null);

export default function AuthenticatedLayout({ header, children }) {
    const parentLayout = useContext(AuthenticatedLayoutContext);
    const { flash } = usePage().props;
    const user = usePage().props.auth.user;

    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pageHeader, setPageHeader] = useState(header ?? null);

    const { logout, isLoggingOut } = useTabSync(user);

    useEffect(() => {
        if (!parentLayout) {
            setPageHeader(header ?? null);
        }
    }, [header, parentLayout]);

    useEffect(() => {
        if (!parentLayout) {
            return undefined;
        }

        parentLayout.setPageHeader(header ?? null);

        return () => {
            parentLayout.setPageHeader(null);
        };
    }, [header, parentLayout]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    if (parentLayout) {
        return <>{children}</>;
    }

    return (
        <AuthenticatedLayoutContext.Provider value={{ setPageHeader }}>
            <div className="flex min-h-screen bg-[#F8F9FA] text-zinc-900">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Navbar
                        open={open}
                        setOpen={setOpen}
                        user={user}
                        logout={logout}
                        isLoggingOut={isLoggingOut}
                        setMobileOpen={setMobileOpen}
                    />

                    <main className="flex-1 overflow-y-auto mb-8 w-full">
                        <div className="px-10 pt-2">
                            {pageHeader && (
                                <div className="mb-8">{pageHeader}</div>
                            )}

                            {children}
                        </div>
                    </main>

                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnHover
                        draggable
                        theme="light"
                    />
                </div>
            </div>
        </AuthenticatedLayoutContext.Provider>
    );
}

export const withAuthenticatedLayout =
    (layoutProps = {}) =>
    (page) => (
        <AuthenticatedLayout {...layoutProps}>{page}</AuthenticatedLayout>
    );
