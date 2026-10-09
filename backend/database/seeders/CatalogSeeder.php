<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Material;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categoryImages = [
            'earrings' => '/assets/products/earring-pearl-drop.jpg',
            'rings' => '/assets/products/hand-harness-ruby.jpg',
            'bangles' => '/assets/products/hand-harness-gold.jpg',
            'necklaces' => '/assets/products/hand-harness-pearl.jpg',
            'jhumka' => '/assets/products/earring-jhumka-closeup.jpg',
            'cuffs' => '/assets/products/earring-cuff.jpg',
            'tana' => '/assets/products/earring-long-pearl.jpg',
            'sets' => '/assets/products/hand-harness-ruby.jpg',
        ];

        foreach (['Earrings', 'Rings', 'Bangles', 'Necklaces', 'Jhumka', 'Cuffs', 'Tana', 'Sets'] as $position => $name) {
            $slug = Str::slug($name);
            Category::updateOrCreate(['slug' => Str::slug($name)], [
                'name' => $name,
                'image' => $categoryImages[$slug] ?? null,
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

        $productImages = [
            'gold-plated-floral-jhumka' => ['/assets/products/earring-jhumka-closeup.jpg', '/assets/products/earring-green-drop.jpg', '/assets/products/earring-white-stone.jpg', '/assets/products/earring-floral-stud.jpg'],
            'pearl-drop-earrings' => ['/assets/products/earring-pearl-drop.jpg', '/assets/products/earring-long-pearl.jpg', '/assets/products/earring-floral-drop.jpg', '/assets/products/earring-pearl-cuff.jpg'],
            'traditional-filigree-bangle-set' => ['/assets/products/hand-harness-gold.jpg'],
            'kundan-stone-necklace' => ['/assets/products/hand-harness-ruby.jpg'],
            'rose-gold-adjustable-ring' => ['/assets/products/hand-harness-ruby.jpg'],
            'silver-plated-cuff-bracelet' => ['/assets/products/hand-harness-gold.jpg'],
            'classic-tana-pendant-set' => ['/assets/products/hand-harness-pearl.jpg'],
            'bridal-gold-tone-jewellery-set' => ['/assets/products/hand-harness-ruby.jpg', '/assets/products/hand-harness-pearl.jpg'],
            'antique-chandbali-earrings' => ['/assets/products/earring-chandbali.jpg', '/assets/products/earring-gem-drop.jpg', '/assets/products/earring-purple-drop.jpg', '/assets/products/earring-gold-dangle.jpg', '/assets/products/earring-gold-stud.jpg'],
            'twisted-gold-bangle' => ['/assets/products/hand-harness-gold.jpg'],
            'layered-chain-necklace' => ['/assets/products/hand-harness-pearl.jpg'],
            'statement-cocktail-ring' => ['/assets/products/hand-harness-ruby.jpg'],
        ];

        foreach ($products as [$name, $categorySlug, $materialSlug, $price, $compareAt, $inStock, $newArrival, $bestSeller]) {
            $slug = Str::slug($name);
            $product = Product::updateOrCreate(['slug' => $slug], [
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

            foreach ($productImages[$slug] ?? [] as $sortOrder => $imageUrl) {
                ProductImage::updateOrCreate(
                    ['product_id' => $product->id, 'image_url' => $imageUrl],
                    [
                        'alt_text' => $name,
                        'sort_order' => $sortOrder,
                        'is_primary' => $sortOrder === 0,
                    ],
                );
            }
        }
    }
}
