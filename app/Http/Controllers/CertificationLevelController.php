<?php

namespace App\Http\Controllers;

use App\Filters\CertificationLevelFilter;
use App\Http\Requests\StoreCertificationLevel;
use App\Http\Requests\UpdateCertificationLevel;
use App\Models\CertificationLevel;
use App\Models\ExamBody;
use App\Services\CertificationLevelService;
use Illuminate\Http\Request;

class CertificationLevelController extends Controller
{
    protected $service;

    public function __construct(CertificationLevelService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, CertificationLevelFilter $filter)
    {
        $examBodies = ExamBody::query()
            ->with(['certificationLevels' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        $certificationLevels = CertificationLevel::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                $request->only(['search', 'sort', 'direction', 'exam_body_id'])
            ))
            ->with('examBody')
            ->orderBy('name')
            ->get();

        $selectedExamBody = $request->filled('exam_body_id')
            ? ExamBody::select('id', 'name', 'code')->find($request->integer('exam_body_id'))
            : $examBodies->first();

        return inertia('ExamBodies/Workspace', [
            'activeTab' => 'certification-levels',
            'examBodies' => $examBodies,
            'certificationLevels' => $certificationLevels,
            'selectedExamBody' => $selectedExamBody,
            'selectedExamBodyId' => $selectedExamBody?->id,
            'filters' => [
                'search' => $request->search,
                'sort' => $request->sort,
                'direction' => $request->direction,
                'exam_body_id' => $request->exam_body_id,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $selectedExamBodyId = $request->integer('exam_body_id');

        return inertia('CertificationLevels/Create', [
            'examBodies' => [],
            'selectedExamBodyId' => $selectedExamBodyId ?: null,
            'selectedExamBody' => $selectedExamBodyId
                ? ExamBody::select('id', 'name', 'code')->find($selectedExamBodyId)
                : null,
        ]);
    }

    public function store(StoreCertificationLevel $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('certification-levels.index', [
                'exam_body_id' => $request->integer('exam_body_id'),
            ])
            ->with('success', 'Certification level created successfully.');
    }

    public function edit(CertificationLevel $certification_level)
    {
        return inertia('CertificationLevels/Edit', [
            'exam_bodies' => [],
            'certification_level' => $certification_level,
            'selectedExamBody' => $certification_level->examBody()
                ->select('id', 'name', 'code')
                ->first(),
        ]);
    }

    public function update(UpdateCertificationLevel $request, CertificationLevel $certification_level)
    {
        $this->service->update($certification_level, $request->validated());

        return redirect()
            ->route('certification-levels.index', [
                'exam_body_id' => $certification_level->exam_body_id,
            ])
            ->with('success', 'Certification level updated successfully.');
    }

    public function destroy(CertificationLevel $certification_level)
    {
        $result = $this->service->delete($certification_level);

        if (! $result['status']) {
            return redirect()
                ->route('certification-levels.index', [
                    'exam_body_id' => $certification_level->exam_body_id,
                ])
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('certification-levels.index', [
                'exam_body_id' => $certification_level->exam_body_id,
            ])
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        return $this->service->search(
            $request->q,
            $request->exam_body_id
        );
    }
}
