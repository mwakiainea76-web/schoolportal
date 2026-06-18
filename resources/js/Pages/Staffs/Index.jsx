import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function StaffIndex({ staffs }) {
    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("staffs.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (staffId) => {
        if (!confirm("Are you sure you want to delete this staff?")) return;

        router.delete(route("staffs.destroy", staffId), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Staff Management" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* SEARCH */}
                <form className="w-full flex gap-x-7 mb-4" onSubmit={submit}>
                    <TextInput
                        placeholder="Search by name, email or staff number..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />

                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                        {staffs?.data?.length > 0 ? (
                            staffs.data.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium text-slate-700">
                                        {staff.staff_number}
                                    </TableCell>

                                    <TableCell>
                                        {staff.last_name} {staff.first_name}
                                    </TableCell>

                                    <TableCell>{staff.email}</TableCell>

                                    <TableCell>
                                        {staff.roles?.[0] ?? "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        {staff.department?.name ?? "N/A"}
                                    </TableCell>

                                    <TableCell>{staff?.staff_status}</TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                >
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                side="left"
                                                align="start"
                                                sideOffset={8}
                                                className="w-40"
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            "staffs.edit",
                                                            staff.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(staff.id)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan="7"
                                    className="h-24 text-center"
                                >
                                    No staff found.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="px-8 py-3 text-xs font-semibold tracking-widest text-slate-400"
                                >
                                    Showing {staffs.from} to {staffs.to} of{" "}
                                    {staffs.total} staff
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                {staffs.links && staffs.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {staffs.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                preserveScroll
                                className={`rounded-md border px-3 py-2 text-sm ${
                                    link.active
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                } ${
                                    !link.url
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
