import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { M as Modal } from "./Modal-CaUMk67x.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import AccessWorkspaceTabs from "./AccessWorkspaceTabs-BJjJkDSw.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "@headlessui/react";
import "ziggy-js";
const emptyRole = {
  id: null,
  name: ""
};
const emptyPermission = {
  id: null,
  name: ""
};
function RolesIndex({
  roles = [],
  permissions,
  selectedRoleId = null,
  selectedPermissions = [],
  filters = {}
}) {
  const [activeRoleId, setActiveRoleId] = useState(selectedRoleId);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(emptyRole);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(emptyPermission);
  const [permissionSearch, setPermissionSearch] = useState(
    filters.search ?? ""
  );
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const activeRole = useMemo(() => {
    return roles.find((role) => role.id === activeRoleId) ?? null;
  }, [activeRoleId, roles]);
  const roleForm = useForm({
    name: ""
  });
  const permissionForm = useForm({
    name: ""
  });
  useEffect(() => {
    setActiveRoleId(selectedRoleId);
  }, [selectedRoleId]);
  useEffect(() => {
    setSelectedPermissionIds(
      selectedPermissions.map((permission) => permission.id)
    );
  }, [selectedPermissions]);
  useEffect(() => {
    setPermissionSearch(filters.search ?? "");
  }, [filters.search]);
  const routeWithRole = (params = {}) => ({
    role_id: activeRole?.id,
    search: filters.search ?? "",
    sort: filters.sort ?? "name",
    direction: filters.direction ?? "asc",
    ...params
  });
  const selectRole = (role) => {
    setActiveRoleId(role.id);
    router.get(route("roles.index"), routeWithRole({ role_id: role.id }), {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  const openEditRole = (role) => {
    setEditingRole(role);
    roleForm.setData({
      name: role.name ?? ""
    });
    roleForm.clearErrors();
    setRoleModalOpen(true);
  };
  const closeRoleModal = () => {
    setRoleModalOpen(false);
    setEditingRole(emptyRole);
    roleForm.reset();
    roleForm.clearErrors();
  };
  const submitRole = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: closeRoleModal
    };
    if (editingRole.id) {
      roleForm.put(route("roles.update", editingRole.id), options);
      return;
    }
    roleForm.post(route("roles.store"), options);
  };
  const deleteRole = (role) => {
    if (!confirm(`Delete the ${role.name} role?`)) {
      return;
    }
    router.delete(route("roles.destroy", role.id), {
      preserveScroll: true
    });
  };
  const openEditPermission = (permission) => {
    setEditingPermission(permission);
    permissionForm.setData({
      name: permission.name ?? ""
    });
    permissionForm.clearErrors();
    setPermissionModalOpen(true);
  };
  const closePermissionModal = () => {
    setPermissionModalOpen(false);
    setEditingPermission(emptyPermission);
    permissionForm.reset();
    permissionForm.clearErrors();
  };
  const submitPermission = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: closePermissionModal
    };
    if (editingPermission.id) {
      permissionForm.put(
        route("permissions.update", editingPermission.id),
        options
      );
      return;
    }
    permissionForm.post(route("permissions.store"), options);
  };
  const deletePermission = (permission) => {
    if (!confirm(`Delete the ${permission.name} permission?`)) {
      return;
    }
    router.delete(route("permissions.destroy", permission.id), {
      preserveScroll: true
    });
  };
  const togglePermission = (permissionId) => {
    setSelectedPermissionIds((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }
      return [...current, permissionId];
    });
  };
  const savePermissions = () => {
    if (!activeRole) {
      return;
    }
    router.post(
      route("roles.permissions.assign"),
      {
        role_id: activeRole.id,
        permissions: selectedPermissionIds
      },
      {
        preserveScroll: true
      }
    );
  };
  const searchPermissions = (event) => {
    event.preventDefault();
    router.get(
      route("roles.index"),
      routeWithRole({
        search: permissionSearch,
        page: 1
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true
      }
    );
  };
  const changePermissionSearch = (permission) => {
    setPermissionSearch(permission?.name ?? "");
  };
  const toggleSort = (column) => {
    const nextDirection = filters.sort === column && filters.direction === "asc" ? "desc" : "asc";
    router.get(
      route("roles.index"),
      routeWithRole({
        sort: column,
        direction: nextDirection,
        page: 1
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Roles & Permissions" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(AccessWorkspaceTabs, { activeTab: "roles", roleId: activeRole?.id }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-6 lg:flex-row lg:items-start", children: [
        /* @__PURE__ */ jsxs("section", { className: "w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[360px] xl:w-[420px]", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b border-slate-100 px-6 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Roles" }) }),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: roles.length > 0 ? roles.map((role) => {
            const isActive = activeRole?.id === role.id;
            return /* @__PURE__ */ jsx(
              "div",
              {
                role: "button",
                tabIndex: 0,
                onClick: () => selectRole(role),
                onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectRole(role);
                  }
                },
                className: `block w-full px-6 py-5 text-left transition ${isActive ? "bg-emerald-50" : "bg-white hover:bg-slate-50"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "truncate text-lg font-semibold text-slate-700", children: role.name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [
                      role.permissions_count ?? role.permissions?.length ?? 0,
                      " ",
                      "permissions assigned"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-3 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        role: "button",
                        tabIndex: 0,
                        onClick: (event) => {
                          event.stopPropagation();
                          openEditRole(role);
                        },
                        onKeyDown: (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditRole(
                              role
                            );
                          }
                        },
                        className: "cursor-pointer text-emerald-700 hover:underline",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        role: "button",
                        tabIndex: 0,
                        onClick: (event) => {
                          event.stopPropagation();
                          deleteRole(role);
                        },
                        onKeyDown: (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            deleteRole(role);
                          }
                        },
                        className: "cursor-pointer text-red-600 hover:underline",
                        children: "Delete"
                      }
                    )
                  ] })
                ] })
              },
              role.id
            );
          }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-10 text-center text-sm text-slate-500", children: "No roles found." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "min-h-[260px] w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-slate-900", children: [
                "Permissions for",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: activeRole?.name ?? "No role selected" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Select permissions, then save changes for the active role." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-3", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: savePermissions,
                disabled: !activeRole,
                className: "rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                children: "Save Permissions"
              }
            ) })
          ] }),
          activeRole ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "px-6 pt-5", children: /* @__PURE__ */ jsxs(
              "form",
              {
                className: "flex flex-col gap-3 md:flex-row",
                onSubmit: searchPermissions,
                children: [
                  /* @__PURE__ */ jsx(
                    SearchSelect,
                    {
                      routeName: "permissions.search",
                      defaultOptions: permissions?.data ?? [],
                      placeholder: "Search permission...",
                      onChange: changePermissionSearch
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "rounded bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800",
                      children: "Search"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "px-6", children: /* @__PURE__ */ jsxs(
              DirectoryTable,
              {
                pagination: permissions,
                exportable: false,
                children: [
                  /* @__PURE__ */ jsxs(Thead, { children: [
                    /* @__PURE__ */ jsx(THdata, { children: "Assigned" }),
                    /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSort("name"),
                        className: "font-semibold text-slate-700 hover:text-emerald-700",
                        children: "Permission"
                      }
                    ) }),
                    /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSort(
                          "created_at"
                        ),
                        className: "font-semibold text-slate-700 hover:text-emerald-700",
                        children: "Created"
                      }
                    ) }),
                    /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) })
                  ] }),
                  /* @__PURE__ */ jsx(TBody, { children: permissions?.data?.length > 0 ? permissions.data.map(
                    (permission) => /* @__PURE__ */ jsxs(
                      Trow,
                      {
                        children: [
                          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: selectedPermissionIds.includes(
                                permission.id
                              ),
                              onChange: () => togglePermission(
                                permission.id
                              ),
                              className: "h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                            }
                          ) }),
                          /* @__PURE__ */ jsx(Tdata, { className: "font-semibold text-slate-700", children: permission.name }),
                          /* @__PURE__ */ jsx(Tdata, { children: formatDate(
                            permission.created_at
                          ) }),
                          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => openEditPermission(
                                  permission
                                ),
                                className: "text-emerald-700 hover:underline",
                                children: "Edit"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => deletePermission(
                                  permission
                                ),
                                className: "text-red-600 hover:underline",
                                children: "Delete"
                              }
                            )
                          ] }) })
                        ]
                      },
                      permission.id
                    )
                  ) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
                    Tdata,
                    {
                      colSpan: "4",
                      className: "py-6 text-center text-slate-500",
                      children: "No permissions found."
                    }
                  ) }) })
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-16 text-center text-sm text-slate-500", children: "Select a role to fetch and manage its permissions." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        show: roleModalOpen,
        onClose: closeRoleModal,
        maxWidth: "3xl",
        align: "top",
        children: /* @__PURE__ */ jsxs("form", { onSubmit: submitRole, className: "space-y-7 p-10", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-900", children: editingRole.id ? "Edit Role" : "Add Role" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { children: "Role Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: roleForm.data.name,
                onChange: (event) => roleForm.setData("name", event.target.value),
                placeholder: "e.g. admin, staff, student",
                error: roleForm.errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: roleForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: closeRoleModal,
                className: "rounded bg-slate-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: roleForm.processing,
                className: "rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50",
                children: roleForm.processing ? "Saving..." : "Save Role"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        show: permissionModalOpen,
        onClose: closePermissionModal,
        maxWidth: "3xl",
        align: "top",
        children: /* @__PURE__ */ jsxs("form", { onSubmit: submitPermission, className: "space-y-7 p-10", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-900", children: editingPermission.id ? "Edit Permission" : "Add Permission" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { children: "Permission Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                value: permissionForm.data.name,
                onChange: (event) => permissionForm.setData(
                  "name",
                  event.target.value
                ),
                placeholder: "e.g. users.update",
                error: permissionForm.errors.name
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: permissionForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: closePermissionModal,
                className: "rounded bg-slate-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: permissionForm.processing,
                className: "rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50",
                children: permissionForm.processing ? "Saving..." : "Save Permission"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  RolesIndex as default
};
