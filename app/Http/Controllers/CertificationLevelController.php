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

    public function index(CertificationLevelFilter $filter)
    {
        $certificationLevels = CertificationLevel::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->with('examBody')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('CertificationLevels/Index', [
            'certificationLevels' => $certificationLevels,
        ]);
    }

    public function create()
    {
        return inertia('CertificationLevels/Create', [
            'examBodies' => ExamBody::all(),
        ]);
    }

    public function store(StoreCertificationLevel $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('certification-levels.create')
            ->with('success', 'Certification level created successfully.');
    }

    public function edit(CertificationLevel $certification_level)
    {
        return inertia('CertificationLevels/Edit', [
            'exam_bodies' => ExamBody::select('id', 'name')->limit(20)->get(),
            'certification_level' => $certification_level,
        ]);
    }

    public function update(UpdateCertificationLevel $request, CertificationLevel $certification_level)
    {
        $this->service->update($certification_level, $request->validated());

        return redirect()
            ->route('certification-levels.edit', $certification_level->id)
            ->with('success', 'Certification level updated successfully.');
    }

    public function destroy(CertificationLevel $certification_level)
    {
        $result = $this->service->delete($certification_level);

        if (! $result['status']) {
            return redirect()
                ->route('certification-levels.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('certification-levels.index')
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