<?php

namespace App\Services\Export\Pdf;

use App\Models\CurriculumMapping;
use App\Services\Export\BasePdfExport;

class CurriculumMappingPdfExport extends BasePdfExport
{
    protected string $orientation = 'L';

    private array $currentFilters = [];

    private array $tableWidths = [];

    public function render(array $filters = []): string
    {
        $this->currentFilters = $filters;
        $this->tableWidths = [];
        $this->orientation = $this->shouldUseLandscape($filters) ? 'L' : 'P';

        return parent::render($filters);
    }

    protected function getTitle(): string
    {
        return 'Curriculum Mappings Report';
    }

    protected function getFilename(): string
    {
        return 'curriculum_mappings_'.now()->format('Y_m_d').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->prepareTableWidths();
        $this->setHeaderStyle();

        $this->pdf->Cell($this->tableWidths['sn'], 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell($this->tableWidths['curriculum'], 9, 'Curriculum', 'B', 0, 'L', true);
        $this->pdf->Cell($this->tableWidths['course'], 9, 'Course', 'B', 0, 'L', true);
        $this->pdf->Cell($this->tableWidths['exam_body'], 9, 'Exam Body', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        $this->query($filters)
            ->chunk($this->chunkSize, function ($mappings) {
                foreach ($mappings as $mapping) {
                    $this->ensureTableSpace(8);

                    $alt = $this->incrementRow();

                    $this->resetBodyStyle($alt);
                    $this->pdf->SetDrawColor(232, 238, 246);
                    $this->pdf->SetLineWidth(0.1);

                    $this->pdf->Cell($this->tableWidths['sn'], 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell($this->tableWidths['curriculum'], 8, $this->pdfText($mapping->curriculum?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell($this->tableWidths['course'], 8, $this->pdfText($mapping->course?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell($this->tableWidths['exam_body'], 8, $this->pdfText($this->examBodyName($mapping)), 'B', 1, 'L', $alt);
                }
            });
    }

    protected function headings(): array
    {
        return ['S/N', 'Curriculum', 'Course', 'Exam Body', 'Status', 'Created'];
    }

    protected function rows(array $filters): iterable
    {
        $count = 0;

        foreach ($this->query($filters)->cursor() as $mapping) {
            $count++;

            yield [
                $count,
                $mapping->curriculum?->name ?? 'N/A',
                $mapping->course?->name ?? 'N/A',
                $this->examBodyName($mapping),
                $mapping->is_active ? 'Active' : 'Inactive',
                $mapping->created_at->format('F j, Y'),
            ];
        }
    }

    private function query(array $filters)
    {
        $sorts = [
            'id' => 'id',
            'name' => 'curriculum_id',
            'course' => 'course_id',
            'created' => 'created_at',
            'created_at' => 'created_at',
            'is_active' => 'is_active',
        ];
        $sortColumn = $sorts[$filters['sort'] ?? 'created_at'] ?? 'created_at';
        $requestedDirection = $filters['direction'] ?? 'desc';
        $direction = in_array($requestedDirection, ['asc', 'desc'], true)
            ? $requestedDirection
            : 'desc';

        return CurriculumMapping::query()
            ->with(['course.certificationLevel.examBody', 'curriculum'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($nested) use ($search) {
                    $nested
                        ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery
                            ->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('course', fn ($courseQuery) => $courseQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%"))
                        ->orWhereHas('course.certificationLevel.examBody', fn ($examBodyQuery) => $examBodyQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%"));
                });
            })
            ->when(($filters['course_id'] ?? '') !== '', fn ($query) => $query->where('course_id', $filters['course_id']))
            ->when(($filters['curriculum_id'] ?? '') !== '', fn ($query) => $query->where('curriculum_id', $filters['curriculum_id']))
            ->when(($filters['exam_body_id'] ?? '') !== '', function ($query) use ($filters) {
                $query->whereHas('course.certificationLevel', fn ($levelQuery) => $levelQuery->where('exam_body_id', $filters['exam_body_id']));
            })
            ->when(($filters['is_active'] ?? '') !== '' && in_array((string) $filters['is_active'], ['0', '1'], true), function ($query) use ($filters) {
                $query->where('is_active', (bool) $filters['is_active']);
            })
            ->orderBy($sortColumn, $direction);
    }

    private function examBodyName(CurriculumMapping $mapping): string
    {
        $examBody = $mapping->course?->certificationLevel?->examBody;

        if (! $examBody) {
            return 'N/A';
        }

        return $examBody->name;
    }

    private function prepareTableWidths(): void
    {
        if ($this->tableWidths !== []) {
            return;
        }

        $widths = [
            'sn' => $this->cellWidth('S/N', 12, 18),
            'curriculum' => $this->cellWidth('Curriculum', 30, 95),
            'course' => $this->cellWidth('Course', 30, 95),
            'exam_body' => $this->cellWidth('Exam Body', 30, 75),
        ];

        foreach ($this->query($this->currentFilters)->cursor() as $index => $mapping) {
            $widths['sn'] = max($widths['sn'], $this->cellWidth((string) ($index + 1), 12, 18));
            $widths['curriculum'] = max($widths['curriculum'], $this->cellWidth($mapping->curriculum?->name ?? 'N/A', 30, 95));
            $widths['course'] = max($widths['course'], $this->cellWidth($mapping->course?->name ?? 'N/A', 30, 95));
            $widths['exam_body'] = max($widths['exam_body'], $this->cellWidth($this->examBodyName($mapping), 30, 75));
        }

        $this->tableWidths = $this->fitTableWidths($widths);
    }

    private function cellWidth(string $value, float $minimum, float $maximum): float
    {
        $width = $this->pdf->GetStringWidth($this->pdfText($value)) + 8;

        return min($maximum, max($minimum, $width));
    }

    private function fitTableWidths(array $widths): array
    {
        $availableWidth = $this->pageWidth();
        $totalWidth = array_sum($widths);
        $fixedWidth = $widths['sn'];
        $scalableKeys = ['curriculum', 'course', 'exam_body'];
        $scalableWidth = array_sum(array_intersect_key($widths, array_flip($scalableKeys)));
        $availableScalableWidth = $availableWidth - $fixedWidth;

        if ($scalableWidth <= 0 || $availableScalableWidth <= 0) {
            return $widths;
        }

        foreach ($scalableKeys as $key) {
            $widths[$key] = max(30, $widths[$key] * ($availableScalableWidth / $scalableWidth));
        }

        return $widths;
    }

    private function shouldUseLandscape(array $filters): bool
    {
        $estimatedWidths = [
            'sn' => $this->estimatedCellWidth('S/N', 12, 18),
            'curriculum' => $this->estimatedCellWidth('Curriculum', 30, 95),
            'course' => $this->estimatedCellWidth('Course', 30, 95),
            'exam_body' => $this->estimatedCellWidth('Exam Body', 30, 75),
        ];

        foreach ($this->query($filters)->cursor() as $index => $mapping) {
            $estimatedWidths['sn'] = max($estimatedWidths['sn'], $this->estimatedCellWidth((string) ($index + 1), 12, 18));
            $estimatedWidths['curriculum'] = max($estimatedWidths['curriculum'], $this->estimatedCellWidth($mapping->curriculum?->name ?? 'N/A', 30, 95));
            $estimatedWidths['course'] = max($estimatedWidths['course'], $this->estimatedCellWidth($mapping->course?->name ?? 'N/A', 30, 95));
            $estimatedWidths['exam_body'] = max($estimatedWidths['exam_body'], $this->estimatedCellWidth($this->examBodyName($mapping), 30, 75));
        }

        return array_sum($estimatedWidths) > 190;
    }

    private function estimatedCellWidth(string $value, float $minimum, float $maximum): float
    {
        $width = (strlen($value) * 1.8) + 8;

        return min($maximum, max($minimum, $width));
    }
}
