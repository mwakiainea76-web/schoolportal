<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserMonitorController extends Controller
{
    public function index(Request $request): Response
    {
        $roleFilter = trim((string) $request->query('role', ''));
        $perPage = 15;
        $queriedAt = now()->utc();
        $cutoff = $queriedAt->copy()->subMinutes(5)->timestamp;
        $usingDatabaseSessions = Config::get('session.driver') === 'database';

        $users = $usingDatabaseSessions
            ? $this->onlineUsersPaginator($roleFilter, $cutoff, $perPage)
            : $this->emptyPaginator($request, $perPage);

        return Inertia::render('Settings/UserMonitor', [
            'filters' => [
                'role' => $roleFilter,
            ],
            'summary' => [
                'online_users' => $usingDatabaseSessions
                    ? DB::table('sessions')
                        ->whereNotNull('user_id')
                        ->where('last_activity', '>=', $cutoff)
                        ->distinct('user_id')
                        ->count('user_id')
                    : 0,
                'queried_at' => $queriedAt->toJSON(),
                'using_database_sessions' => $usingDatabaseSessions,
            ],
            'roles' => Role::query()
                ->orderBy('name')
                ->pluck('name')
                ->values()
                ->all(),
            'users' => $users,
        ]);
    }

    private function onlineUsersPaginator(string $roleFilter, int $cutoff, int $perPage): LengthAwarePaginator
    {
        $onlineSessions = DB::table('sessions')
            ->select('user_id', DB::raw('MAX(last_activity) as last_activity'))
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', $cutoff)
            ->groupBy('user_id');

        return User::query()
            ->joinSub($onlineSessions, 'online_sessions', function ($join) {
                $join->on('users.id', '=', 'online_sessions.user_id');
            })
            ->select('users.*', 'online_sessions.last_activity')
            ->with(['roles:id,name', 'staff', 'student'])
            ->when($roleFilter !== '', function ($query) use ($roleFilter) {
                $query->whereHas('roles', function ($roleQuery) use ($roleFilter) {
                    $roleQuery->where('name', $roleFilter);
                });
            })
            ->orderByDesc('online_sessions.last_activity')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'login_id' => $user->login_id,
                    'roles' => $user->roles
                        ->pluck('name')
                        ->filter()
                        ->values()
                        ->all(),
                    'last_activity' => isset($user->last_activity)
                        ? now()->setTimestamp((int) $user->last_activity)->toDateTimeString()
                        : null,
                ];
            });
    }

    private function emptyPaginator(Request $request, int $perPage): LengthAwarePaginator
    {
        return new LengthAwarePaginator(
            [],
            0,
            $perPage,
            $request->integer('page', 1),
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );
    }
}
