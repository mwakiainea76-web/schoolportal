import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import GuestLayout from "./Layouts/GuestLayout";

createInertiaApp({
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        );

        if (page.default.layout === undefined) {
            if (name.startsWith("Auth/")) {
                page.default.layout = (page) => (
                    <GuestLayout
                        children={page}
                        fullWidth={name === "Auth/Login"}
                    />
                );
            } else {
                page.default.layout = (page) => (
                    <AuthenticatedLayout children={page} />
                );
            }
        }

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: "#059669",
    },
});
