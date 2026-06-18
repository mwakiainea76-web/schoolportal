<?php

namespace App\Http\Controllers;

use App\Http\Requests\EscalateComplaintRequest;
use App\Http\Requests\StoreComplaintRequest;
use App\Models\Complaint;
use App\Models\Staff;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function studentIndex(Request $request)
    {
        $student = $request->user()?->student;
        abort_unless($student, 403);

        $complaints = Complaint::query()
            ->where('student_id', $student->id)
            ->with('escalatedTo:id,first_name,last_name,other_name,designation')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Complaint $complaint) => [
                'id' => $complaint->id,
                'subject' => $complaint->subject,
                'status' => $complaint->status,
                'escalated_to' => $complaint->escalatedTo ? [
                    'name' => $complaint->escalatedTo->full_name,
                    'designation' => $complaint->escalatedTo->designation,
                ] : null,
                'created_at' => $complaint->created_at?->format('Y-m-d H:i'),
            ]);

        return inertia('Complaints/Index', [
            'complaints' => $complaints,
        ]);
    }

    public function create()
    {
        return inertia('Complaints/Create');
    }

    public function store(StoreComplaintRequest $request)
    {
        $student = $request->user()->student;

        Complaint::create([
            'student_id' => $student->id,
            'subject' => $request->subject,
            'description' => $request->description,
        ]);

        return redirect()
            ->route('student.complaints.index')
            ->with('success', 'Complaint submitted successfully.');
    }

    public function adminIndex(Request $request)
    {
        $complaints = Complaint::query()
            ->with([
                'student:id,user_id,admission_number,first_name,last_name,other_name',
                'student.user:id,email',
                'escalatedTo:id,first_name,last_name,other_name,designation',
            ])
            ->when(
                $request->filled('status'),
                fn ($query) => $query->where('status', $request->status)
            )
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Complaint $complaint) => [
                'id' => $complaint->id,
                'subject' => $complaint->subject,
                'description' => $complaint->description,
                'status' => $complaint->status,
                'student' => $complaint->student ? [
                    'admission_number' => $complaint->student->admission_number,
                    'name' => $complaint->student->full_name,
                    'email' => $complaint->student->user?->email,
                ] : null,
                'escalated_to' => $complaint->escalatedTo ? [
                    'name' => $complaint->escalatedTo->full_name,
                    'designation' => $complaint->escalatedTo->designation,
                ] : null,
                'admin_notes' => $complaint->admin_notes,
                'created_at' => $complaint->created_at?->format('Y-m-d H:i'),
            ]);

        return inertia('Complaints/AdminIndex', [
            'complaints' => $complaints,
            'filterStatus' => $request->status ?? '',
        ]);
    }

    public function show(Complaint $complaint)
    {
        $complaint->load([
            'student:id,user_id,admission_number,first_name,last_name,other_name',
            'student.user:id,email',
            'escalatedTo:id,first_name,last_name,other_name,designation,staff_number,department_id',
            'escalatedTo.department:id,name',
        ]);

        return inertia('Complaints/AdminShow', [
            'complaint' => [
                'id' => $complaint->id,
                'subject' => $complaint->subject,
                'description' => $complaint->description,
                'status' => $complaint->status,
                'admin_notes' => $complaint->admin_notes,
                'created_at' => $complaint->created_at?->format('Y-m-d H:i'),
                'escalated_at' => $complaint->escalated_at?->format('Y-m-d H:i'),
                'resolved_at' => $complaint->resolved_at?->format('Y-m-d H:i'),
                'student' => $complaint->student ? [
                    'admission_number' => $complaint->student->admission_number,
                    'name' => $complaint->student->full_name,
                    'email' => $complaint->student->user?->email,
                ] : null,
                'escalated_to' => $complaint->escalatedTo ? [
                    'name' => $complaint->escalatedTo->full_name,
                    'staff_number' => $complaint->escalatedTo->staff_number,
                    'designation' => $complaint->escalatedTo->designation,
                    'department' => $complaint->escalatedTo->department?->name,
                ] : null,
            ],
            'staffOptions' => Staff::query()
                ->whereHas('user', fn ($q) => $q->whereNotNull('id'))
                ->orderBy('first_name')
                ->get(['id', 'staff_number', 'first_name', 'last_name', 'other_name', 'designation'])
                ->map(fn (Staff $staff) => [
                    'value' => (string) $staff->id,
                    'label' => trim("{$staff->full_name} ({$staff->staff_number}) - {$staff->designation}"),
                ]),
        ]);
    }

    public function escalate(EscalateComplaintRequest $request, Complaint $complaint)
    {
        $complaint->update([
            'status' => 'escalated',
            'escalated_to' => $request->escalated_to,
            'escalated_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()
            ->route('complaints.admin.show', $complaint)
            ->with('success', 'Complaint escalated successfully.');
    }

    public function resolve(Request $request, Complaint $complaint)
    {
        $request->validate(['admin_notes' => ['nullable', 'string', 'max:5000']]);

        $complaint->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()
            ->route('complaints.admin.show', $complaint)
            ->with('success', 'Complaint marked as resolved.');
    }
}
