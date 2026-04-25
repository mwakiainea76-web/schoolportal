// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head, router } from "@inertiajs/react";
// import { useState } from "react";

// import SearchSelect from "@/Components/SearchSelect";
// import InputLabel from "@/Components/InputLabel";

// export default function AssignPermissions({ roles_data, permissions_data }) {
//     const [role, setRole] = useState(null);
//     const [permissions, setPermissions] = useState([]);

//     // ROLE CHANGE (with safety reset)
//     const handleRoleSelect = (selected) => {
//         if (permissions.length > 0) {
//             const confirmChange = confirm(
//                 "Changing role will clear current permissions. Continue?",
//             );
//             if (!confirmChange) return;
//         }

//         setRole(selected);
//         setPermissions([]);
//     };

//     // ADD PERMISSION → PUSH INTO TABLE IMMEDIATELY
//     const handlePermissionSelect = (selected) => {
//         if (!selected) return;

//         setPermissions((prev) => {
//             // prevent duplicates
//             const exists = prev.find((p) => p.id === selected.id);
//             if (exists) return prev;

//             return [...prev, selected];
//         });
//     };

//     // REMOVE PERMISSION
//     const removePermission = (id) => {
//         setPermissions((prev) => prev.filter((p) => p.id !== id));
//     };

//     // SUBMIT
//     const submit = (e) => {
//         e.preventDefault();

//         if (!role) return;

//         router.post(route("roles.assign.permissions"), {
//             role_id: role.id,
//             permissions: permissions.map((p) => p.id),
//         });
//     };

//     return (
//         <AuthenticatedLayout>
//             <Head title="Role Permissions" />

//             <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <div className="bg-white border rounded-lg shadow-sm p-8 space-y-8">
//                     {/* ROLE SELECT */}
//                     <div>
//                         <InputLabel>Select Role</InputLabel>

//                         <SearchSelect
//                             routeName="roles.search"
//                             defaultOptions={roles_data}
//                             placeholder="Search role..."
//                             multiple={false}
//                             value={role}
//                             onChange={handleRoleSelect}
//                         />
//                     </div>

//                     {/* ACTIVE ROLE */}
//                     {role && (
//                         <div className="text-sm font-semibold text-emerald-700">
//                             Editing: {role.name}
//                         </div>
//                     )}

//                     {/* PERMISSION SELECT */}
//                     {role && (
//                         <div>
//                             <InputLabel>Add Permission</InputLabel>

//                             <SearchSelect
//                                 routeName="permissions.search"
//                                 defaultOptions={permissions_data}
//                                 placeholder="Search permissions..."
//                                 multiple={false}
//                                 onChange={handlePermissionSelect}
//                             />
//                         </div>
//                     )}

//                     {/* TABLE */}
//                     {role && (
//                         <div className="border rounded-lg overflow-hidden">
//                             <table className="w-full text-sm">
//                                 <thead className="bg-zinc-100">
//                                     <tr>
//                                         <th className="p-3 text-left">#</th>
//                                         <th className="p-3 text-left">
//                                             Permission
//                                         </th>
//                                         <th className="p-3 text-right">
//                                             Action
//                                         </th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {permissions.length > 0 ? (
//                                         permissions.map((p, index) => (
//                                             <tr
//                                                 key={p.id}
//                                                 className="border-t hover:bg-zinc-50"
//                                             >
//                                                 <td className="p-3">
//                                                     {index + 1}
//                                                 </td>

//                                                 <td className="p-3 font-medium">
//                                                     {p.name}
//                                                 </td>

//                                                 <td className="p-3 text-right">
//                                                     <button
//                                                         onClick={() =>
//                                                             removePermission(
//                                                                 p.id,
//                                                             )
//                                                         }
//                                                         className="text-red-600 hover:text-red-800 font-bold"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td
//                                                 colSpan="3"
//                                                 className="text-center p-4 text-zinc-400"
//                                             >
//                                                 No permissions selected
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {/* ACTIONS */}
//                     <div className="flex justify-between pt-4">
//                         <button
//                             onClick={() => {
//                                 setRole(null);
//                                 setPermissions([]);
//                             }}
//                             className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
//                         >
//                             Reset
//                         </button>

//                         <button
//                             onClick={submit}
//                             disabled={!role}
//                             className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
// /
