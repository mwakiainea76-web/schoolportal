export const safeRoute = (name, fallback) =>
    route().has(name) ? route(name) : fallback;

export const isRouteCurrent = (name, fallback, url, activeRouteNames = []) => {
    const routeNames = [name, ...activeRouteNames].filter(Boolean);

    if (routeNames.some((routeName) => route().has(routeName) && route().current(routeName))) {
        return true;
    }

    return url === fallback;
};

const roleAllowed = (item, hasRole) => {
    if (hasRole("admin")) {
        return true;
    }

    if (item.roles?.length && !item.roles.some((role) => hasRole(role))) {
        return false;
    }

    if (item.exceptRoles?.some((role) => hasRole(role))) {
        return false;
    }

    return true;
};

const filterChildren = (children, can, hasRole) =>
    children
        .map((child) => {
            if (!child.children) {
                return child;
            }

            return {
                ...child,
                children: filterChildren(child.children, can, hasRole),
            };
        })
        .filter((child) => {
            if (!roleAllowed(child, hasRole)) {
                return false;
            }

            if (child.children) {
                return child.children.length > 0;
            }

            return !child.permission || can(child.permission);
        });

export const filterNav = (items, can, hasRole) =>
    items
        .map((item) => ({
            ...item,
            children: filterChildren(item.children, can, hasRole),
        }))
        .filter(
            (item) =>
                item.children.length > 0 &&
                roleAllowed(item, hasRole) &&
                (!item.permissions || item.permissions.some((p) => can(p)) || item.roles?.some((role) => hasRole(role))),
        );
