<?php

namespace App\Services\Export\Pdf;

use App\Models\AcademicSession;
use App\Models\Unit;
use App\Services\Export\BasePdfExport;
use Illuminate\Support\Facades\DB;

class MarksheetPdfExport extends BasePdfExport
{
    protected string $orientation = 'L';

    private ?Unit $unit = null;

    private ?AcademicSession $session = null;

    public function render(array $filters = []): string
    {
        $this->unit = Unit::query()
            ->with('curriculumMapping.course')
            ->findOrFail((int) $filters['curriculum_unit_id']);

        $this->session = ! empty($filters['academic_session_id'])
            ? AcademicSession::query()
                ->with('academicYear:id,label,academic_year')
                ->find((int) $filters['academic_session_id'])
            : null;

        return parent::render($filters);
    }

    protected function getTitle(): string
    {
        return 'FA Marksheet Report';
    }

    protected function getFilename(): string
    {
        return 'marksheet-'.($this->unit?->code ?? 'unit').'-'.now()->format('Y-m-d-His').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->addMeta();
        $this->addGroupedHeader();
    }

    protected function addTableBody(array $filters): void
    {
        foreach ($this->query($filters)->cursor() as $row) {
            $this->ensureTableSpace(8);

            $alternate = $this->incrementRow();
            $this->resetBodyStyle($alternate);
            $this->pdf->SetDrawColor(232, 238, 246);

            $values = [
                (string) $this->rowCount,
                $row->admission_number ?? '',
                trim(($row->first_name ?? '').' '.($row->last_name ?? '')),
                $row->theory_fa1 !== null ? (string) (int) $row->theory_fa1 : '',
                $row->theory_fa2 !== null ? (string) (int) $row->theory_fa2 : '',
                $row->theory_fa3 !== null ? (string) (int) $row->theory_fa3 : '',
                $row->theory_average !== null ? number_format((float) $row->theory_average, 1) : '',
                $row->practical_fa1 !== null ? (string) (int) $row->practical_fa1 : '',
                $row->practical_fa2 !== null ? (string) (int) $row->practical_fa2 : '',
                $row->practical_fa3 !== null ? (string) (int) $row->practical_fa3 : '',
                $row->practical_average !== null ? number_format((float) $row->practical_average, 1) : '',
            ];

            foreach ($this->columns() as $index => $column) {
                $this->pdf->Cell(
                    $column['width'],
                    8,
                    $this->fitText($values[$index], $column['width'] - 2),
                    'B',
                    0,
                    $column['align'],
                    true
                );
            }

            $this->pdf->Ln();
        }
    }

    private function addMeta(): void
    {
        $course = $this->unit?->curriculumMapping?->course;
        $termDates = trim(($this->session?->start_date ?? '').' to '.($this->session?->end_date ?? ''), ' to');

        $this->pdf->SetFont('Arial', '', 8);
        $this->pdf->SetTextColor(74, 91, 128);

        $rows = [
            ['Course Code', $course?->code ?? '', 'Course Title', $course?->name ?? ''],
            ['Unit Code', $this->unit?->code ?? '', 'Unit Title', $this->unit?->name ?? ''],
            ['Session', $this->session?->display_name ?? '', 'Term Dates', $termDates],
        ];

        foreach ($rows as [$leftLabel, $leftValue, $rightLabel, $rightValue]) {
            $this->pdf->SetFont('Arial', 'B', 8);
            $this->pdf->Cell(24, 5, $this->pdfText($leftLabel.':'), 0, 0, 'L');
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->Cell(110, 5, $this->fitText($leftValue, 108), 0, 0, 'L');
            $this->pdf->SetFont('Arial', 'B', 8);
            $this->pdf->Cell(24, 5, $this->pdfText($rightLabel.':'), 0, 0, 'L');
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->Cell(0, 5, $this->fitText($rightValue, 110), 0, 1, 'L');
        }

        $this->pdf->Ln(2);
    }

    private function addGroupedHeader(): void
    {
        $this->pdf->SetFont('Arial', 'B', 8);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetDrawColor(120, 120, 120);

        $this->pdf->SetFillColor(249, 250, 251);
        $this->pdf->Cell(12, 14, 'S/N', 1, 0, 'L', true);
        $this->pdf->Cell(28, 14, "Candidate's Reg Code", 1, 0, 'L', true);
        $this->pdf->Cell(58, 14, "Candidate's Name", 1, 0, 'L', true);

        $this->pdf->SetFillColor(229, 231, 235);
        $this->pdf->Cell(82, 7, 'Continuous Theory (CT) Marks (100%)', 1, 0, 'C', true);

        $this->pdf->SetFillColor(255, 243, 224);
        $this->pdf->Cell(82, 7, 'Continuous Practical (CP) Marks (100%)', 1, 1, 'C', true);

        $this->pdf->SetX(108);
        $this->pdf->SetFillColor(249, 250, 251);
        $this->pdf->Cell(20, 7, 'FA 1', 1, 0, 'C', true);
        $this->pdf->Cell(20, 7, 'FA 2', 1, 0, 'C', true);
        $this->pdf->Cell(20, 7, 'FA 3', 1, 0, 'C', true);
        $this->pdf->SetFillColor(229, 231, 235);
        $this->pdf->Cell(22, 7, 'Average', 1, 0, 'C', true);

        $this->pdf->SetFillColor(255, 248, 237);
        $this->pdf->Cell(20, 7, 'Pract 1', 1, 0, 'C', true);
        $this->pdf->Cell(20, 7, 'Pract 2', 1, 0, 'C', true);
        $this->pdf->Cell(20, 7, 'Pract 3', 1, 0, 'C', true);
        $this->pdf->SetFillColor(255, 243, 224);
        $this->pdf->Cell(22, 7, 'Average', 1, 1, 'C', true);
    }

    private function columns(): array
    {
        return [
            ['width' => 12, 'align' => 'C'],
            ['width' => 28, 'align' => 'L'],
            ['width' => 58, 'align' => 'L'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 22, 'align' => 'C'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 20, 'align' => 'C'],
            ['width' => 22, 'align' => 'C'],
        ];
    }

    private function query(array $filters)
    {
        return DB::table('student_marks')
            ->join('students', 'students.id', '=', 'student_marks.student_id')
            ->join('academic_sessions', 'academic_sessions.id', '=', 'student_marks.academic_session_id')
            ->where('student_marks.curriculum_unit_id', (int) $filters['curriculum_unit_id'])
            ->when(! empty($filters['academic_year_id']), fn ($query) => $query->where('academic_sessions.academic_year_id', (int) $filters['academic_year_id']))
            ->when(! empty($filters['academic_session_id']), fn ($query) => $query->where('student_marks.academic_session_id', (int) $filters['academic_session_id']))
            ->groupBy('students.id', 'students.admission_number', 'students.first_name', 'students.last_name')
            ->orderBy('students.id')
            ->selectRaw('
                students.id as student_id,
                students.admission_number,
                students.first_name,
                students.last_name,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 1 THEN student_marks.marks END) as theory_fa1,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 2 THEN student_marks.marks END) as theory_fa2,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 3 THEN student_marks.marks END) as theory_fa3,
                AVG(CASE WHEN student_marks.assessment_type = \'theory\' THEN student_marks.marks END) as theory_average,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 1 THEN student_marks.marks END) as practical_fa1,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 2 THEN student_marks.marks END) as practical_fa2,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 3 THEN student_marks.marks END) as practical_fa3,
                AVG(CASE WHEN student_marks.assessment_type = \'practical\' THEN student_marks.marks END) as practical_average
            ');
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
