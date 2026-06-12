<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Str;

class AdmissionNumberService
{
    public function generateForCourse(int $courseId, ?int $year = null): string
    {
        $year ??= (int) now()->format('Y');

        $course = Course::query()
            ->whereKey($courseId)
            ->lockForUpdate()
            ->firstOrFail();

        $initials = $this->courseInitials($course);
        $next = CourseEnrollment::withTrashed()
            ->where('course_id', $course->id)
            ->where('intake_year', $year)
            ->count() + 1;

        do {
            $candidate = $this->format($initials, $next, $year);
            $next++;
        } while ($this->admissionNumberExists($candidate));

        return $candidate;
    }

    protected function format(string $initials, int $sequence, int $year): string
    {
        return sprintf(
            '%s/%s/%s',
            $initials,
            str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            substr((string) $year, -2)
        );
    }

    protected function admissionNumberExists(string $candidate): bool
    {
        return Student::withTrashed()
            ->where('admission_number', $candidate)
            ->exists()
            || User::query()->where('login_id', $candidate)->exists();
    }

    protected function courseInitials(Course $course): string
    {
        $storedInitials = $this->normalizeInitials($course->initials);

        if ($storedInitials !== '') {
            return $storedInitials;
        }

        $words = collect(preg_split('/[^A-Za-z0-9]+/', (string) $course->name, -1, PREG_SPLIT_NO_EMPTY))
            ->map(fn (string $word) => Str::lower($word))
            ->reject(fn (string $word) => in_array($word, ['a', 'an', 'and', 'for', 'in', 'of', 'the', 'to'], true))
            ->values();

        if ($words->count() >= 2) {
            return $this->normalizeInitials(
                $words->map(fn (string $word) => Str::substr($word, 0, 1))->implode('')
            );
        }

        return $this->normalizeInitials(Str::substr((string) $course->name, 0, 2)) ?: 'CRS';
    }

    protected function normalizeInitials(?string $value): string
    {
        return Str::upper(preg_replace('/[^A-Za-z0-9]/', '', (string) $value) ?? '');
    }
}
