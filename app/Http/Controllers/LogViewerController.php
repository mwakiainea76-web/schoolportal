<?php

namespace App\Http\Controllers;

use App\Services\LogReaderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogViewerController extends Controller
{
    public function index(Request $request, LogReaderService $reader): Response
    {
        $files = $reader->files();
        $file = $request->query('file') ?: ($files[0]['name'] ?? 'laravel.log');
        $lines = max(50, min((int) $request->query('lines', 250), 1000));
        $perPage = max(10, min((int) $request->query('per_page', 25), 100));

        return Inertia::render('Settings/LogViewer', [
            'files' => $files,
            'filters' => [
                'file' => $file,
                'level' => $request->query('level', ''),
                'search' => $request->query('search', ''),
                'lines' => (string) $lines,
                'per_page' => (string) $perPage,
            ],
            'log' => $reader->read(
                $file,
                $lines,
                $request->query('level') ?: null,
                $request->query('search') ?: null,
                (int) $request->query('page', 1),
                $perPage
            ),
        ]);
    }
}
