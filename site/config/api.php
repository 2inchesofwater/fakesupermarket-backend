<?php

return [
  'routes' => [
    [
      'pattern' => 'products/all',
      'action' => function () {
        $products = page('products')->children()->listed();
        
        return $products->map(function ($product) {
          // Transform to a consistent format
          $data = [
            'id' => $product->product_id()->value(),
            'name' => $product->name()->value(),
            'description' => $product->description()->value(),
            'price' => $product->price()->toFloat(),
            'image' => $product->main_image()->toFile() ? $product->main_image()->toFile()->url() : null,
            'gallery' => $product->gallery()->toFiles()->map(function($file) {
              return $file->url();
            })->values(),
            'stock' => $product->stock()->toInt(),
            'category' => $product->category()->value(),
            'featured' => $product->featured()->toBool()
          ];
          
          // Add sale data if on sale
          if ($product->on_sale()->toBool()) {
            $data['on_sale'] = true;
            $data['sale_price'] = $product->sale_price()->toFloat();
            $data['discount_label'] = $product->discount_label()->value();
          }
          
          return $data;
        })->values();
      }
    ],
    [
      'pattern' => 'products/category/(:any)',
      'action' => function ($categorySlug) {
        $products = page('products')
          ->children()
          ->listed()
          ->filterBy('category', $categorySlug);
        
        // Use the same mapping function as above
        // ...
      }
    ],
    [
      'pattern' => 'products/featured',
      'action' => function () {
        $products = page('products')
          ->children()
          ->listed()
          ->filterBy('featured', true);
        
        // Use the same mapping function as above
        // ...
      }
    ]
  ]
];