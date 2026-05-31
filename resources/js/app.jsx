import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { withAuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const page = module.default;

            if (!page.layout && shouldUseAuthenticatedLayout(name)) {
                page.layout = withAuthenticatedLayout();
            }

            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

function shouldUseAuthenticatedLayout(name) {
    return !name.startsWith('Auth/');
}
