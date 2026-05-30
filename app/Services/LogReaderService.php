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

    public function read(
        string $fileName,
        int $lines = 250,
        ?string $level = null,
        ?string $search = null,
        int $page = 1,
        int $perPage = 25
    ): array
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

        $entries = $entries->reverse()->values();
        $total = $entries->count();
        $perPage = max(10, min($perPage, 100));
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = max(1, min($page, $lastPage));
        $pageEntries = $entries->forPage($page, $perPage)->values();

        return [
            'file' => $fileName,
            'exists' => (bool) $path,
            'size_bytes' => $path ? File::size($path) : 0,
            'updated_at' => $path ? date('Y-m-d H:i:s', File::lastModified($path)) : null,
            'entries' => [
                'data' => $pageEntries->all(),
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
                'from' => $total ? (($page - 1) * $perPage) + 1 : 0,
                'to' => $total ? (($page - 1) * $perPage) + $pageEntries->count() : 0,
            ],
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
            $jsonEntry = $this->parseJsonEntry($line);

            if ($jsonEntry !== null) {
                if ($current) {
                    $entries->push($this->normalizeEntryLevel($current));
                    $current = null;
                }

                $entries->push($this->normalizeEntryLevel($jsonEntry));

                continue;
            }

            if (preg_match('/^\[(?<date>[^\]]+)\]\s+(?<env>[^.]+)\.(?<level>[A-Z]+):\s+(?<message>.*)$/', $line, $matches)) {
                if ($current) {
                    $entries->push($this->normalizeEntryLevel($current));
                }

                $current = [
                    'timestamp' => $matches['date'],
                    'environment' => $matches['env'],
                    'message' => $matches['message'],
                    'raw' => $line,
                ];
                $current['original_level'] = strtolower($matches['level']);
                $current['level'] = $current['original_level'];

                continue;
            }

            if ($current) {
                $current['raw'] .= "\n" . $line;
            }
        }

        if ($current) {
            $entries->push($this->normalizeEntryLevel($current));
        }

        return $entries;
    }

    private function parseJsonEntry(string $line): ?array
    {
        $trimmed = trim($line);

        if ($trimmed === '' || ! str_starts_with($trimmed, '{')) {
            return null;
        }

        $decoded = json_decode($trimmed, true);

        if (! is_array($decoded)) {
            return null;
        }

        $context = is_array($decoded['context'] ?? null) ? $decoded['context'] : [];
        $level = strtolower((string) ($context['level'] ?? $decoded['level_name'] ?? 'info'));
        $message = (string) ($context['message'] ?? $decoded['message'] ?? 'Log entry');
        $timestamp = (string) ($context['timestamp'] ?? $decoded['datetime'] ?? '');
        $environment = (string) ($decoded['channel'] ?? $context['environment'] ?? 'log');

        return [
            'timestamp' => $timestamp,
            'environment' => $environment,
            'message' => $message,
            'raw' => $trimmed,
            'original_level' => $level,
            'level' => $level,
        ];
    }

    private function normalizeEntryLevel(array $entry): array
    {
        if ($this->containsErrorCode($entry['raw'] ?? '')) {
            $entry['level'] = 'error';
            $entry['level_reason'] = 'error_code_detected';
        }

        return $entry;
    }

    private function containsErrorCode(string $raw): bool
    {
        return (bool) preg_match(
            '/\b(error[_\s-]?code|erro[_\s-]?code|err[_\s-]?code|status[_\s-]?code|http[_\s-]?status|response[_\s-]?code)\b\s*[:=]\s*"?([45]\d{2}|[A-Z0-9_-]*ERR[A-Z0-9_-]*)"?/i',
            $raw
        );
    }
}
