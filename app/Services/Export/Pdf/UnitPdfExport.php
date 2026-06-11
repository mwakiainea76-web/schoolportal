<?php

namespace App\Services\Export\Pdf;

use App\Models\Unit;
use App\Services\Export\BasePdfExport;

class UnitPdfExport extends BasePdfExport
{
    protected string $orientation = 'P';

    protected function getTitle(): string
    {
        return 'Units Report';
    }

    protected function getFilename(): string
    {
        return 'units_'.now()->format('Y_m_d').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->setHeaderStyle();

        $this->pdf->Cell(12, 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell(28, 9, 'Code', 'B', 0, 'L', true);
        $this->pdf->Cell(70, 9, 'Name', 'B', 0, 'L', true);
        $this->pdf->Cell(25, 9, 'Module Taught', 'B', 0, 'C', true);
        $this->pdf->Cell(55, 9, 'Course', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        $this->query($filters)
            ->chunk($this->chunkSize, function ($units) {
                foreach ($units as $unit) {
                    $this->ensureTableSpace(8);

                    $alt = $this->incrementRow();

                    $this->resetBodyStyle($alt);
                    $this->pdf->SetDrawColor(232, 238, 246);
                    $this->pdf->SetLineWidth(0.1);

                    $this->pdf->Cell(12, 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(28, 8, $this->pdfText($unit->code), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(70, 8, $this->pdfText($unit->name), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(25, 8, (string) $unit->module_taught, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(55, 8, $this->pdfText($unit->curriculumMapping?->course?->name ?? 'N/A'), 'B', 1, 'L', $alt);
                }
            });
    }

    protected function headings(): array
    {
        return ['S/N', 'Code', 'Name', 'Module Taught', 'Course'];
    }

    protected function rows(array $filters): iterable
    {
        $count = 0;

        foreach ($this->query($filters)->cursor() as $unit) {
            $count++;

            yield [
                $count,
                $unit->code,
                $unit->name,
                $unit->module_taught,
                $unit->curriculumMapping?->course?->name ?? 'N/A',
            ];
        }
    }

    private function query(array $filters)
    {
        $sorts = [
            'id' => 'id',
            'code' => 'code',
            'name' => 'name',
            'module_taught' => 'module_taught',
            'created_at' => 'created_at',
        ];
        $sortColumn = $sorts[$filters['sort'] ?? 'module_taught'] ?? 'module_taught';
        $requestedDirection = $filters['direction'] ?? 'asc';
        $direction = in_array($requestedDirection, ['asc', 'desc'], true)
            ? $requestedDirection
            : 'asc';

        return Unit::query()
            ->with(['curriculumMapping.course'])
            ->when(($filters['unit_id'] ?? '') !== '', fn ($query) => $query->whereKey($filters['unit_id']))
            ->when(($filters['module_taught'] ?? '') !== '', fn ($query) => $query->where('module_taught', $filters['module_taught']))
            ->when(($filters['course_id'] ?? '') !== '', function ($query) use ($filters) {
                $query->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->whereKey($filters['course_id']));
            })
            ->when(($filters['curriculum_mapping_id'] ?? '') !== '', fn ($query) => $query->where('curriculum_mapping_id', $filters['curriculum_mapping_id']))
            ->orderBy($sortColumn, $direction)
            ->orderBy('code');
    }
}
