export const safeRoute = (name, fallback) =>
    route().has(name) ? route(name) : fallback;

export const isRouteCurrent = (name, fallback, url) =>
    route().has(name) ? route().current(name) : url === fallback;

export const filterNav = (items, can) =>
    items
        .map((item) => ({
            ...item,
            children: item.children.filter(
                (child) => !child.permission || can(child.permission),
            ),
        }))
        .filter(
            (item) =>
                item.children.length > 0 &&
                (!item.permissions || item.permissions.some((p) => can(p))),
        );
