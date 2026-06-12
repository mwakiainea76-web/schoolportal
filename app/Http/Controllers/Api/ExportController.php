<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Export\BasePdfExport;
use App\Services\Export\Pdf\CoursePdfExport;
use App\Services\Export\Pdf\CurriculumMappingPdfExport;
use App\Services\Export\Pdf\CurriculumPdfExport;
use App\Services\Export\Pdf\DepartmentPdfExport;
use App\Services\Export\Pdf\UnitPdfExport;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    private array $exports = [
        'courses' => CoursePdfExport::class,
        'curriculum-mappings' => CurriculumMappingPdfExport::class,
        'curriculums' => CurriculumPdfExport::class,
        'departments' => DepartmentPdfExport::class,
        'units' => UnitPdfExport::class,
    ];

    public function export(Request $request, string $resource)
    {
        abort_unless(isset($this->exports[$resource]), 404, 'Export not available for this resource.');

        $validated = $request->validate([
            'format' => ['nullable', 'in:pdf,csv,excel'],
        ]);
        $format = $validated['format'] ?? 'pdf';

        $service = app($this->exports[$resource]);
        abort_unless($service instanceof BasePdfExport, 500, 'Invalid PDF export service.');

        $filters = $request->except(['format']);
        $filters = $this->scopeFiltersForHod($request, $resource, $filters);
        $content = $format === 'pdf'
            ? $service->render($filters)
            : $service->renderDelimited($filters, $format);

        return response($content, 200, [
            'Content-Type' => $service->contentTypeFor($format),
            'Content-Disposition' => 'attachment; filename="'.$service->filenameFor($format).'"',
            'Content-Length' => strlen($content),
            'Cache-Control' => 'no-cache, no-store',
            'Pragma' => 'no-cache',
        ]);
    }

    private function scopeFiltersForHod(Request $request, string $resource, array $filters): array
    {
        $departmentId = $request->user()?->staff?->department_id;

        if (
            ! $departmentId
            || ! $request->user()?->hasRole('hod')
            || $request->user()?->hasRole('admin')
            || ! in_array($resource, ['courses', 'units'], true)
        ) {
            return $filters;
        }

        $filters['department_id'] = (string) $departmentId;

        if ($resource === 'courses') {
            $filters['versioned_only'] = '1';
        }

        return $filters;
    }
}
