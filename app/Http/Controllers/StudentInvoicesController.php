<?php

namespace App\Http\Controllers;

use App\Filters\StudentInvoicesFilter;
use App\Http\Requests\StoreStudentInvoicesRequest;
use App\Http\Requests\UpdateStudentInvoicesRequest;
use App\Models\AcademicSessionEnrollment;
use App\Models\Enrollment;
use App\Models\FeeModel;
use App\Models\Student;
use App\Models\StudentCredit;
use App\Models\StudentInvoices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentInvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, StudentInvoicesFilter $filter)
    {
        $invoices = $filter
            ->apply(
                StudentInvoices::with([
                    'enrollment.student.user',
                    'enrollment.academicSession',
                    'enrollment.courseEnrollment.courseCurriculum.course',
                    'enrollment.courseEnrollment.courseCurriculum.curriculum',
                    'feeModel',
                ]),
                $request->all()
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/StudentInvoices/Index', compact('invoices'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $feeModels = FeeModel::with('template')->active()->get()->map(function ($model) {
            return [
                'id' => $model->id,
                'name' => $model->display_name,
                'invoice_total' => 20000,
            ];
        });

        return inertia('Fees/StudentInvoices/Create', compact('feeModels'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentInvoicesRequest $request)
    {
        // 1. Find student by registration number
        $student = Student::where('registration_number', $request->registration_number)->first();

        if (! $student) {
            return back()
                ->withInput()
                ->withErrors(['registration_number' => "Student with admission number '{$request->registration_number}' is not registered."]);
        }

        // 2. Find active enrollment
        $enrollment = AcademicSessionEnrollment::whereHas('courseEnrollment', function ($q) use ($student) {
            $q->where('student_id', $student->id);
        })
            ->where('status', 'active')
            ->latest()
            ->first();

        if (! $enrollment) {
            return back()
                ->withInput()
                ->withErrors(['registration_number' => "Student '{$request->registration_number}' has not enrolled for current session."]);
        }

        // 3. Load fee model
        $feeModel = FeeModel::with([
            'template.components',
            'additionalCharges',
        ])->find($request->fee_model_id);

        if (! $feeModel) {
            return back()
                ->withInput()
                ->withErrors(['fee_model_id' => 'The selected fee model no longer exists.']);
        }
        $alreadyExists = StudentInvoices::where('fee_model_id', $request->fee_model_id)
            ->whereHas('enrollment.courseEnrollment', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })
            ->whereHas('enrollment', function ($q) use ($enrollment) {
                $q->where('academic_session_id', $enrollment->academic_session_id);
            })
            ->exists();

        if ($alreadyExists) {
            return back()
                ->withInput()
                ->withErrors([
                    'fee_model_id' => 'This invoice has already been assigned to this student for the selected academic session.',
                ]);
        }
        DB::transaction(function () use ($student, $enrollment, $feeModel) {
            // 4. Calculate gross amount
            $templateTotal = $feeModel->template
                ? $feeModel->template->components->sum('amount')
                : 0;
            $additionalTotal = $feeModel->additionalCharges->sum('amount');
            $grossAmount = $templateTotal + $additionalTotal;

            // 5. Create the invoice
            $invoice = StudentInvoices::create([
                'enrollment_id' => $enrollment->id,
                'fee_model_id' => $feeModel->id,
                'gross_amount' => $grossAmount,
                'adjusted_amount' => $grossAmount,
                'credit_balance' => 0,
                'overpayment_action' => 'credit',
                'status' => 'draft',
                'due_date' => $feeModel->valid_until ?? now()->addDays(30),
            ]);

            // 6. Apply available student credits
            $availableCredits = StudentCredit::where('student_id', $student->id)
                ->where('status', 'available')
                ->get();

            foreach ($availableCredits as $credit) {
                $invoice->adjustments()->create([
                    'scope' => 'student',
                    'scope_ref' => $student->id,
                    'type' => 'fixed',
                    'value' => -abs($credit->amount),
                    'reason' => "Credit carried from invoice #{$credit->source_invoice_id}",
                ]);

                $credit->update([
                    'status' => 'applied',
                    'applied_invoice_id' => $invoice->id,
                    'applied_at' => now(),
                ]);
            }

            // 7. Sync final adjusted amount
            if ($availableCredits->count() > 0) {
                $invoice->syncAdjustedAmount();
            } else {
                $invoice->syncOverpaymentArtifacts();
            }
        });

        return redirect()
            ->route('fees.students.invoices.index')
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentInvoices $studentInvoice)
    {
        $studentInvoice->load([
            'enrollment.student.user',
            'enrollment.academicSession',
            'enrollment.courseEnrollment.courseCurriculum.course',
            'enrollment.courseEnrollment.courseCurriculum.curriculum',
            'feeModel',
            'payments',
            'adjustments',
            'penalties',
        ]);

        return inertia('Fees/StudentInvoices/Show', compact('studentInvoice'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentInvoices $studentInvoice)
    {
        $studentInvoice->load([
            'enrollment.student.user',
            'enrollment.academicSession',
            'enrollment.courseEnrollment.courseCurriculum.course',
            'enrollment.courseEnrollment.courseCurriculum.curriculum',
            'feeModel',
        ]);

        $enrollments = Enrollment::with([
            'student.user',
            'academicSession',
            'courseEnrollment.courseCurriculum.course',
            'courseEnrollment.courseCurriculum.curriculum',
        ])
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->display_name,
            ]);

        $feeModels = FeeModel::query()
            ->active()
            ->forEnrollmentContext($studentInvoice->enrollment)
            ->ordered()
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->display_name,
            ]);

        return inertia('Fees/StudentInvoices/Edit', compact('studentInvoice', 'enrollments', 'feeModels'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentInvoicesRequest $request, StudentInvoices $studentInvoice)
    {
        $studentInvoice->update($request->validated());
        $studentInvoice->refresh();
        $studentInvoice->syncOverpaymentArtifacts();

        return redirect()
            ->route('fees.student-invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentInvoices $studentInvoice)
    {
        $studentInvoice->delete();

        return redirect()
            ->back()
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Search for invoices.
     */
    public function search(Request $request)
    {
        $term = $request->get('q');

        return StudentInvoices::with([
            'enrollment.student.user',
            'enrollment.academicSession',
            'enrollment.courseEnrollment.courseCurriculum.course',
            'enrollment.courseEnrollment.courseCurriculum.curriculum',
        ])
            ->where('id', 'like', "%{$term}%")
            ->orWhereHas('enrollment.student.user', function ($q) use ($term) {
                $q->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%");
            })
            ->orWhereHas('enrollment.student', function ($q) use ($term) {
                $q->where('registration_number', 'like', "%{$term}%");
            })
            ->orWhereHas('enrollment.academicSession', function ($q) use ($term) {
                $q->where('session_No', 'like', "%{$term}%");
            })
            ->limit(10)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => "Invoice #{$i->id} - ".$i->enrollment?->display_name,
            ]);
    }
}
