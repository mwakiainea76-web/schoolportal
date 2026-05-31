<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class OnlineUsersController extends Controller
{
    public function index(): JsonResponse
    {
        if (Config::get('session.driver') !== 'database') {
            return response()->json([
                'count' => 0,
                'queried_at' => now()->utc()->toJSON(),
            ]);
        }

        $count = DB::table('sessions')
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', now()->subMinutes(5)->timestamp)
            ->distinct('user_id')
            ->count('user_id');

        return response()->json([
            'count' => $count,
            'queried_at' => now()->utc()->toJSON(),
        ]);
    }
}
