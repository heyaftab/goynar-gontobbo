<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    // Public Catalog
    Route::get('/categories', function () {
        return Category::query()
            ->active()
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    });

    Route::get('/products', function (Request $request) {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'new_arrivals' => ['nullable', 'boolean'],
            'best_sellers' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        return Product::query()
            ->active()
            ->with(['category:id,name,slug', 'material:id,name,slug', 'purity:id,name,slug,percentage', 'images', 'variants' => fn ($query) => $query->where('is_active', true)])
            ->when($filters['category'] ?? null, fn ($query, $slug) => $query->whereHas('category', fn ($category) => $category->where('slug', $slug)))
            ->when($filters['new_arrivals'] ?? false, fn ($query) => $query->where('is_new_arrival', true))
            ->when($filters['best_sellers'] ?? false, fn ($query) => $query->where('is_best_seller', true))
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(fn ($products) => $products->where('name', 'like', "%{$term}%")->orWhere('description', 'like', "%{$term}%")))
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 24);
    });

    Route::get('/products/{slug}', function (string $slug) {
        return Product::query()
            ->active()
            ->with(['category:id,name,slug', 'material:id,name,slug', 'purity:id,name,slug,percentage', 'images', 'variants' => fn ($query) => $query->where('is_active', true)])
            ->where('slug', $slug)
            ->firstOrFail();
    });

    // Authentication Routes
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', function (Request $request) {
            $data = $request->validate([
                'name' => ['required', 'string', 'min:2', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:6'],
                'phone' => ['nullable', 'string', 'max:30'],
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'role' => 'customer',
            ]);

            $token = $user->createToken();

            return response()->json([
                'user' => $user->toAuthPayload(),
                'token' => $token,
                'message' => 'Account created successfully.',
            ], 201);
        });

        Route::post('/login', function (Request $request) {
            $data = $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);

            $user = User::where('email', strtolower($data['email']))->first();

            if (! $user || ! $user->password || ! Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid email address or password.',
                ], 401);
            }

            $token = $user->createToken();

            return response()->json([
                'user' => $user->toAuthPayload(),
                'token' => $token,
                'message' => 'Signed in successfully.',
            ]);
        });

        Route::post('/forgot-password', function (Request $request) {
            $data = $request->validate([
                'email' => ['required', 'email', 'max:255'],
            ]);

            if (app()->isProduction() && in_array(config('mail.default'), ['log', 'array'], true)) {
                return response()->json([
                    'message' => 'Password recovery is temporarily unavailable. Please try again later.',
                ], 503);
            }

            try {
                Password::sendResetLink(['email' => strtolower($data['email'])]);
            } catch (\Throwable $exception) {
                // Keep email delivery failures from revealing whether the address exists.
                Log::error('Password reset email delivery failed.', ['exception' => $exception::class]);
            }

            // Keep the response identical for known and unknown addresses.
            return response()->json([
                'message' => 'If an account exists for that email, password reset instructions will be sent.',
            ]);
        })->middleware('throttle:5,1');

        Route::post('/reset-password', function (Request $request) {
            $data = $request->validate([
                'email' => ['required', 'email', 'max:255'],
                'token' => ['required', 'string'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $status = Password::reset(
                [
                    'email' => strtolower($data['email']),
                    'token' => $data['token'],
                    'password' => $data['password'],
                    'password_confirmation' => $request->input('password_confirmation'),
                ],
                function (User $user, string $password): void {
                    $user->forceFill(['password' => Hash::make($password)])->save();
                    $user->tokens()->delete();
                    Event::dispatch(new PasswordReset($user));
                },
            );

            if ($status !== Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'This reset link is invalid or expired. Request a new one and try again.',
                ], 422);
            }

            return response()->json(['message' => 'Password reset successfully. You can now sign in.']);
        })->middleware('throttle:5,1');

        Route::post('/google', function (Request $request) {
            $data = $request->validate([
                'email' => ['required', 'string', 'email'],
                'name' => ['required', 'string', 'max:255'],
                'google_id' => ['nullable', 'string', 'max:255'],
                'avatar' => ['nullable', 'string', 'max:500'],
            ]);

            $email = strtolower($data['email']);
            $user = User::where('email', $email)->first();

            if (! $user) {
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $email,
                    'google_id' => $data['google_id'] ?? null,
                    'avatar' => $data['avatar'] ?? null,
                    'role' => 'customer',
                ]);
            } else {
                $updates = [];
                if (! $user->google_id && ! empty($data['google_id'])) {
                    $updates['google_id'] = $data['google_id'];
                }
                if (! $user->avatar && ! empty($data['avatar'])) {
                    $updates['avatar'] = $data['avatar'];
                }
                if ($updates) {
                    $user->update($updates);
                }
            }

            $token = $user->createToken();

            return response()->json([
                'user' => $user->toAuthPayload(),
                'token' => $token,
                'message' => 'Signed in with Google successfully.',
            ]);
        });

        // Protected account routes
        Route::middleware('auth.token')->group(function (): void {
            Route::get('/me', function (Request $request) {
                return response()->json([
                    'user' => $request->user()->toAuthPayload(),
                ]);
            });

            Route::put('/profile', function (Request $request) {
                $data = $request->validate([
                    'name' => ['nullable', 'string', 'min:2', 'max:255'],
                    'phone' => ['nullable', 'string', 'max:30'],
                    'address' => ['nullable', 'string', 'max:1000'],
                ]);

                $user = $request->user();
                $user->update(array_filter($data, fn ($val) => ! is_null($val)));

                return response()->json([
                    'user' => $user->fresh()->toAuthPayload(),
                    'message' => 'Profile updated successfully.',
                ]);
            });

            Route::put('/password', function (Request $request) {
                $data = $request->validate([
                    'current_password' => ['required', 'string'],
                    'password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
                ]);

                $user = $request->user();
                if (! $user->password || ! Hash::check($data['current_password'], $user->password)) {
                    return response()->json([
                        'message' => 'The current password is incorrect.',
                        'errors' => ['current_password' => ['The current password is incorrect.']],
                    ], 422);
                }

                $user->forceFill(['password' => Hash::make($data['password'])])->save();

                $currentToken = $request->attributes->get('current_token');
                if ($currentToken) {
                    $user->tokens()->where('id', '<>', $currentToken->id)->delete();
                }

                return response()->json(['message' => 'Password changed successfully.']);
            })->middleware('throttle:5,1');

            Route::post('/logout', function (Request $request) {
                $currentToken = $request->attributes->get('current_token');
                if ($currentToken) {
                    $currentToken->delete();
                }

                return response()->json([
                    'message' => 'Signed out successfully.',
                ]);
            });
        });
    });
});
