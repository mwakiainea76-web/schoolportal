<?php

namespace App\Http\Middleware;

use App\Models\CorsAllowedOrigin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class DatabaseCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = CorsAllowedOrigin::normalizeOrigin((string) $request->headers->get('Origin', ''));

        if (! $origin) {
            return $next($request);
        }

        if (! $this->isAllowed($origin)) {
            return $request->isMethod('OPTIONS')
                ? response('', 403)
                : $next($request);
        }

        if ($request->isMethod('OPTIONS')) {
            return $this->withCorsHeaders(response('', 204), $request, $origin);
        }

        return $this->withCorsHeaders($next($request), $request, $origin);
    }

    private function isAllowed(string $origin): bool
    {
        $allowedOrigins = Cache::remember('cors_allowed_origins.active', 300, fn () =>
            CorsAllowedOrigin::query()
                ->where('is_active', true)
                ->pluck('origin')
                ->all()
        );

        return in_array($origin, $allowedOrigins, true);
    }

    private function withCorsHeaders(Response $response, Request $request, string $origin): Response
    {
        $requestHeaders = $request->headers->get('Access-Control-Request-Headers');

        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', $requestHeaders ?: 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN, Accept, Origin');
        $response->headers->set('Access-Control-Max-Age', '600');
        $response->headers->set('Vary', 'Origin', false);

        return $response;
    }
}
