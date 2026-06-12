<?php

namespace App\Services\Export\Pdf;

use App\Models\Course;
use App\Services\Export\BasePdfExport;

class CoursePdfExport extends BasePdfExport
{
    protected string $orientation = 'L';

    protected function getTitle(): string
    {
        return 'Courses Report';
    }

    protected function getFilename(): string
    {
        return 'courses_'.now()->format('Y_m_d').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->setHeaderStyle();

        $this->pdf->Cell(12, 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell(30, 9, 'Code', 'B', 0, 'L', true);
        $this->pdf->Cell(60, 9, 'Name', 'B', 0, 'L', true);
        $this->pdf->Cell(30, 9, 'Level', 'B', 0, 'L', true);
        $this->pdf->Cell(35, 9, 'Department', 'B', 0, 'L', true);
        $this->pdf->Cell(55, 9, 'Curriculum', 'B', 0, 'L', true);
        $this->pdf->Cell(35, 9, 'Created', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        $this->query($filters)
            ->chunk($this->chunkSize, function ($courses) {
                foreach ($courses as $course) {
                    $this->ensureTableSpace(8);

                    $alt = $this->incrementRow();

                    $this->resetBodyStyle($alt);
                    $this->pdf->SetDrawColor(232, 238, 246);
                    $this->pdf->SetLineWidth(0.1);

                    $this->pdf->Cell(12, 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(30, 8, $this->pdfText($course->code), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(60, 8, $this->pdfText($course->name), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(30, 8, $this->pdfText($course->certificationLevel?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(35, 8, $this->pdfText($course->department?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(55, 8, $this->pdfText($course->curriculum?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(35, 8, $course->created_at->format('F j, Y'), 'B', 1, 'L', $alt);
                }
            });
    }

    protected function headings(): array
    {
        return ['S/N', 'Code', 'Name', 'Level', 'Department', 'Curriculum', 'Created'];
    }

    protected function rows(array $filters): iterable
    {
        $count = 0;

        foreach ($this->query($filters)->cursor() as $course) {
            $count++;

            yield [
                $count,
                $course->code,
                $course->name,
                $course->certificationLevel?->name ?? 'N/A',
                $course->department?->name ?? 'N/A',
                $course->curriculum?->name ?? 'N/A',
                $course->created_at->format('F j, Y'),
            ];
        }
    }

    private function query(array $filters)
    {
        $sorts = [
            'id' => 'id',
            'code' => 'code',
            'name' => 'name',
            'duration' => 'duration_in_months',
            'created' => 'created_at',
            'created_at' => 'created_at',
        ];
        $sortColumn = $sorts[$filters['sort'] ?? 'created_at'] ?? 'created_at';
        $requestedDirection = $filters['direction'] ?? 'desc';
        $direction = in_array($requestedDirection, ['asc', 'desc'], true)
            ? $requestedDirection
            : 'desc';

        return Course::query()
            ->with(['certificationLevel', 'curriculum', 'department'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($filters['course_id'] ?? null, fn ($query, $courseId) => $query->whereKey($courseId))
            ->when($filters['department_id'] ?? null, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->when($filters['versioned_only'] ?? null, function ($query) {
                $query->whereHas('curriculumMappings', function ($mappingQuery) {
                    $mappingQuery
                        ->where('is_active', true)
                        ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true));
                });
            })
            ->when($filters['exam_body_id'] ?? null, function ($query, $examBodyId) {
                $query->whereHas('certificationLevel', fn ($levelQuery) => $levelQuery->where('exam_body_id', $examBodyId));
            })
            ->when($filters['certification_level_id'] ?? null, fn ($query, $levelId) => $query->where('certification_level_id', $levelId))
            ->when($filters['curriculum_id'] ?? null, function ($query, $curriculumId) {
                $query->whereHas('curriculumMappings', function ($mappingQuery) use ($curriculumId) {
                    $mappingQuery
                        ->where('curriculum_id', $curriculumId)
                        ->where('is_active', true);
                });
            })
            ->orderBy($sortColumn, $direction);
    }
}
