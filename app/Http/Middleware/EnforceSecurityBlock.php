<?php

namespace App\Http\Middleware;

use App\Services\SecurityMonitoringService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceSecurityBlock
{
    public function __construct(
        protected SecurityMonitoringService $securityMonitoring,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $block = $this->securityMonitoring->findMatchingActiveBlock(
            $request,
            $user,
            $user->login_id,
            $user->email,
        );

        if (! $block) {
            return $next($request);
        }

        $this->securityMonitoring->recordEvent(
            'access.blocked',
            $request,
            $user,
            'critical',
            [
                'block_id' => $block->id,
                'reason' => $block->reason,
            ],
            $user->login_id,
            $user->email,
        );

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()
            ->route('login')
            ->with('status', 'Access to this account or device has been temporarily blocked. Please contact an administrator.');
    }
}
