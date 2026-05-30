import { usePage } from "@inertiajs/react";

export default function useRbac() {
    const { props } = usePage();

    const permissions = props.auth?.permissions ?? [];
    const roles = props.auth?.roles ?? [];
    const normalizedRoles = roles.map((role) => String(role).toLowerCase());

    const can = (perm) => permissions.includes(perm);
    const cannot = (perm) => !permissions.includes(perm);

    const hasRole = (role) => normalizedRoles.includes(String(role).toLowerCase());

    return { permissions, roles, can, cannot, hasRole };
}
