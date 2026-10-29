<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token): string {
            $query = http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);

            return rtrim((string) config('app.frontend_url'), '/').'/reset-password?'.$query;
        });
    }
}
