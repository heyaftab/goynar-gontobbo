<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Basic product information
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description')->nullable();

            // Relationships
            $table->foreignId('category_id')
                ->constrained('categories')
                ->restrictOnDelete();

            $table->foreignId('material_id')
                ->constrained('materials')
                ->restrictOnDelete();

            $table->foreignId('purity_id')
                ->nullable()
                ->constrained('purities')
                ->nullOnDelete();

            // Jewellery information
            $table->decimal('weight_grams', 10, 3)->nullable();
            $table->decimal('making_charge', 12, 2)->default(0);

            // Selling price
            $table->decimal('price', 12, 2);

            // Inventory
            $table->unsignedInteger('stock_quantity')->default(0);

            // Product status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);

            $table->timestamps();

            // Indexes
            $table->index('category_id');
            $table->index('material_id');
            $table->index('purity_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
