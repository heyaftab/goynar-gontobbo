<?php

namespace App\Http\Middleware;

use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization') ?? '';

        if (! preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $plainToken = $matches[1];
        $hashedToken = hash('sha256', $plainToken);

        $tokenRecord = PersonalAccessToken::with('user')
            ->where('token', $hashedToken)
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->first();

        if (! $tokenRecord || ! $tokenRecord->user) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        $tokenRecord->forceFill(['last_used_at' => now()])->save();
        auth()->setUser($tokenRecord->user);
        $request->attributes->set('current_token', $tokenRecord);

        return $next($request);
    }
}
