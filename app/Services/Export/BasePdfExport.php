<?php

namespace App\Services\Export;

use FPDF;

abstract class BasePdfExport
{
    protected FPDF $pdf;

    protected int $chunkSize = 100;

    protected int $rowCount = 0;

    protected string $orientation = 'L'; // L = Landscape, P = Portrait — override in child

    protected string $pageSize = 'A4';

    public function __construct()
    {
        $this->pdf = new FPDF($this->orientation, 'mm', $this->pageSize);
        $this->pdf->SetMargins(10, 10, 10);
        $this->pdf->SetAutoPageBreak(true, 15);
    }

    final public function stream(array $filters): void
    {
        $this->pdf->AddPage();
        $this->addDocumentHeader();
        $this->addTableHeader();
        $this->addTableBody($filters);
        $this->addDocumentFooter();

        $pdfContent = $this->pdf->Output('S', $this->getFilename());
        echo $pdfContent;
    }

    // ── Usable width helper — use this in child classes for column sizing ──
    protected function pageWidth(): float
    {
        return $this->orientation === 'P' ? 190 : 277;
    }

    // ── Line end helper — adapts divider lines to orientation ─────────────
    private function lineEnd(): float
    {
        return $this->orientation === 'P' ? 200 : 287;
    }

    private function addDocumentHeader(): void
    {
        $logoPath = public_path('images/school logo.png');

        // ── Logo (left side) ──────────────────────────────────────────────
        if (file_exists($logoPath)) {
            $this->pdf->Image($logoPath, 10, 8, 25, 20, 'PNG');
        }

        // ── School name (center) ──────────────────────────────────────────
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->SetTextColor(30, 64, 175);
        $this->pdf->Cell(0, 10, config('app.name'), 0, 1, 'C');

        // ── Address line (center) ─────────────────────────────────────────
        $this->pdf->SetFont('Arial', '', 9);
        $this->pdf->SetTextColor(100, 100, 100);
        $this->pdf->Cell(0, 5, 'P.O Box 1234, Nairobi | Tel: +254 700 000 000 | info@school.ac.ke', 0, 1, 'C');

        // ── Divider line (blue) — adapts to orientation ───────────────────
        $this->pdf->SetDrawColor(30, 64, 175);
        $this->pdf->SetLineWidth(0.5);
        $this->pdf->Line(10, $this->pdf->GetY() + 2, $this->lineEnd(), $this->pdf->GetY() + 2);
        $this->pdf->Ln(6);

        // ── Report title ──────────────────────────────────────────────────
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->Cell(0, 8, $this->getTitle(), 0, 1, 'C');

        // ── Generated timestamp (right aligned) ───────────────────────────
        $this->pdf->SetFont('Arial', 'I', 8);
        $this->pdf->SetTextColor(120, 120, 120);
        $this->pdf->Cell(0, 5, 'Generated: '.now()->toDateTimeString(), 0, 1, 'R');

        // ── Reset colors so table borders don't inherit blue ──────────────
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetDrawColor(235, 235, 235);
        $this->pdf->SetLineWidth(0.1);
        $this->pdf->Ln(3);
    }

    private function addDocumentFooter(): void
    {
        $this->pdf->Ln(4);

        // ── Divider line — adapts to orientation ──────────────────────────
        $this->pdf->SetDrawColor(30, 64, 175);
        $this->pdf->SetLineWidth(0.3);
        $this->pdf->Line(10, $this->pdf->GetY(), $this->lineEnd(), $this->pdf->GetY());
        $this->pdf->Ln(3);

        // ── Left: total records ───────────────────────────────────────────
        $this->pdf->SetFont('Arial', 'I', 8);
        $this->pdf->SetTextColor(100, 100, 100);
        $this->pdf->Cell(0, 5, "Total Records: {$this->rowCount}", 0, 0, 'L');

        // ── Right: confidential ───────────────────────────────────────────
        $this->pdf->Cell(0, 5, 'Confidential — '.config('app.name'), 0, 1, 'R');
    }

    protected function setHeaderStyle(): void
    {
        $this->pdf->SetFont('Arial', 'B', 9);
        $this->pdf->SetFillColor(30, 64, 175);
        $this->pdf->SetTextColor(255, 255, 255);
    }

    protected function resetBodyStyle(bool $alternate = false): void
    {
        $this->pdf->SetFont('Arial', '', 8);
        $this->pdf->SetTextColor(0, 0, 0);
        $fill = $alternate ? 240 : 255;
        $this->pdf->SetFillColor($fill, $fill, $fill);
    }

    protected function incrementRow(): bool
    {
        $this->rowCount++;

        return $this->rowCount % 2 === 0;
    }

    abstract protected function getTitle(): string;

    abstract protected function getFilename(): string;

    abstract protected function addTableHeader(): void;

    abstract protected function addTableBody(array $filters): void;
}
