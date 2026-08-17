<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->string('sku')->unique();

            // Optional jewellery-specific variant information
            $table->foreignId('material_id')
                ->nullable()
                ->constrained('materials')
                ->nullOnDelete();

            $table->foreignId('purity_id')
                ->nullable()
                ->constrained('purities')
                ->nullOnDelete();

            // Variant options
            $table->string('size')->nullable();

            $table->decimal('weight_grams', 10, 3)->nullable();

            // Variant-specific price
            $table->decimal('price', 12, 2);

            $table->decimal('compare_at_price', 12, 2)->nullable();

            $table->unsignedInteger('stock_quantity')->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('product_id');
            $table->index('material_id');
            $table->index('purity_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
