<?php

namespace App\Http\Controllers;

use App\Filters\ExamBodyFilter;
use App\Http\Requests\ExamBodyRequest;
use App\Http\Requests\UpdateExamBodyRequest;
use App\Models\ExamBody;
use App\Services\ExamBodyService;
use Illuminate\Http\Request;

class ExamBodyController extends Controller
{
    protected $service;

    public function __construct(ExamBodyService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, ExamBodyFilter $filter)
    {
        $examBodies = ExamBody::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                $request->only(['search', 'sort', 'direction'])
            ))
            ->with(['certificationLevels' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        $selectedExamBodyId = $request->integer('exam_body_id')
            ?: $examBodies->first()?->id;

        return inertia('ExamBodies/Workspace', [
            'activeTab' => 'exam-bodies',
            'examBodies' => $examBodies,
            'selectedExamBodyId' => $selectedExamBodyId,
            'filters' => [
                'search' => $request->search,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);
    }

    public function create()
    {
        return inertia('ExamBodies/Create');
    }

    public function store(ExamBodyRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('exam.bodies.index')
            ->with('success', 'Exam body created successfully');
    }

    public function show(ExamBody $exam_body)
    {
        return inertia('ExamBodies/Show', [
            'exam_body' => $exam_body,
        ]);
    }

    public function edit(ExamBody $exam_body)
    {
        return inertia('ExamBodies/Edit', [
            'exam_body' => $exam_body,
        ]);
    }

    public function update(UpdateExamBodyRequest $request, ExamBody $exam_body)
    {
        $this->service->update($exam_body, $request->validated());

        return redirect()
            ->route('exam.bodies.index', ['exam_body_id' => $exam_body->id])
            ->with('success', 'Exam body updated successfully');
    }

    public function destroy(ExamBody $exam_body)
    {
        $result = $this->service->delete($exam_body);

        if (! $result['status']) {
            return redirect()
                ->route('exam.bodies.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('exam.bodies.index')
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        return $this->service->search($request->q);
    }

    public function showreports(Request $request, ExamBodyFilter $filter)
    {
        $examBodies = ExamBody::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                $request->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('ExamBodies/Reports', [
            'examBodies' => $examBodies,
        ]);
    }
}
