<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectStudentsFromAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->hasRole('student')) {
            return redirect()
                ->route('student.dashboard')
                ->with('error', 'You are not allowed to access staff and admin routes.');
        }

        return $next($request);
    }
}
