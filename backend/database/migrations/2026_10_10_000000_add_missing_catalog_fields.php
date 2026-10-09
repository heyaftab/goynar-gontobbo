<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purities', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unique('name');
            $table->unique('slug');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->decimal('compare_at_price', 12, 2)->nullable()->after('price');
            $table->boolean('is_new_arrival')->default(false);
            $table->boolean('is_best_seller')->default(false);
        });

        DB::table('purities')->whereNull('name')->orderBy('id')->get(['id'])->each(function (object $purity): void {
            DB::table('purities')->where('id', $purity->id)->update([
                'name' => "Purity {$purity->id}",
                'slug' => "purity-{$purity->id}",
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('purities', function (Blueprint $table) {
            $table->dropUnique(['name']);
            $table->dropUnique(['slug']);
            $table->dropColumn(['name', 'slug', 'percentage', 'description', 'is_active']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['compare_at_price', 'is_new_arrival', 'is_best_seller']);
        });
    }
};
