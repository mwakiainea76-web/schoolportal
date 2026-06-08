const fs = require('fs');
const path = require('path');

const files = [
    'resources/js/Pages/Academic/Timetables/Create.jsx',
    'resources/js/Pages/Academic/Timetables/CreateHod.jsx',
    'resources/js/Pages/Academic/Timetables/Index.jsx',
    'resources/js/Pages/AcademicSessionEnrollments/Create.jsx',
    'resources/js/Pages/AcademicSessionEnrollments/Edit.jsx',
    'resources/js/Pages/AcademicSessionEnrollments/Index.jsx',
    'resources/js/Pages/AcademicSessions/Create.jsx',
    'resources/js/Pages/AcademicSessions/Edit.jsx',
    'resources/js/Pages/AcademicSessions/Index.jsx',
    'resources/js/Pages/AcademicYears/Create.jsx',
    'resources/js/Pages/AcademicYears/Edit.jsx',
    'resources/js/Pages/AcademicYears/Index.jsx',
    'resources/js/Pages/Billing/BulkOperations.jsx',
    'resources/js/Pages/Billing/InvoiceCreate.jsx',
    'resources/js/Pages/Billing/InvoiceIndex.jsx',
    'resources/js/Pages/Billing/InvoiceShow.jsx',
    'resources/js/Pages/Billing/LedgerIndex.jsx',
    'resources/js/Pages/Billing/ManualOperations/FormScaffold.jsx',
    'resources/js/Pages/Billing/StudentStatements/Index.jsx',
    'resources/js/Pages/Billing/StudentStatements/Show.jsx',
    'resources/js/Pages/CertificationLevels/Create.jsx',
    'resources/js/Pages/CertificationLevels/Edit.jsx',
    'resources/js/Pages/CertificationLevels/Index.jsx',
    'resources/js/Pages/Courses/Create.jsx',
    'resources/js/Pages/Courses/Edit.jsx',
    'resources/js/Pages/Courses/Index.jsx',
    'resources/js/Pages/CurriculumMappings/Create.jsx',
    'resources/js/Pages/CurriculumMappings/Edit.jsx',
    'resources/js/Pages/CurriculumMappings/Index.jsx',
    'resources/js/Pages/CurriculumUnits/Create.jsx',
    'resources/js/Pages/CurriculumUnits/Edit.jsx',
    'resources/js/Pages/CurriculumUnits/Index.jsx',
    'resources/js/Pages/CurriculumUnits/StudentIndex.jsx',
    'resources/js/Pages/Curriculums/Create.jsx',
    'resources/js/Pages/Curriculums/Edit.jsx',
    'resources/js/Pages/Curriculums/Index.jsx',
    'resources/js/Pages/Departments/Create.jsx',
    'resources/js/Pages/Departments/Edit.jsx',
    'resources/js/Pages/Departments/Index.jsx',
    'resources/js/Pages/ExamBodies/Create.jsx',
    'resources/js/Pages/ExamBodies/Edit.jsx',
    'resources/js/Pages/ExamBodies/Index.jsx',
    'resources/js/Pages/ExamBodies/Reports.jsx',
    'resources/js/Pages/ExamBodies/Workspace.jsx',
    'resources/js/Pages/Fees/FeeAssignments/BulkAssign.jsx',
    'resources/js/Pages/Fees/FeeAssignments/BulkPreview.jsx',
    'resources/js/Pages/Fees/FeeAssignments/Create.jsx',
    'resources/js/Pages/Fees/FeeAssignments/Edit.jsx',
    'resources/js/Pages/Fees/FeeAssignments/Index.jsx',
    'resources/js/Pages/Fees/FeePlanItems/Create.jsx',
    'resources/js/Pages/Fees/FeePlanItems/Edit.jsx',
    'resources/js/Pages/Fees/FeePlanItems/Index.jsx',
    'resources/js/Pages/Fees/FeePlans/Create.jsx',
    'resources/js/Pages/Fees/FeePlans/Edit.jsx',
    'resources/js/Pages/Fees/FeePlans/Index.jsx',
    'resources/js/Pages/Grades/Add.jsx',
    'resources/js/Pages/Grades/Marksheet.jsx',
    'resources/js/Pages/Grades/Publish.jsx',
    'resources/js/Pages/Grades/View.jsx',
    'resources/js/Pages/HostelAllocations/Create.jsx',
    'resources/js/Pages/HostelAllocations/Edit.jsx',
    'resources/js/Pages/HostelAllocations/Index.jsx',
    'resources/js/Pages/Hostels/Create.jsx',
    'resources/js/Pages/Hostels/Edit.jsx',
    'resources/js/Pages/Hostels/Index.jsx',
    'resources/js/Pages/LectureRooms/Create.jsx',
    'resources/js/Pages/LectureRooms/Edit.jsx',
    'resources/js/Pages/LectureRooms/Index.jsx',
    'resources/js/Pages/Permissions/Create.jsx',
    'resources/js/Pages/Permissions/Edit.jsx',
    'resources/js/Pages/Permissions/Index.jsx',
    'resources/js/Pages/Reports/Index.jsx',
    'resources/js/Pages/Roles/Create.jsx',
    'resources/js/Pages/Roles/Edit.jsx',
    'resources/js/Pages/Roles/EditPermissions.jsx',
    'resources/js/Pages/Roles/Index.jsx',
    'resources/js/Pages/Staff/Dashboard.jsx',
    'resources/js/Pages/Staffs/Create.jsx',
    'resources/js/Pages/Staffs/Edit.jsx',
    'resources/js/Pages/Staffs/Index.jsx',
    'resources/js/Pages/students/Create.jsx',
    'resources/js/Pages/students/Edit.jsx',
    'resources/js/Pages/students/Index.jsx',
];

files.forEach(file => {
    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Robust check for <AuthenticatedLayout> without header prop
    // Match <AuthenticatedLayout followed by either > or space but NOT header=
    const openTagRegex = /<AuthenticatedLayout\b(?![^>]*\bheader=)[^>]*>/g;
    const closeTagRegex = /<\/AuthenticatedLayout>/g;

    if (openTagRegex.test(content)) {
        console.log(`Processing: ${file}`);

        // Remove import
        content = content.replace(/^import AuthenticatedLayout from ["']@\/Layouts\/AuthenticatedLayout["'];?\r?\n?/m, '');
        
        // Reset regex because of 'g' flag
        openTagRegex.lastIndex = 0;
        
        // Replace opening tags
        content = content.replace(openTagRegex, '<>');
        
        // Replace closing tags
        content = content.replace(closeTagRegex, '</>');

        fs.writeFileSync(fullPath, content);
    } else {
        console.log(`Skipping: ${file} (has header or no AuthenticatedLayout)`);
    }
});
