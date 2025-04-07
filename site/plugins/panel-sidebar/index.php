<?php

use Kirby\Cms\App as Kirby;

@include_once __DIR__.'/vendor/autoload.php';

Kirby::plugin('2inchesofwater/panel-sidebar', [
    // Register the section
    'sections' => [
        'sidebar' => [
            'props' => [
                'navigation' => [
                    'type' => 'array',
                    'default' => []
                ],
                'defaultView' => [
                    'type' => 'string'
                ]
            ],
            'computed' => [
                'items' => function () {
                    $items = [];
                    
                    if (is_array($this->navigation)) {
                        foreach ($this->navigation as $item) {
                            $items[] = [
                                'name'  => $item['name'] ?? uniqid('nav-'),
                                'label' => $item['label'] ?? 'Untitled',
                                'icon'  => $item['icon'] ?? 'page',
                                'view'  => $item['view'] ?? null
                            ];
                        }
                    }
                    
                    return $items;
                }
            ],
            'toArray' => function () {
                return [
                    'items' => $this->items(),
                    'defaultView' => $this->defaultView()
                ];
            }
        ]
    ],
    
    'panel' => [
        'scripts' => [
            'dist/index.js'
        ]
    ]
]);

?>