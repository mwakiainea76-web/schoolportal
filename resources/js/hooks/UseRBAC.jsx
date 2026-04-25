import { usePage } from "@inertiajs/react";

export default function useRbac() {
    const { props } = usePage();

    const permissions = props.auth?.permissions ?? [];
    const roles = props.auth?.roles ?? [];

    const can = (perm) => permissions.includes(perm);
    const cannot = (perm) => !permissions.includes(perm);

    const hasRole = (role) => roles.includes(role);

    return { permissions, roles, can, cannot, hasRole };
}
