import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function Index({ courseEnrollments }) {
    return (
        <AuthenticatedLayout>
            <Head title="Program Enrollments" />

            <div className="max-w-6xl mx-auto w-full">
                <Table pagination={courseEnrollments}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Reg No</THdata>
                        <THdata>Program</THdata>
                        <THdata>Program Version</THdata>
                        <THdata>Admitted</THdata>
                    </Thead>
                    <Tbody>
                        {courseEnrollments?.data?.length ? (
                            courseEnrollments.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>
                                        {item.student?.user?.first_name} {item.student?.user?.last_name}
                                    </Tdata>
                                    <Tdata>{item.student?.registration_number}</Tdata>
                                    <Tdata>{item.course_curriculum?.course?.name}</Tdata>
                                    <Tdata>{item.course_curriculum?.curriculum?.name}</Tdata>
                                    <Tdata>{formatDate(item.created_at)}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="5" className="text-center py-6">
                                    No program enrollments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
