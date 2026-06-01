<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DatabaseCors
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->is('api/*')) {
            return $next($request);
        }

        $origin = $this->normalizeOrigin((string) $request->headers->get('Origin', ''));

        if (! $origin) {
            return $next($request);
        }

        if (! $this->isAllowed($request, $origin)) {
            return response('', 403);
        }

        if ($request->isMethod('OPTIONS')) {
            return $this->withCorsHeaders(response('', 204), $request, $origin);
        }

        return $this->withCorsHeaders($next($request), $request, $origin);
    }

    private function isAllowed(Request $request, string $origin): bool
    {
        return in_array($origin, $this->allowedOrigins($request), true);
    }

    private function allowedOrigins(Request $request): array
    {
        $configKey = $request->is('api/public/*')
            ? 'cors.public_allowed_origins'
            : 'cors.allowed_origins';

        $allowedOrigins = config($configKey, []);

        if (is_string($allowedOrigins)) {
            $allowedOrigins = explode(',', $allowedOrigins);
        }

        $allowedOrigins = array_filter(array_map('trim', (array) $allowedOrigins));

        $normalizedOrigins = array_filter(array_map(
            fn (string $value): ?string => $this->normalizeOrigin($value),
            $allowedOrigins
        ));

        return array_values(array_unique($normalizedOrigins));
    }

    private function normalizeOrigin(string $value): ?string
    {
        $value = trim($value);

        if ($value === '') {
            return null;
        }

        $parts = parse_url($value);

        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        $scheme = strtolower($parts['scheme']);

        if (! in_array($scheme, ['http', 'https'], true)) {
            return null;
        }

        $origin = $scheme . '://' . strtolower($parts['host']);

        if (! empty($parts['port'])) {
            $origin .= ':' . $parts['port'];
        }

        return $origin;
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
