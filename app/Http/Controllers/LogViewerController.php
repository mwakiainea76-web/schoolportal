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

        return Inertia::render('Settings/LogViewer', [
            'files' => $files,
            'filters' => [
                'file' => $file,
                'level' => $request->query('level', ''),
                'search' => $request->query('search', ''),
                'lines' => (string) max(50, min((int) $request->query('lines', 250), 1000)),
            ],
            'log' => $reader->read(
                $file,
                (int) $request->query('lines', 250),
                $request->query('level') ?: null,
                $request->query('search') ?: null
            ),
        ]);
    }
}
