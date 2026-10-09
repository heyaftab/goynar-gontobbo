<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purity extends Model
{
    protected $fillable = ['name', 'slug', 'percentage', 'description', 'is_active'];

    protected function casts(): array
    {
        return ['percentage' => 'decimal:2', 'is_active' => 'boolean'];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
