import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import TablePagination from "@/Components/TablePagination";
import formatDate from "@/utils/date";
import SearchSelect from "@/Components/SearchSelect";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function Index({ permissions }) {
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("permissions.index"),
            { sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("permissions.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this permission?")) return;

        router.delete(route("permissions.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    return (
        <>
            <Head title="Permissions" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* SEARCH */}
                <form className="w-full flex gap-x-7 mb-4" onSubmit={submit}>
                    <SearchSelect
                        routeName="permissions.search"
                        defaultOptions={permissions.data}
                        placeholder="Search permission..."
                        onChange={(perm) => setSearchTerm(perm.name)}
                    />

                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table pagination={permissions}>
                    <Thead>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Permission {renderArrow("name")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>

                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {permissions?.data?.length > 0 ? (
                            permissions.data.map((permission) => (
                                <Trow key={permission.id}>
                                    <Tdata>{permission.name}</Tdata>

                                    <Tdata>
                                        {formatDate(permission.created_at)}
                                    </Tdata>

                                    <Tdata className="text-right">
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
                                                            "permissions.edit",
                                                            permission.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            permission.id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="3" className="text-center py-4">
                                    No permissions found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
const Table = ({ children, pagination, ...props }) => (
    <>
        <ShadTable {...props}>{children}</ShadTable>
        <TablePagination pagination={pagination} />
    </>
);
const Thead = ({ children, ...props }) => (
    <TableHeader {...props}>
        <TableRow>{children}</TableRow>
    </TableHeader>
);
const THdata = (props) => <TableHead {...props} />;
const Tbody = (props) => <TableBody {...props} />;
const Trow = (props) => <TableRow {...props} />;
const Tdata = (props) => <TableCell {...props} />;
