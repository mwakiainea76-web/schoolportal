import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";
import { downloadExport } from "@/utils/exportDownload";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DepartmentsIndex({ departments }) {
    const [sortField, setSortField] = useState(
        departments.sort || "created_at",
    );

    const [sortDirection, setSortDirection] = useState(
        departments.direction || "desc",
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [exportFormat, setExportFormat] = useState("pdf");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("departments.index"),
            {
                sort: field,
                direction,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("departments.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this department?")) {
            return;
        }

        router.delete(route("departments.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = () => {
        downloadExport("departments", exportFormat, {
            search: searchTerm || departments.filters?.search || "",
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head title="Departments" />

            <div className="space-y-6">
                {/* Search & Export */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={submit} className="flex flex-1 gap-2">
                        <div className="flex-1">
                            <SearchSelect
                                routeName="departments.search"
                                defaultOptions={departments.data}
                                placeholder="Search department..."
                                onChange={(body) =>
                                    setSearchTerm(body?.name ?? "")
                                }
                            />
                        </div>

                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                        >
                            <option value="pdf">PDF</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>

                        <Button variant="outline" onClick={handleExport}>
                            Export
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    onClick={() => handleSort("code")}
                                    className="cursor-pointer"
                                >
                                    Code {renderArrow("code")}
                                </TableHead>

                                <TableHead
                                    onClick={() => handleSort("name")}
                                    className="cursor-pointer"
                                >
                                    Name {renderArrow("name")}
                                </TableHead>

                                <TableHead>HOD</TableHead>

                                <TableHead
                                    onClick={() => handleSort("created_at")}
                                    className="cursor-pointer"
                                >
                                    Created {renderArrow("created_at")}
                                </TableHead>

                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {departments?.data?.length ? (
                                departments.data.map((department) => (
                                    <TableRow key={department.id}>
                                    <TableCell className="font-medium text-slate-700">
                                            {department.code}
                                        </TableCell>

                                        <TableCell>{department.name}</TableCell>

                                        <TableCell>
                                            {department.hod
                                                ? [
                                                      department.hod
                                                          .staff_number,
                                                      department.hod.name,
                                                  ]
                                                      .filter(Boolean)
                                                      .join(" - ")
                                                : "-"}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(department.created_at)}
                                        </TableCell>

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
                                                                "departments.edit",
                                                                encodeURIComponent(
                                                                    department.id,
                                                                ),
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
                                                                department.id,
                                                            )
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
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        No departments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="px-8 py-3 text-xs font-semibold tracking-widest text-slate-400"
                                >
                                    Showing {departments.from} to{" "}
                                    {departments.to} of {departments.total}{" "}
                                    departments
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                {/* Pagination */}
                {departments.links && departments.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {departments.links.map((link, index) => (
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
