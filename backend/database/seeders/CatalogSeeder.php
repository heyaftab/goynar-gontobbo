<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Material;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Earrings', 'Rings', 'Bangles', 'Necklaces', 'Jhumka', 'Cuffs', 'Tana', 'Sets'] as $position => $name) {
            Category::updateOrCreate(['slug' => Str::slug($name)], [
                'name' => $name,
                'is_active' => true,
                'sort_order' => $position,
            ]);
        }

        $materials = collect(['Gold Plated', 'Silver Plated', 'Pearl', 'Kundan', 'Brass'])
            ->mapWithKeys(fn (string $name) => [Str::slug($name) => Material::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true],
            )]);

        $products = [
            ['Gold Plated Floral Jhumka', 'jhumka', 'gold-plated', 2850, 3500, true, true, true],
            ['Pearl Drop Earrings', 'earrings', 'pearl', 1950, null, true, true, false],
            ['Traditional Filigree Bangle Set', 'bangles', 'gold-plated', 4200, 5500, true, false, true],
            ['Kundan Stone Necklace', 'necklaces', 'kundan', 8500, null, true, true, false],
            ['Rose Gold Adjustable Ring', 'rings', 'gold-plated', 1200, null, true, false, false],
            ['Silver Plated Cuff Bracelet', 'cuffs', 'silver-plated', 3100, 3800, true, true, false],
            ['Classic Tana Pendant Set', 'tana', 'gold-plated', 5600, null, true, false, true],
            ['Bridal Gold Tone Jewellery Set', 'sets', 'brass', 12500, 15000, true, false, true],
            ['Antique Chandbali Earrings', 'earrings', 'gold-plated', 3400, null, true, true, false],
            ['Twisted Gold Bangle', 'bangles', 'gold-plated', 2100, 2600, true, false, false],
            ['Layered Chain Necklace', 'necklaces', 'gold-plated', 4800, null, true, false, true],
            ['Statement Cocktail Ring', 'rings', 'kundan', 2400, null, false, true, false],
        ];

        foreach ($products as [$name, $categorySlug, $materialSlug, $price, $compareAt, $inStock, $newArrival, $bestSeller]) {
            $slug = Str::slug($name);
            Product::updateOrCreate(['slug' => $slug], [
                'name' => $name,
                'sku' => Str::upper(Str::slug($name, '-')),
                'description' => "A thoughtfully designed {$name} from our jewellery collection.",
                'category_id' => Category::where('slug', $categorySlug)->value('id'),
                'material_id' => $materials[$materialSlug]->id,
                'price' => $price,
                'compare_at_price' => $compareAt,
                'making_charge' => 0,
                'stock_quantity' => $inStock ? 10 : 0,
                'is_active' => true,
                'is_featured' => $bestSeller,
                'is_new_arrival' => $newArrival,
                'is_best_seller' => $bestSeller,
            ]);
        }
    }
}
