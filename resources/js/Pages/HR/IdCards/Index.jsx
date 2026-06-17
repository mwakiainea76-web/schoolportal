import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";

import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

export default function SchoolIdCards({
    filters,
    selectedOptions,
    selectedStudents = [],
    cards = [],
    schoolName,
}) {
    const [type, setType] = useState(filters?.type ?? "student");
    const [identifier, setIdentifier] = useState(filters?.identifier ?? "");
    const [selected, setSelected] = useState(selectedStudents);
    const [searchKey, setSearchKey] = useState(0);

    const isStudent = type === "student";
    const searchRoute = isStudent ? "students.search" : "staffs.search";
    const selectedLabel = useMemo(
        () =>
            selectedOptions?.find((item) => String(item.id) === String(identifier))
                ?.name,
        [identifier, selectedOptions],
    );

    const changeType = (nextType) => {
        setType(nextType);
        setIdentifier("");
        setSelected([]);
    };

    const submit = (event) => {
        event.preventDefault();

        router.get(
            route("hr.id-cards.index"),
            {
                type,
                identifier: isStudent ? "" : identifier,
                selected_ids: isStudent
                    ? selected.map((student) => student.id).join(",")
                    : "",
                generate: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const addStudent = (student) => {
        if (!student?.id) return;

        setSelected((current) => {
            if (current.some((item) => String(item.id) === String(student.id))) {
                return current;
            }

            return [
                ...current,
                {
                    id: student.id,
                    name: student.name?.replace(/\s*\([^)]*\)\s*$/, "") ?? "",
                    admission_number:
                        student.admission_number ??
                        student.name?.match(/\(([^)]+)\)/)?.[1] ??
                        "",
                    course: student.course ?? null,
                    status: student.status ?? null,
                },
            ];
        });
        setIdentifier("");
        setSearchKey((current) => current + 1);
    };

    const removeStudent = (studentId) => {
        setSelected((current) =>
            current.filter((student) => String(student.id) !== String(studentId)),
        );
    };

    return (
        <>
            <Head title="School ID Cards" />

            <div className="mx-auto w-full space-y-5">
                <div className="overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm print:hidden">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h1 className="text-lg font-semibold text-zinc-950">
                            School ID Cards
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Generate printable school ID fronts.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5 px-5 py-5">
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <div>
                                <InputLabel value="Card Type" required />
                                <div className="mt-1 grid max-w-md grid-cols-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                                    {["student", "staff"].map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => changeType(item)}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                                                type === item
                                                    ? "bg-white text-emerald-700 shadow-sm"
                                                    : "text-zinc-600 hover:text-zinc-950"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                            <div>
                                <InputLabel
                                    value={
                                        isStudent
                                            ? "Search Student"
                                            : "Staff Number"
                                    }
                                    required
                                />
                                <SearchSelect
                                    key={`${type}-${searchKey}`}
                                    routeName={searchRoute}
                                    value={identifier}
                                    selectedLabel={selectedLabel}
                                    defaultOptions={selectedOptions ?? []}
                                    onChange={(person) =>
                                        isStudent
                                            ? addStudent(person)
                                            : setIdentifier(person.id ?? "")
                                    }
                                    placeholder={
                                        isStudent
                                            ? "Search admission number"
                                            : "Search staff number"
                                    }
                                    minSearchLength={1}
                                    preloadOptions
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isStudent && selected.length === 0}
                                className="min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Generate ID
                            </button>
                        </div>

                        {isStudent && (
                            <div className="overflow-hidden rounded-xl border border-zinc-200">
                                <div className="grid grid-cols-[1.2fr_1fr_auto] bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase text-zinc-500">
                                    <span>Student</span>
                                    <span>Admission No</span>
                                    <span className="text-right">Action</span>
                                </div>
                                {selected.length ? (
                                    selected.map((student) => (
                                        <div
                                            key={student.id}
                                            className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-3 border-t border-zinc-100 px-4 py-3 text-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    {student.name}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {student.course ?? "N/A"}
                                                </p>
                                            </div>
                                            <span className="font-medium text-zinc-700">
                                                {student.admission_number ?? "N/A"}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeStudent(student.id)
                                                }
                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border-t border-zinc-100 px-4 py-5 text-center text-sm text-zinc-500">
                                        No students selected.
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {cards.length ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 print:hidden">
                            <p className="text-sm font-medium text-zinc-600">
                                {cards.length} card{cards.length === 1 ? "" : "s"}{" "}
                                generated
                            </p>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="min-h-[40px] rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                            >
                                Print Cards
                            </button>
                        </div>

                        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 print:block">
                            {cards.map((card) => (
                                <SchoolIdCard
                                    key={`${card.type}-${card.number}`}
                                    card={card}
                                    schoolName={schoolName}
                                />
                            ))}
                        </section>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
                        Select students and generate school ID cards.
                    </div>
                )}
            </div>
        </>
    );
}

function SchoolIdCard({ card, schoolName }) {
    const isStaff = card.type?.toLowerCase().includes("staff");
    const initials = card.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0])
        .join("");

    return (
        <article className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[18px] border border-zinc-200 bg-white shadow-sm print:mb-4 print:h-[2.125in] print:w-[3.375in] print:break-inside-avoid print:rounded-none print:border print:shadow-none">
            <div className="relative aspect-[1.586/1] overflow-hidden bg-white print:h-full print:aspect-auto">
                <div className="absolute inset-x-0 top-0 h-[35%] bg-emerald-800" />
                <div className="absolute -right-12 top-0 h-28 w-48 rotate-12 bg-yellow-400 print:h-20 print:w-36" />
                <div className="absolute inset-x-0 top-[35%] h-2 bg-yellow-400" />

                <div className="relative flex h-full flex-col p-4 print:p-3">
                    <header className="flex items-start gap-3 text-white">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-300 bg-white text-sm font-black text-emerald-800 print:h-10 print:w-10">
                            {schoolName
                                ?.split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join("") || "SP"}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-black uppercase leading-tight print:text-[11px]">
                                {schoolName}
                            </h2>
                            <p className="mt-1 text-xs font-semibold uppercase text-yellow-200 print:text-[8px]">
                                {isStaff
                                    ? "Staff Identification Card"
                                    : "Student Identification Card"}
                            </p>
                        </div>
                    </header>

                    <div className="mt-4 grid flex-1 grid-cols-[96px_minmax(0,1fr)] gap-4 print:mt-3 print:grid-cols-[68px_minmax(0,1fr)] print:gap-3">
                        <div className="overflow-hidden rounded-xl border-4 border-white bg-zinc-100 shadow-md print:rounded-md print:border-2">
                            {card.photo_url ? (
                                <img
                                    src={card.photo_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-28 w-full items-center justify-center bg-emerald-50 text-3xl font-black text-emerald-800 print:min-h-20 print:text-xl">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 pt-2 text-zinc-950 print:pt-1">
                            <p className="text-[11px] font-bold uppercase text-emerald-700 print:text-[7px]">
                                {card.number ?? "N/A"}
                            </p>
                            <h3 className="mt-1 text-xl font-black uppercase leading-tight print:text-[13px]">
                                {card.name}
                            </h3>
                            <dl className="mt-3 space-y-1 text-xs print:mt-2 print:space-y-0.5 print:text-[7px]">
                                <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-2">
                                    <dt className="font-bold text-zinc-500">
                                        {isStaff ? "Role" : "Course"}
                                    </dt>
                                    <dd className="truncate font-semibold">
                                        {card.role ?? "N/A"}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-2">
                                    <dt className="font-bold text-zinc-500">
                                        Module
                                    </dt>
                                    <dd className="truncate font-semibold">
                                        {card.module ?? card.unit ?? "N/A"}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-2">
                                    <dt className="font-bold text-zinc-500">
                                        Status
                                    </dt>
                                    <dd className="truncate font-semibold capitalize">
                                        {card.status ?? "N/A"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <footer className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-2 text-[10px] font-semibold text-zinc-500 print:mt-2 print:pt-1 print:text-[6px]">
                        <span>Issued {card.issued_at}</span>
                        <span>{card.phone ?? card.email ?? ""}</span>
                    </footer>
                </div>
            </div>
        </article>
    );
}
