<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class LogReaderService
{
    public function files(): array
    {
        return collect(File::glob(storage_path('logs/*.log*')) ?: [])
            ->map(fn (string $path) => [
                'name' => basename($path),
                'size_bytes' => File::size($path),
                'updated_at' => date('Y-m-d H:i:s', File::lastModified($path)),
            ])
            ->sortByDesc('updated_at')
            ->values()
            ->all();
    }

    public function read(string $fileName, int $lines = 250, ?string $level = null, ?string $search = null): array
    {
        $path = $this->resolvePath($fileName);
        $content = $path ? $this->tail($path, max(50, min($lines, 1000))) : '';
        $entries = $this->parseEntries($content);

        if ($level) {
            $entries = $entries->filter(fn (array $entry) =>
                strtolower($entry['level'] ?? '') === strtolower($level)
            );
        }

        if ($search) {
            $needle = Str::lower($search);
            $entries = $entries->filter(fn (array $entry) =>
                Str::contains(Str::lower($entry['raw']), $needle)
            );
        }

        return [
            'file' => $fileName,
            'exists' => (bool) $path,
            'size_bytes' => $path ? File::size($path) : 0,
            'updated_at' => $path ? date('Y-m-d H:i:s', File::lastModified($path)) : null,
            'entries' => $entries->take(-$lines)->values()->all(),
        ];
    }

    private function resolvePath(string $fileName): ?string
    {
        $safeName = basename($fileName ?: 'laravel.log');
        $path = storage_path('logs/' . $safeName);
        $realPath = realpath($path);
        $logsPath = realpath(storage_path('logs'));

        if (! $realPath || ! $logsPath || ! str_starts_with($realPath, $logsPath)) {
            return null;
        }

        return is_file($realPath) ? $realPath : null;
    }

    private function tail(string $path, int $lines): string
    {
        $handle = fopen($path, 'rb');

        if (! $handle) {
            return '';
        }

        $buffer = '';
        $chunkSize = 8192;
        $position = -1;
        $lineCount = 0;

        fseek($handle, 0, SEEK_END);
        $fileSize = ftell($handle);

        while ($fileSize + $position > 0 && $lineCount <= $lines) {
            $readSize = min($chunkSize, $fileSize + $position + 1);
            $position -= $readSize;
            fseek($handle, $position, SEEK_END);
            $chunk = fread($handle, $readSize);
            $buffer = $chunk . $buffer;
            $lineCount = substr_count($buffer, "\n");
        }

        fclose($handle);

        return collect(explode("\n", $buffer))
            ->take(-$lines)
            ->implode("\n");
    }

    private function parseEntries(string $content): Collection
    {
        $entries = collect();
        $current = null;

        foreach (preg_split('/\R/', $content) ?: [] as $line) {
            if (preg_match('/^\[(?<date>[^\]]+)\]\s+(?<env>[^.]+)\.(?<level>[A-Z]+):\s+(?<message>.*)$/', $line, $matches)) {
                if ($current) {
                    $entries->push($current);
                }

                $current = [
                    'timestamp' => $matches['date'],
                    'environment' => $matches['env'],
                    'level' => strtolower($matches['level']),
                    'message' => $matches['message'],
                    'raw' => $line,
                ];

                continue;
            }

            if ($current) {
                $current['raw'] .= "\n" . $line;
            }
        }

        if ($current) {
            $entries->push($current);
        }

        return $entries;
    }
}
