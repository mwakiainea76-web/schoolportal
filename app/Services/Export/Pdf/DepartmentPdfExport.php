<?php

namespace App\Services\Export\Pdf;

use App\Models\Department;
use App\Services\Export\BasePdfExport;

class DepartmentPdfExport extends BasePdfExport
{
    protected string $orientation = 'P';

    protected function getTitle(): string
    {
        return 'Departments Report';
    }

    protected function getFilename(): string
    {
        return 'departments_'.now()->format('Y_m_d').'.pdf';
    }

    protected function addTableHeader(): void
    {
        $this->setHeaderStyle();

        $this->pdf->Cell(12, 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell(22, 9, 'Code', 'B', 0, 'L', true);
        $this->pdf->Cell(70, 9, 'Name', 'B', 0, 'L', true);
        $this->pdf->Cell(56, 9, 'HOD', 'B', 0, 'L', true);
        $this->pdf->Cell(30, 9, 'Created', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        $this->query($filters)
            ->chunk($this->chunkSize, function ($departments) {
                foreach ($departments as $department) {
                    $this->ensureTableSpace(8);

                    $alt = $this->incrementRow();

                    $this->resetBodyStyle($alt);
                    $this->pdf->SetDrawColor(232, 238, 246);
                    $this->pdf->SetLineWidth(0.1);

                    $this->pdf->Cell(12, 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(22, 8, $this->pdfText($department->code), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(70, 8, $this->pdfText($department->name), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(56, 8, $this->pdfText($department->hod?->full_name ?? 'N/A'), 'B', 0, 'L', $alt);
                    $this->pdf->Cell(30, 8, $department->created_at->format('F j, Y'), 'B', 1, 'L', $alt);
                }
            });
    }

    protected function headings(): array
    {
        return ['S/N', 'Code', 'Name', 'HOD', 'Created'];
    }

    protected function rows(array $filters): iterable
    {
        $count = 0;

        foreach ($this->query($filters)->cursor() as $department) {
            $count++;

            yield [
                $count,
                $department->code,
                $department->name,
                $department->hod?->full_name ?? 'N/A',
                $department->created_at->format('F j, Y'),
            ];
        }
    }

    private function query(array $filters)
    {
        $sorts = [
            'id' => 'id',
            'code' => 'code',
            'name' => 'name',
            'created' => 'created_at',
            'created_at' => 'created_at',
        ];
        $sortColumn = $sorts[$filters['sort'] ?? 'created_at'] ?? 'created_at';
        $direction = in_array($filters['direction'] ?? 'desc', ['asc', 'desc'], true)
            ? $filters['direction']
            : 'desc';

        return Department::query()
            ->with('hod')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortColumn, $direction);
    }
}
