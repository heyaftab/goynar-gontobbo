<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'sku', 'description', 'category_id', 'material_id', 'purity_id',
        'weight_grams', 'making_charge', 'price', 'compare_at_price', 'stock_quantity', 'is_active', 'is_featured', 'is_new_arrival', 'is_best_seller',
    ];

    protected function casts(): array
    {
        return [
            'weight_grams' => 'decimal:3', 'making_charge' => 'decimal:2', 'price' => 'decimal:2', 'compare_at_price' => 'decimal:2',
            'stock_quantity' => 'integer', 'is_active' => 'boolean', 'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean', 'is_best_seller' => 'boolean',
        ];
    }

    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function material(): BelongsTo { return $this->belongsTo(Material::class); }
    public function purity(): BelongsTo { return $this->belongsTo(Purity::class); }
    public function images(): HasMany { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function variants(): HasMany { return $this->hasMany(ProductVariant::class); }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->whereHas('category', fn (Builder $category) => $category->where('is_active', true));
    }
}
