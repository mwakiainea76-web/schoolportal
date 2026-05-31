import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { withAuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx', { eager: true })
            ).then((module) => {
                const page = module.default;

                if (!page.layout && shouldUseAuthenticatedLayout(name)) {
                    page.layout = withAuthenticatedLayout();
                }

                return module;
            }),
        setup: ({ App, props }) => <App {...props} />,
    })
);

function shouldUseAuthenticatedLayout(name) {
    return !name.startsWith('Auth/');
}
