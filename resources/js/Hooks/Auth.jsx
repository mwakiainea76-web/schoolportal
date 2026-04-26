import { usePage } from "@inertiajs/react";

export default function useAuth() {
    const { props } = usePage();

    return {
        user: props.auth?.user,
        roles: props.auth?.roles ?? [],
        permissions: Array.isArray(props.auth?.permissions)
            ? props.auth.permissions
            : [],
    };
}
