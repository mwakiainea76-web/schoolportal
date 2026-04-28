<?php

namespace App\Http\Controllers;

use App\Models\StudentCredit;
use Illuminate\Http\Request;

class StudentCreditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $credits = StudentCredit::with(['student.user', 'sourceInvoice', 'appliedInvoice'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/StudentCredits/Index', compact('credits'));
    }
}
