<?php

namespace App\Http\Controllers;

use App\Models\CorsAllowedOrigin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CorsAllowedOriginController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/CorsOrigins', [
            'origins' => CorsAllowedOrigin::query()
                ->latest()
                ->get(['id', 'origin', 'label', 'is_active', 'created_at']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'origin' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $origin = $this->validatedOrigin($validated['origin']);

        CorsAllowedOrigin::create([
            'origin' => $origin,
            'label' => $validated['label'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'created_by_user_id' => $request->user()?->id,
        ]);

        $this->clearCorsCache();

        return back()->with('success', 'API origin added successfully.');
    }

    public function update(Request $request, CorsAllowedOrigin $corsAllowedOrigin)
    {
        $validated = $request->validate([
            'origin' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $corsAllowedOrigin->update([
            'origin' => $this->validatedOrigin($validated['origin'], $corsAllowedOrigin->id),
            'label' => $validated['label'] ?? null,
            'is_active' => $request->boolean('is_active'),
        ]);

        $this->clearCorsCache();

        return back()->with('success', 'API origin updated successfully.');
    }

    public function destroy(CorsAllowedOrigin $corsAllowedOrigin)
    {
        $corsAllowedOrigin->delete();
        $this->clearCorsCache();

        return back()->with('success', 'API origin removed successfully.');
    }

    private function validatedOrigin(string $value, ?int $ignoreId = null): string
    {
        $origin = CorsAllowedOrigin::normalizeOrigin($value);

        if (! $origin) {
            throw ValidationException::withMessages([
                'origin' => 'Enter a valid HTTP or HTTPS origin, for example https://app.example.com.',
            ]);
        }

        $exists = CorsAllowedOrigin::query()
            ->where('origin', $origin)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'origin' => 'This API origin is already allowed.',
            ]);
        }

        return $origin;
    }

    private function clearCorsCache(): void
    {
        Cache::forget('cors_allowed_origins.active');
    }
}
