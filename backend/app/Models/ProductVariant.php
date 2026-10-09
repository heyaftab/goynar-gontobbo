<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'sku', 'material_id', 'purity_id', 'size', 'weight_grams',
        'price', 'compare_at_price', 'stock_quantity', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weight_grams' => 'decimal:3', 'price' => 'decimal:2', 'compare_at_price' => 'decimal:2',
            'stock_quantity' => 'integer', 'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function material(): BelongsTo { return $this->belongsTo(Material::class); }
    public function purity(): BelongsTo { return $this->belongsTo(Purity::class); }
}
