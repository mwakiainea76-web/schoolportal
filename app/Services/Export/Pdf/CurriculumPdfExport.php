<?php

namespace App\Services\Export\Pdf;

use App\Models\Curriculum;
use App\Services\Export\BasePdfExport;

class CurriculumPdfExport extends BasePdfExport
{
    protected string $orientation = 'P';

    protected function getTitle(): string
    {
        return 'Curriculums Report';
    }

    protected function getFilename(): string
    {
        return 'curriculums_'.now()->format('Y_m_d').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->setHeaderStyle();

        $this->pdf->Cell(12, 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell(70, 9, 'Name', 'B', 0, 'L', true);
        $this->pdf->Cell(48, 9, 'Exam Body', 'B', 0, 'L', true);
        $this->pdf->Cell(25, 9, 'Status', 'B', 0, 'L', true);
        $this->pdf->Cell(35, 9, 'Created', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        $this->query($filters)
            ->chunk($this->chunkSize, function ($curriculums) {
                foreach ($curriculums as $curriculum) {
                    $this->ensureTableSpace(8);

                    $alt = $this->incrementRow();

                    $this->resetBodyStyle($alt);
                    $this->pdf->SetDrawColor(232, 238, 246);
                    $this->pdf->SetLineWidth(0.1);

                    $this->pdf->Cell(12, 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(70, 8, $this->pdfText($curriculum->name), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(48, 8, $this->pdfText($curriculum->examBody?->name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(25, 8, $curriculum->is_active ? 'Active' : 'Disabled', 'B', 0, 'L', $alt);
                    $this->pdf->Cell(35, 8, $curriculum->created_at->format('F j, Y'), 'B', 1, 'L', $alt);
                }
            });
    }

    protected function headings(): array
    {
        return ['S/N', 'Name', 'Exam Body', 'Status', 'Created'];
    }

    protected function rows(array $filters): iterable
    {
        $count = 0;

        foreach ($this->query($filters)->cursor() as $curriculum) {
            $count++;

            yield [
                $count,
                $curriculum->name,
                $curriculum->examBody?->name ?? 'N/A',
                $curriculum->is_active ? 'Active' : 'Disabled',
                $curriculum->created_at->format('F j, Y'),
            ];
        }
    }

    private function query(array $filters)
    {
        $sorts = [
            'id' => 'id',
            'name' => 'name',
            'start_date' => 'start_date',
            'end_date' => 'end_date',
            'created' => 'created_at',
            'created_at' => 'created_at',
        ];
        $sortColumn = $sorts[$filters['sort'] ?? 'created_at'] ?? 'created_at';
        $requestedDirection = $filters['direction'] ?? 'desc';
        $direction = in_array($requestedDirection, ['asc', 'desc'], true)
            ? $requestedDirection
            : 'desc';

        return Curriculum::query()
            ->with('examBody:id,code,name')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('examBody', function ($examBodyQuery) use ($search) {
                            $examBodyQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($sortColumn, $direction);
    }
}
