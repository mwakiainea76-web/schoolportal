<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Export\Pdf\DepartmentPdfExport;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    private array $exports = [
        'departments' => DepartmentPdfExport::class,
    ];

    public function export(Request $request, string $resource)
    {
        abort_unless(isset($this->exports[$resource]), 404, 'Export not available for this resource.');

        $service = app($this->exports[$resource]);
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);

        // Capture PDF bytes
        ob_start();
        $service->stream($filters);
        $pdfContent = ob_get_clean();

        // Return as clean Laravel response — no middleware interference
        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.now()->format('Y_m_d').'_export.pdf"',
            'Content-Length' => strlen($pdfContent),
            'Cache-Control' => 'no-cache, no-store',
            'Pragma' => 'no-cache',
        ]);
    }
}
