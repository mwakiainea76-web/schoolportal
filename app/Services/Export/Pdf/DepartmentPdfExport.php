<?php

namespace App\Services\Export\Pdf;

use App\Models\Department;
use App\Services\Export\BasePdfExport;

class DepartmentPdfExport extends BasePdfExport
{
    protected string $orientation = 'P';

    public function __construct()
    {
        parent::__construct();
    }

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
        $this->pdf->SetFont('Arial', 'B', 9);
        $this->pdf->SetFillColor(245, 245, 245);
        $this->pdf->SetTextColor(80, 80, 80);
        $this->pdf->SetDrawColor(220, 220, 220);
        $this->pdf->SetLineWidth(0.1);

        // Total = 12 + 22 + 70 + 56 + 30 = 190mm ✅
        $this->pdf->Cell(12, 9, 'S/N', 'B', 0, 'C', true);
        $this->pdf->Cell(22, 9, 'Code', 'B', 0, 'L', true);
        $this->pdf->Cell(70, 9, 'Name', 'B', 0, 'L', true);
        $this->pdf->Cell(56, 9, 'HOD', 'B', 0, 'L', true);
        $this->pdf->Cell(30, 9, 'Created', 'B', 1, 'L', true);
    }

    protected function addTableBody(array $filters): void
    {
        Department::query()
            ->with('hod')
            ->when($filters['search'] ?? null, function ($q, $v) {
                $q->where('name', 'like', "%$v%")
                    ->orWhere('code', 'like', "%$v%");
            })
            ->orderBy('name')
            ->chunk($this->chunkSize, function ($departments) {
                foreach ($departments as $department) {
                    $alt = $this->incrementRow();

                    $this->pdf->SetFillColor($alt ? 249 : 255, $alt ? 249 : 255, $alt ? 249 : 255);
                    $this->pdf->SetTextColor(30, 30, 30);
                    $this->pdf->SetFont('Arial', '', 9);
                    $this->pdf->SetDrawColor(235, 235, 235);
                    $this->pdf->SetLineWidth(0.1);

                    // Total = 12 + 22 + 70 + 56 + 30 = 190mm ✅
                    $this->pdf->Cell(12, 8, $this->rowCount, 'B', 0, 'C', $alt);
                    $this->pdf->Cell(22, 8, $department->code, 'B', 0, 'L', $alt);
                    $this->pdf->Cell(70, 8, $department->name, 'B', 0, 'L', $alt);
                    $this->pdf->Cell(56, 8, $department->hod->name ?? 'N/A', 'B', 0, 'L', $alt);
                    $this->pdf->Cell(30, 8, $department->created_at->toDateString(), 'B', 1, 'L', $alt);
                }
                flush();
            });
    }
}
