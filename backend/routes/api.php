<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
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
});
