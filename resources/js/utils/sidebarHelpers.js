export const safeRoute = (name, fallback) =>
    route().has(name) ? route(name) : fallback;

export const isRouteCurrent = (name, fallback, url) =>
    route().has(name) ? route().current(name) : url === fallback;

const filterChildren = (children, can) =>
    children
        .map((child) => {
            if (!child.children) {
                return child;
            }

            return {
                ...child,
                children: filterChildren(child.children, can),
            };
        })
        .filter((child) => {
            if (child.children) {
                return child.children.length > 0;
            }

            return !child.permission || can(child.permission);
        });

export const filterNav = (items, can) =>
    items
        .map((item) => ({
            ...item,
            children: filterChildren(item.children, can),
        }))
        .filter(
            (item) =>
                item.children.length > 0 &&
                (!item.permissions || item.permissions.some((p) => can(p))),
        );
