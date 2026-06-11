<?php

namespace App\Services\Export;

use FPDF;
use RuntimeException;

abstract class BasePdfExport
{
    protected FPDF $pdf;

    protected int $chunkSize = 100;

    protected int $rowCount = 0;

    protected string $orientation = 'L';

    protected string $pageSize = 'A4';

    public function __construct()
    {
    }

    public function render(array $filters = []): string
    {
        $this->rowCount = 0;
        $this->bootPdf();

        $this->pdf->AddPage();
        $this->addDocumentHeader();
        $this->addTableHeader();
        $this->addTableBody($filters);
        $this->addDocumentFooter();

        return $this->pdf->Output('S', $this->getFilename());
    }

    public function renderDelimited(array $filters = [], string $format = 'csv'): string
    {
        $separator = $format === 'excel' ? "\t" : ',';
        $handle = fopen('php://temp', 'w+b');

        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, $this->headings(), $separator);

        foreach ($this->rows($filters) as $row) {
            fputcsv($handle, array_map(fn ($value) => (string) $value, $row), $separator);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return $content === false ? '' : $content;
    }

    public function filename(): string
    {
        return $this->getFilename();
    }

    public function filenameFor(string $format): string
    {
        if ($format === 'excel') {
            return str_replace('.pdf', '.xls', $this->getFilename());
        }

        if ($format === 'csv') {
            return str_replace('.pdf', '.csv', $this->getFilename());
        }

        return $this->getFilename();
    }

    public function contentTypeFor(string $format): string
    {
        return match ($format) {
            'csv' => 'text/csv; charset=UTF-8',
            'excel' => 'application/vnd.ms-excel; charset=UTF-8',
            default => 'application/pdf',
        };
    }

    final public function stream(array $filters = []): void
    {
        echo $this->render($filters);
    }

    protected function bootPdf(): void
    {
        if (! class_exists(FPDF::class)) {
            $fpdfPath = base_path('vendor/setasign/fpdf/fpdf.php');

            if (file_exists($fpdfPath)) {
                require_once $fpdfPath;
            }
        }

        if (! class_exists(FPDF::class)) {
            throw new RuntimeException('The setasign/fpdf package is not installed. Run composer install to sync vendor with composer.lock.');
        }

        $this->pdf = new FPDF($this->orientation, 'mm', $this->pageSize);
        $this->pdf->SetMargins(10, 10, 10);
        $this->pdf->SetAutoPageBreak(true, 15);
    }

    protected function pageWidth(): float
    {
        return $this->orientation === 'P' ? 190 : 277;
    }

    protected function ensureTableSpace(float $rowHeight): void
    {
        if ($this->pdf->GetY() + $rowHeight <= $this->pageBreakY()) {
            return;
        }

        $this->pdf->AddPage();
        $this->addDocumentHeader();
        $this->addTableHeader();
    }

    protected function pdfText(?string $value): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return '';
        }

        return iconv('UTF-8', 'windows-1252//TRANSLIT//IGNORE', $value) ?: $value;
    }

    private function lineEnd(): float
    {
        return $this->orientation === 'P' ? 200 : 287;
    }

    private function pageBreakY(): float
    {
        return $this->orientation === 'P' ? 282 : 195;
    }

    private function addDocumentHeader(): void
    {
        $logoPath = public_path('images/school logo.png');
        $logoX = 10;
        $logoY = 8;
        $logoHeight = 20;
        $logoWidth = 0;

        if (file_exists($logoPath)) {
            $this->pdf->Image($logoPath, $logoX, $logoY, 0, $logoHeight, 'PNG');

            $logoSize = getimagesize($logoPath);
            if ($logoSize !== false && $logoSize[1] > 0) {
                $logoWidth = $logoHeight * ($logoSize[0] / $logoSize[1]);
            }
        }

        $textX = $logoWidth > 0 ? $logoX + $logoWidth + 8 : $logoX;
        $textWidth = max(70, $this->lineEnd() - $textX);
        $appName = $this->pdfText(config('app.name'));
        $appNameFontSize = 16;

        while ($appNameFontSize > 10) {
            $this->pdf->SetFont('Arial', 'B', $appNameFontSize);

            if ($this->pdf->GetStringWidth($appName) <= $textWidth) {
                break;
            }

            $appNameFontSize--;
        }

        $this->pdf->SetXY($textX, 10);
        $this->pdf->SetFont('Arial', 'B', $appNameFontSize);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->Cell($textWidth, 10, $appName, 0, 1, 'L');

        $this->pdf->SetX($textX);
        $this->pdf->SetFont('Arial', '', 9);
        $this->pdf->SetTextColor(100, 100, 100);
        $this->pdf->Cell($textWidth, 5, 'P.O Box 1234, Nairobi | Tel: +254 700 000 000 | info@school.ac.ke', 0, 1, 'L');

        $this->pdf->SetY(max(31, $logoY + $logoHeight + 3));

        $this->pdf->SetDrawColor(30, 64, 175);
        $this->pdf->SetLineWidth(0.5);
        $this->pdf->Line(10, $this->pdf->GetY() + 2, $this->lineEnd(), $this->pdf->GetY() + 2);
        $this->pdf->Ln(6);

        $generatedWidth = 70;
        $titleWidth = $this->pageWidth() - $generatedWidth;

        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->Cell($titleWidth, 8, $this->pdfText($this->getTitle()), 0, 0, 'L');

        $this->pdf->SetFont('Arial', 'I', 8);
        $this->pdf->SetTextColor(120, 120, 120);
        $this->pdf->Cell($generatedWidth, 8, 'Generated: '.now()->toDateTimeString(), 0, 1, 'R');

        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetDrawColor(235, 235, 235);
        $this->pdf->SetLineWidth(0.1);
        $this->pdf->Ln(3);
    }

    private function addDocumentFooter(): void
    {
        $this->pdf->Ln(4);

        $this->pdf->SetDrawColor(30, 64, 175);
        $this->pdf->SetLineWidth(0.3);
        $this->pdf->Line(10, $this->pdf->GetY(), $this->lineEnd(), $this->pdf->GetY());
        $this->pdf->Ln(3);

        $this->pdf->SetFont('Arial', 'I', 8);
        $this->pdf->SetTextColor(100, 100, 100);
        $this->pdf->Cell(0, 5, "Total Records: {$this->rowCount}", 0, 0, 'L');

        $this->pdf->Cell(0, 5, $this->pdfText('Confidential - '.config('app.name')), 0, 1, 'R');
    }

    protected function setHeaderStyle(): void
    {
        $this->pdf->SetFont('Arial', 'B', 9);
        $this->pdf->SetFillColor(229, 231, 235);
        $this->pdf->SetTextColor(78, 91, 124);
        $this->pdf->SetDrawColor(220, 226, 235);
        $this->pdf->SetLineWidth(0.1);
    }

    protected function resetBodyStyle(bool $alternate = false): void
    {
        $this->pdf->SetFont('Arial', '', 8);
        $this->pdf->SetTextColor(74, 91, 128);

        if ($alternate) {
            $this->pdf->SetFillColor(247, 247, 247);

            return;
        }

        $this->pdf->SetFillColor(255, 255, 255);
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

    protected function headings(): array
    {
        return [];
    }

    protected function rows(array $filters): iterable
    {
        return [];
    }
}
