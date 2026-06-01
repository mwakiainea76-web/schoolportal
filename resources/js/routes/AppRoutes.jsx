import { lazy, useEffect, useMemo, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageProvider } from "../context/PageContext";
import { api } from "../lib/api";
import useAuth from "@/hooks/Auth";

const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../Pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../Pages/Auth/ResetPassword"));
const ConfirmPassword = lazy(() => import("../Pages/Auth/ConfirmPassword"));
const VerifyEmail = lazy(() => import("../Pages/Auth/VerifyEmail"));
//const Dashboard = lazy(() => import("../Pages/Dashboard"));
const StudentDashboard = lazy(
    () => import("../Pages/Dashboard/StudentDashboard"),
);
const AdminDashboard = lazy(() => import("../Pages/Dashboard/AdminDashboard"));
const TrainerDashboard = lazy(
    () => import("../Pages/Dashboard/TrainerDashboard"),
);
const ProfileEdit = lazy(() => import("../Pages/Profile/Edit"));
const PerformanceDashboard = lazy(
    () => import("../Pages/Settings/PerformanceDashboard"),
);
const LogViewer = lazy(() => import("../Pages/Settings/LogViewer"));
const UserMonitor = lazy(() => import("../Pages/Settings/UserMonitor"));
const SecurityMonitoring = lazy(
    () => import("../Pages/Settings/SecurityMonitoring"),
);
const AcademicYearsIndex = lazy(() => import("../Pages/AcademicYears/Index"));
const AcademicYearsCreate = lazy(() => import("../Pages/AcademicYears/Create"));
const AcademicYearsEdit = lazy(() => import("../Pages/AcademicYears/Edit"));
const AcademicSessionsIndex = lazy(
    () => import("../Pages/AcademicSessions/Index"),
);
const AcademicSessionsCreate = lazy(
    () => import("../Pages/AcademicSessions/Create"),
);
const AcademicSessionsEdit = lazy(
    () => import("../Pages/AcademicSessions/Edit"),
);
const AcademicSessionEnrollmentsIndex = lazy(
    () => import("../Pages/AcademicSessionEnrollments/Index"),
);
const AcademicSessionEnrollmentsCreate = lazy(
    () => import("../Pages/AcademicSessionEnrollments/Create"),
);
const AcademicSessionEnrollmentsEdit = lazy(
    () => import("../Pages/AcademicSessionEnrollments/Edit"),
);
const TimetablesIndex = lazy(
    () => import("../Pages/Academic/Timetables/Index"),
);
const TimetablesCreate = lazy(
    () => import("../Pages/Academic/Timetables/Create"),
);
const TimetablesCreateHod = lazy(
    () => import("../Pages/Academic/Timetables/CreateHod"),
);
const TimetablesEdit = lazy(() => import("../Pages/Academic/Timetables/Edit"));
const GradesIndex = lazy(() => import("../Pages/Grades/Index"));
const GradesPublish = lazy(() => import("../Pages/Grades/Publish"));
const GradesMarksheet = lazy(() => import("../Pages/Grades/Marksheet"));
const GradesStudentResults = lazy(
    () => import("../Pages/Grades/StudentResults"),
);
const DepartmentsIndex = lazy(() => import("../Pages/Departments/Index"));
const DepartmentsCreate = lazy(() => import("../Pages/Departments/Create"));
const DepartmentsEdit = lazy(() => import("../Pages/Departments/Edit"));
const ExamBodiesWorkspace = lazy(() => import("../Pages/ExamBodies/Workspace"));
const ExamBodiesCreate = lazy(() => import("../Pages/ExamBodies/Create"));
const ExamBodiesEdit = lazy(() => import("../Pages/ExamBodies/Edit"));
const ExamBodiesReports = lazy(() => import("../Pages/ExamBodies/Reports"));
const CertificationLevelsCreate = lazy(
    () => import("../Pages/CertificationLevels/Create"),
);
const CertificationLevelsEdit = lazy(
    () => import("../Pages/CertificationLevels/Edit"),
);
const ProgramsIndex = lazy(() => import("../Pages/Programs/Index"));
const ProgramsCreate = lazy(() => import("../Pages/Programs/Create"));
const ProgramsEdit = lazy(() => import("../Pages/Programs/Edit"));
const ProgramEnrollmentsIndex = lazy(
    () => import("../Pages/ProgramEnrollments/Index"),
);
const ProgramVersionsIndex = lazy(
    () => import("../Pages/ProgramVersions/Index"),
);
const ProgramVersionsCreate = lazy(
    () => import("../Pages/ProgramVersions/Create"),
);
const ProgramVersionsEdit = lazy(() => import("../Pages/ProgramVersions/Edit"));
const ProgramVersionMappingsIndex = lazy(
    () => import("../Pages/ProgramVersionMappings/Index"),
);
const ProgramVersionMappingsCreate = lazy(
    () => import("../Pages/ProgramVersionMappings/Create"),
);
const ProgramVersionMappingsEdit = lazy(
    () => import("../Pages/ProgramVersionMappings/Edit"),
);
const UnitsIndex = lazy(() => import("../Pages/Units/Index"));
const UnitsCreate = lazy(() => import("../Pages/Units/Create"));
const UnitsEdit = lazy(() => import("../Pages/Units/Edit"));
const ProgramVersionUnitsIndex = lazy(
    () => import("../Pages/ProgramVersionUnits/Index"),
);
const ProgramVersionUnitsCreate = lazy(
    () => import("../Pages/ProgramVersionUnits/Create"),
);
const ProgramVersionUnitsEdit = lazy(
    () => import("../Pages/ProgramVersionUnits/Edit"),
);
const ProgramVersionUnitsStudentIndex = lazy(
    () => import("../Pages/ProgramVersionUnits/StudentIndex"),
);
const LectureRoomsIndex = lazy(() => import("../Pages/LectureRooms/Index"));
const LectureRoomsCreate = lazy(() => import("../Pages/LectureRooms/Create"));
const LectureRoomsEdit = lazy(() => import("../Pages/LectureRooms/Edit"));
const HostelsIndex = lazy(() => import("../Pages/Hostels/Index"));
const HostelsCreate = lazy(() => import("../Pages/Hostels/Create"));
const HostelsEdit = lazy(() => import("../Pages/Hostels/Edit"));
const HostelAllocationsIndex = lazy(
    () => import("../Pages/HostelAllocations/Index"),
);
const HostelAllocationsCreate = lazy(
    () => import("../Pages/HostelAllocations/Create"),
);
const HostelAllocationsEdit = lazy(
    () => import("../Pages/HostelAllocations/Edit"),
);
const RolesIndex = lazy(() => import("../Pages/Roles/Index"));
const RolesCreate = lazy(() => import("../Pages/Roles/Create"));
const RolesEdit = lazy(() => import("../Pages/Roles/Edit"));
const RolesEditPermissions = lazy(
    () => import("../Pages/Roles/EditPermissions"),
);
const PermissionsIndex = lazy(() => import("../Pages/Permissions/Index"));
const PermissionsCreate = lazy(() => import("../Pages/Permissions/Create"));
const PermissionsEdit = lazy(() => import("../Pages/Permissions/Edit"));
const InvoicesIndex = lazy(() => import("../Pages/Billing/InvoiceIndex"));
const InvoicesCreate = lazy(() => import("../Pages/Billing/InvoiceCreate"));
const InvoicesShow = lazy(() => import("../Pages/Billing/InvoiceShow"));
const ManualOperations = lazy(
    () => import("../Pages/Billing/ManualOperations/Index"),
);
const AdditionalInvoice = lazy(
    () => import("../Pages/Billing/ManualOperations/AdditionalInvoice"),
);
const RecordPayment = lazy(
    () => import("../Pages/Billing/ManualOperations/RecordPayment"),
);
const PostPenalty = lazy(
    () => import("../Pages/Billing/ManualOperations/PostPenalty"),
);
const ApplyAdjustment = lazy(
    () => import("../Pages/Billing/ManualOperations/ApplyAdjustment"),
);
const BulkOperations = lazy(() => import("../Pages/Billing/BulkOperations"));
const LedgerIndex = lazy(() => import("../Pages/Billing/LedgerIndex"));
const StudentStatementsIndex = lazy(
    () => import("../Pages/Billing/StudentStatements/Index"),
);
const StudentStatementsShow = lazy(
    () => import("../Pages/Billing/StudentStatements/Show"),
);
const FeePlansIndex = lazy(() => import("../Pages/Fees/FeePlans/Index"));
const FeePlansCreate = lazy(() => import("../Pages/Fees/FeePlans/Create"));
const FeePlansEdit = lazy(() => import("../Pages/Fees/FeePlans/Edit"));
const FeeAssignmentsIndex = lazy(
    () => import("../Pages/Fees/FeeAssignments/Index"),
);
const FeeAssignmentsCreate = lazy(
    () => import("../Pages/Fees/FeeAssignments/Create"),
);
const FeeAssignmentsEdit = lazy(
    () => import("../Pages/Fees/FeeAssignments/Edit"),
);
const FeeAssignmentsBulkAssign = lazy(
    () => import("../Pages/Fees/FeeAssignments/BulkAssign"),
);
const FeeAssignmentsBulkPreview = lazy(
    () => import("../Pages/Fees/FeeAssignments/BulkPreview"),
);
const FeePlanItemsIndex = lazy(
    () => import("../Pages/Fees/FeePlanItems/Index"),
);
const FeePlanItemsCreate = lazy(
    () => import("../Pages/Fees/FeePlanItems/Create"),
);
const FeePlanItemsEdit = lazy(() => import("../Pages/Fees/FeePlanItems/Edit"));
const StudentsIndex = lazy(() => import("../Pages/students/Index"));
const StudentsCreate = lazy(() => import("../Pages/students/Create"));
const StudentsEdit = lazy(() => import("../Pages/students/Edit"));
const StudentCourseChange = lazy(
    () => import("../Pages/students/CourseChange"),
);
const StaffsIndex = lazy(() => import("../Pages/Staffs/Index"));
const StaffsCreate = lazy(() => import("../Pages/Staffs/Create"));
const StaffsEdit = lazy(() => import("../Pages/Staffs/Edit"));
const ReportsIndex = lazy(() => import("../Pages/Reports/Index"));

function pageEndpoint(endpoint, params) {
    return typeof endpoint === "function" ? endpoint(params) : endpoint;
}

const pagePropAliases = {
    "/api/academic-years": { list: "academic_years", item: "academic_year" },
    "/api/academic-sessions": {
        list: "academic_sessions",
        item: "academic_session",
    },
    "/api/academic-session-enrollments": {
        list: "enrollments",
        item: "enrollment",
    },
    "/api/academic/timetables": { list: "timetables", item: "timetable" },
    "/api/departments": { list: "departments", item: "department" },
    "/api/exam-bodies": { list: "exam_bodies", item: "exam_body" },
    "/api/exam-bodies/certification-levels": {
        list: "certification_levels",
        item: "certification_level",
    },
    "/api/programs": { list: "programs", item: "program" },
    "/api/program-versions": { list: "curriculums", item: "curriculum" },
    "/api/program-version-mappings": {
        list: "programVersionMappings",
        item: "programVersionMapping",
    },
    "/api/units": { list: "units", item: "unit" },
    "/api/program-version-units": {
        list: "curriculum_units",
        item: "curriculum_unit",
    },
    "/api/lecture-rooms": { list: "lecture_rooms", item: "lecture_room" },
    "/api/hostels": { list: "hostels", item: "hostel" },
    "/api/hostel-allocations": { list: "allocations", item: "allocation" },
    "/api/roles": { list: "roles", item: "role" },
    "/api/permissions": { list: "permissions", item: "permission" },
    "/api/billing/invoices": { list: "invoices", item: "invoice" },
    "/api/billing/ledger": { list: "transactions", item: "transaction" },
    "/api/fee-plans": { list: "feePlans", item: "feePlan" },
    "/api/fees/assignments": { list: "assignments", item: "feeAssignment" },
    "/api/fee-plan-items": { list: "items", item: "feePlanItem" },
    "/api/students": { list: "students", item: "student" },
    "/api/staffs": { list: "staffs", item: "staff" },
};

function PageRoute({
    component: Component,
    componentName,
    endpoint = null,
    authenticated = true,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const resolvedEndpoint = pageEndpoint(endpoint, params);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const listener = () => navigate("/login");
        window.addEventListener("spa:unauthenticated", listener);
        return () =>
            window.removeEventListener("spa:unauthenticated", listener);
    }, [navigate]);

    useEffect(() => {
        const listener = () => setRefreshKey((current) => current + 1);
        window.addEventListener("spa:data-mutated", listener);
        return () => window.removeEventListener("spa:data-mutated", listener);
    }, []);

    const me = useQuery({
        queryKey: ["me"],
        queryFn: async () => (await api.get("/api/me")).data,
        enabled: authenticated,
    });

    const pageData = useQuery({
        queryKey: ["page", resolvedEndpoint, location.search, refreshKey],
        queryFn: async () => {
            const response = await api.get(
                `${resolvedEndpoint}${location.search}`,
            );
            return normalisePageProps(
                response.data,
                resolvedEndpoint,
                location.search,
            );
        },
        enabled: Boolean(resolvedEndpoint),
    });

    const props = useMemo(
        () => ({
            ...normaliseAuthProps(me.data),
            ...(pageData.data ?? {}),
        }),
        [me.data, pageData.data],
    );

    if (
        (authenticated && me.isLoading) ||
        (resolvedEndpoint && pageData.isLoading)
    ) {
        return <PageLoading />;
    }

    if (pageData.isError) {
        return <PageError error={pageData.error} />;
    }

    return (
        <PageProvider
            value={{
                component: componentName,
                props,
                url: location.pathname + location.search,
            }}
        >
            <Component {...props} />
        </PageProvider>
    );
}

function normalisePageProps(payload, endpoint, search = "") {
    if (!payload || !endpoint) {
        return payload ?? {};
    }

    const props = { ...payload };
    const alias = aliasForEndpoint(endpoint);
    const data = unwrapApiData(payload);

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        !payload.meta
    ) {
        Object.assign(props, data);
    }

    if (!alias || props[alias.list] || props[alias.item]) {
        return props;
    }

    if (Array.isArray(data) && payload.meta) {
        props[alias.list] = paginationPayload(payload, search);
        return props;
    }

    if (data && typeof data === "object") {
        props[alias.item] = data;
    }

    return props;
}

function normaliseAuthProps(payload) {
    if (!payload) {
        return {};
    }

    const data = unwrapApiData(payload);

    return {
        ...payload,
        ...(data && typeof data === "object" && !Array.isArray(data)
            ? data
            : {}),
    };
}

function unwrapApiData(payload) {
    if (!payload || !Object.prototype.hasOwnProperty.call(payload, "data")) {
        return payload;
    }

    const data = payload.data;

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length === 1 &&
        Object.prototype.hasOwnProperty.call(data, "data")
    ) {
        return data.data;
    }

    return data;
}

function PageLoading() {
    return (
        <div className="min-h-screen bg-zinc-50 px-6 py-8 text-sm text-zinc-500">
            Loading...
        </div>
    );
}

function PageError({ error }) {
    return (
        <div className="min-h-screen bg-zinc-50 px-6 py-8">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error?.response?.data?.error?.message ??
                    error?.message ??
                    "Unable to load this page."}
            </div>
        </div>
    );
}

function aliasForEndpoint(endpoint) {
    const cleanEndpoint = endpoint.split("?")[0];

    return Object.entries(pagePropAliases)
        .sort(([left], [right]) => right.length - left.length)
        .find(
            ([base]) =>
                cleanEndpoint === base || cleanEndpoint.startsWith(`${base}/`),
        )?.[1];
}

function paginationPayload(payload, search) {
    const params = new URLSearchParams(search);

    return {
        data: payload.data,
        ...(payload.meta ?? {}),
        links: payload.links ?? {},
        prev_page_url: payload.links?.prev ?? null,
        next_page_url: payload.links?.next ?? null,
        sort: params.get("sort") ?? undefined,
        direction: params.get("direction") ?? undefined,
    };
}

function endpointById(apiBase) {
    return ({ id }) => `${apiBase}/${id}`;
}

function RoleDashboardRoutes() {
    const { roles, loading } = useAuth();

    if (loading) {
        return <PageLoading />;
    }

    if (roles.includes("student")) {
        return <StudentDashboard />;
    }

    if (
        roles.includes("trainer") &&
        !roles.includes("admin") &&
        !roles.includes("hod")
    ) {
        return <TrainerDashboard />;
    }

    return <AdminDashboard />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
                path="/login"
                element={
                    <PageRoute
                        component={Login}
                        componentName="Login"
                        endpoint="/api/auth/config"
                        authenticated={false}
                    />
                }
            />
            <Route
                path="/register"
                element={
                    <PageRoute
                        component={Register}
                        componentName="Register"
                        authenticated={false}
                    />
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PageRoute
                        component={ForgotPassword}
                        componentName="ForgotPassword"
                        endpoint="/api/auth/config"
                        authenticated={false}
                    />
                }
            />
            <Route
                path="/reset-password/:token?"
                element={
                    <PageRoute
                        component={ResetPassword}
                        componentName="ResetPassword"
                        authenticated={false}
                    />
                }
            />
            <Route
                path="/confirm-password"
                element={
                    <PageRoute
                        component={ConfirmPassword}
                        componentName="ConfirmPassword"
                        authenticated={false}
                    />
                }
            />
            <Route
                path="/verify-email"
                element={
                    <PageRoute
                        component={VerifyEmail}
                        componentName="VerifyEmail"
                        authenticated={false}
                    />
                }
            />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/trainer/*" element={<TrainerDashboard />} />
            <Route path="/*" element={<RoleDashboardRoutes />} />
        </Routes>
    );
}
