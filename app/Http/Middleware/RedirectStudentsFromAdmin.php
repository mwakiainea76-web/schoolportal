<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectStudentsFromAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($this->isStudent($user)) {
            abort(403, 'You are not allowed to access staff and admin routes.');
        }

        return $next($request);
    }

    private function isStudent(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        $user->loadMissing('roles:id,name');

        return $user->roles->pluck('name')->contains('student');
    }
}
