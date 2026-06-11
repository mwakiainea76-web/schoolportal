<?php

namespace App\Services\Export\Pdf;

use App\Models\StudentMark;
use App\Models\Unit;
use App\Services\Export\BasePdfExport;

class MarksPdfExport extends BasePdfExport
{
    protected string $orientation = 'L';

    private ?Unit $unit = null;

    public function render(array $filters = []): string
    {
        $this->unit = Unit::query()->findOrFail((int) $filters['curriculum_unit_id']);

        return parent::render($filters);
    }

    protected function getTitle(): string
    {
        return 'View Marks Report';
    }

    protected function getFilename(): string
    {
        return 'marks-export-'.now()->format('Y-m-d-His').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->setHeaderStyle();

        foreach ($this->columns() as $column) {
            $this->pdf->Cell($column['width'], 8, $column['label'], 'B', 0, $column['align'], true);
        }

        $this->pdf->Ln();
    }

    protected function addTableBody(array $filters): void
    {
        foreach ($this->query($filters)->cursor() as $mark) {
            $this->ensureTableSpace(8);

            $alternate = $this->incrementRow();
            $this->resetBodyStyle($alternate);
            $this->pdf->SetDrawColor(232, 238, 246);

            $row = [
                (string) $this->rowCount,
                $mark->student?->admission_number ?? '',
                $mark->student?->full_name ?? '',
                $mark->curriculumUnit?->name ?? '',
                $mark->academicSession?->display_name ?? '',
                ucfirst((string) $mark->assessment_type),
                (string) (int) $mark->assessment_number,
                (string) (int) $mark->marks,
                $mark->is_published ? 'Published' : 'Unpublished',
            ];

            foreach ($this->columns() as $index => $column) {
                $this->pdf->Cell(
                    $column['width'],
                    8,
                    $this->fitText($row[$index], $column['width'] - 2),
                    'B',
                    0,
                    $column['align'],
                    true
                );
            }

            $this->pdf->Ln();
        }
    }

    private function columns(): array
    {
        return [
            ['label' => 'S/N', 'width' => 12, 'align' => 'C'],
            ['label' => 'Reg. No.', 'width' => 26, 'align' => 'L'],
            ['label' => 'Student', 'width' => 58, 'align' => 'L'],
            ['label' => 'Unit', 'width' => 58, 'align' => 'L'],
            ['label' => 'Session', 'width' => 36, 'align' => 'L'],
            ['label' => 'Type', 'width' => 25, 'align' => 'L'],
            ['label' => 'Assessment', 'width' => 28, 'align' => 'C'],
            ['label' => 'Marks', 'width' => 16, 'align' => 'C'],
            ['label' => 'Status', 'width' => 22, 'align' => 'L'],
        ];
    }

    private function query(array $filters)
    {
        $query = StudentMark::query()
            ->with([
                'student',
                'curriculumUnit:id,name',
                'academicSession:id,academic_year_id,session_number,session_No,label',
                'academicSession.academicYear:id,label,academic_year',
            ])
            ->where('curriculum_unit_id', (int) $filters['curriculum_unit_id']);

        if (! empty($filters['assessment_type'])) {
            $query->where('assessment_type', $filters['assessment_type']);
        }

        if (! empty($filters['assessment_number'])) {
            $query->where('assessment_number', (int) $filters['assessment_number']);
        }

        if (! empty($filters['academic_year_id'])) {
            $query->whereHas('academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', (int) $filters['academic_year_id']));
        }

        if (! empty($filters['academic_session_id'])) {
            $query->where('academic_session_id', (int) $filters['academic_session_id']);
        }

        return $query
            ->orderBy('assessment_type')
            ->orderBy('assessment_number')
            ->orderBy('student_id');
    }

    private function fitText(?string $value, float $width): string
    {
        $text = $this->pdfText($value);

        if ($this->pdf->GetStringWidth($text) <= $width) {
            return $text;
        }

        while ($text !== '' && $this->pdf->GetStringWidth($text.'...') > $width) {
            $text = substr($text, 0, -1);
        }

        return $text === '' ? '' : $text.'...';
    }
}
